import express from "express";
import { handleGetAllCollections } from "./handlers/unscoped";
import { collections, royalties, wallet } from './routers';

export function API() {
  const app = express();

  app.use('/wallet(s?)', wallet())
  app.use('/collection(s?)', collections())
  app.use('/royalties', royalties())

  app.get('/all-collections', handleGetAllCollections)

  return app;
}