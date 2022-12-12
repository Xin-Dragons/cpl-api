import { NextFunction, Request, Response } from "express";
import { getLeaderboard } from '../../../db';

export async function handleGetLeaderboard(req: Request, res: Response, next: NextFunction) {
  const { collection } = req.params;
  let { limit }: { limit?: string } = req.query;
  try {
    const summary = await getLeaderboard({ limit: limit ? parseInt(limit) : undefined, collection });

    res.status(200).end(JSON.stringify(summary, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}