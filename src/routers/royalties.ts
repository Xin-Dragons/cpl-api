import { Router } from "express";
import { handleGetSummary } from '../handlers/royalties';
import { collectionRoyalties } from './';
import { limiter } from "../middleware";

export function royalties() {
  const router = Router({ mergeParams: true });

  router.use(limiter(1, 1))

  router.get('/', handleGetSummary)

  router.use('/collections/:collection', collectionRoyalties())

  return router;
}