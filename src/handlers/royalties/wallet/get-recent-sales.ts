import { NextFunction, Request, Response } from "express";
import { getRecentSales } from '../../../db';

export async function handleGetRecentSales(req: Request, res: Response, next: NextFunction) {
  const { publicKey } = req.params;
  const { limit }: { limit?: string } = req.query;

  try {
    const recentSales = await getRecentSales({ publicKey, limit: limit ? parseInt(limit, 10) : undefined });

    res.status(200).end(JSON.stringify(recentSales, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}