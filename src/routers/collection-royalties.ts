import { Router } from "express";
import { handleGetSummary, handleGetRoyalties } from '../handlers/royalties/collections';
import { limiter } from '../middleware';

export function collectionRoyalties() {
  const router = Router({ mergeParams: true });

  router.use(limiter(1, 1))

  router.get('/', handleGetSummary)
  router.get('/mints/:type?', handleGetRoyalties)

  return router;
}