import { NextFunction, Request, Response } from "express";
import { getHolders } from '../../db';

export async function handleGetHolders(req: Request, res: Response, next: NextFunction) {
  const { collection } = req.params
  try {
    const holders = await getHolders({ collection });

    res.status(200).end(JSON.stringify(holders, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}