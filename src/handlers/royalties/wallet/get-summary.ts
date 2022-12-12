import { NextFunction, Request, Response } from "express";
import { getWalletSummary } from '../../../db';

export async function handleGetSummary(req: Request, res: Response, next: NextFunction) {
  const { publicKey } = req.params;

  try {
    const summary = await getWalletSummary({ publicKey });

    res.status(200).end(JSON.stringify(summary, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}