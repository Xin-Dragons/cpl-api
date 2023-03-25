import { NextFunction, Request, Response } from "express";
import { getCollectionWithRoyalties } from "../../db";

export async function handleGetCollectionRoyalties(req: Request, res: Response, next: NextFunction) {
  try {
    const { mint, collection } = req.params;
    const publicKey = req.query.publicKey as string | undefined;
    const result = await getCollectionWithRoyalties(collection, mint, publicKey)
    res.status(200).end(JSON.stringify(result, null, 2));
  } catch (err) {
    next(err);
  }
}