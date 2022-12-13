import { NextFunction, Request, Response } from "express";
import { getCollections } from '../../db';

export async function handleGetCollections(req: Request, res: Response, next: NextFunction) {
  const { limit, page }: { limit?: string, page?: string } = req.query;
  try {
    const collections = await getCollections({
      limit: limit ? parseInt(limit, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined
    });

    res.status(200).end(JSON.stringify(collections, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}