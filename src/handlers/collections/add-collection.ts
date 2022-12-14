import { NextFunction, Request, Response } from "express";
import { addCollection } from '../../db';

export async function handleAddCollection(req: Request, res: Response, next: NextFunction) {
  const { 
    name,
    symbol,
    slug,
    collection,
    updateAuthority,
    firstVerifiedCreator,
    image,
    description
  } = req.body
  try {
    [name, symbol, slug, updateAuthority, firstVerifiedCreator, image].forEach(required => {
      if (!required) {
        throw new Error('Missing params')
      }
    })

    const newCollection = await addCollection({ name, symbol, slug, collection, updateAuthority, firstVerifiedCreator, image, description });

    res.status(200).end(JSON.stringify(newCollection, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}