import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { handleGetAllCollections } from "./handlers/unscoped";
import { auth } from "./middleware/auth";
import { collections, royalties, wallet } from './routers';

export function API() {
  const app = express();

  app.use(helmet())
  app.use(morgan('combined'));

  app.use(auth)

  app.use('/wallet(s?)', wallet())
  app.use('/collection(s?)', collections())
  app.use('/royalties', royalties())

  app.get('/all-collections', handleGetAllCollections)

  return app;
}