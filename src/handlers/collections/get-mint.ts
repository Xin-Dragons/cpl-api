import { NextFunction, Request, Response } from "express";
import { getMint } from '../../db';

export async function handleGetMint(req: Request, res: Response, next: NextFunction) {
  const { collection, mint } = req.params
  try {
    const m = await getMint({ collection, mint });
    
    res.status(200).end(JSON.stringify(m, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}