import { NextFunction, Request, Response } from "express";
import { getMints } from '../../db';

export async function handleGetMints(req: Request, res: Response, next: NextFunction) {
  const { collection } = req.params;
  const { limit, offset, orderBy, publicKey }: { limit?: string, offset?: string, orderBy?: string, publicKey?: string } = req.query;
  try {
    const mints = await getMints({
      collection,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      orderBy,
      publicKey
    });

    res.status(200).end(JSON.stringify(mints, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}