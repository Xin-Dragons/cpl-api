import { NextFunction, Request, Response } from "express";
import path from 'path';
import { fork } from 'child_process';
import { royaltiesRepaymentStarted, royaltiesRepaymentCompleted } from '../../../db';
import { pollTransaction, connection } from '../../../helpers';

export async function handleSendRepaymentTransaction(req: Request, res: Response, next: NextFunction) {
  const { rawTransaction, mint } = req.body;
  const { publicKey } = req.params;

  if (!rawTransaction || !publicKey) {
    return res.status(500).send('Missing params');
  }

  let txnId;

  try {
    txnId = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true });
    await royaltiesRepaymentStarted({ publicKey, txnId, mint });

    const txn = await pollTransaction(txnId);

    if (txn && !txn.meta.err) {
      await royaltiesRepaymentCompleted({ txnId, success: true, mint })
      return res.status(200).send('OK');
    } else {
      await royaltiesRepaymentCompleted({ txnId, success: false, mint })
      return next(new Error('Failed to send repayment'))
    }
  } catch (err: any) {
    const isTimeout = err.message.includes('Timed out waiting for confirmation');

    if (isTimeout) {
      fork(path.resolve(__dirname, '../../../workers/check-repayment-txn.worker.js'), [txnId, mint], { cwd: process.cwd() })
      return next(new Error('Timeout waiting for confirmation.\n\nWe will keep trying for 3 mins.\n\nCheck again after 3 mins to retry claim if not confirmed'))
    } else {
      console.log(err)
      try {
        await royaltiesRepaymentCompleted({ txnId: txnId as string, success: false, mint })
      } catch (err) {
        console.log(err)
      } finally {
        return next(new Error('Failed to send repayment'))
      }
    }
  }
}
