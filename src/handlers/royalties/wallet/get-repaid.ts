import { NextFunction, Request, Response } from "express";
import { getRepaidForWallet } from '../../../db';

export async function handleGetRepaid(req: Request, res: Response, next: NextFunction) {
  const { publicKey } = req.params;

  try {
    const summary = await getRepaidForWallet({ publicKey });

    res.status(200).end(JSON.stringify(summary, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}