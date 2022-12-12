import { NextFunction, Request, Response } from "express";
import { getSummary } from '../../db';

export async function handleGetSummary(req: Request, res: Response, next: NextFunction) {
  const { publicKey }: { publicKey?: string } = req.query;
  try {
    const summary = await getSummary({ publicKey });

    res.status(200).end(JSON.stringify(summary, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}