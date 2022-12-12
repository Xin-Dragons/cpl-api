import express from "express";
import { collections, royalties, wallet } from './routers';

export function API() {
  const app = express();

  app.use('/wallet(s?)', wallet())
  app.use('/collection(s?)', collections())
  app.use('/royalties', royalties())

  return app;
}