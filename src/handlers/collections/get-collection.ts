import { NextFunction, Request, Response } from "express";
import { getCollection } from '../../db';

export async function handleGetCollection(req: Request, res: Response, next: NextFunction) {
  const { collection } = req.params
  try {
    const collections = await getCollection({ collection });

    res.status(200).end(JSON.stringify(collections, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}