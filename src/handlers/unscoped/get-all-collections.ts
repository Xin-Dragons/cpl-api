import { NextFunction, Request, Response } from "express";
import { getAllCollections } from '../../db';

export async function handleGetAllCollections(req: Request, res: Response, next: NextFunction) {
  try {
    const collections = await getAllCollections()

    res.status(200).end(JSON.stringify(collections, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}