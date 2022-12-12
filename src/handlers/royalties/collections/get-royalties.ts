import { NextFunction, Request, Response } from "express";
import { getRoyalties } from '../../../db';

export async function handleGetRoyalties(req: Request, res: Response, next: NextFunction) {
  const { collection, type } = req.params;
  const { before, after } : { before?: string, after?: string } = req.query;
  try {
    if (type && !['paid', 'unpaid'].includes(type)) {
      throw new Error('Type can only be paid or unpaid');
    }

    const royalties = await getRoyalties({ collection, type, before, after });

    res.status(200).end(JSON.stringify(royalties, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}