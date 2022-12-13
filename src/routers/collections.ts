import { Router } from "express";
import { handleGetMints, handleGetMint, handleGetCollection, handleGetHolders, handleGetCollections } from '../handlers/collections';
import { limiter } from "../middleware";
import { handleGetLeaderboard } from "../handlers/royalties/wallet";

export function collections() {
  const router = Router({ mergeParams: true });

  router.use(limiter(10, 1))

  router.get('/', handleGetCollections)
  router.get('/collection-info', handleGetCollection)
  router.get('/:collection', handleGetCollection)
  router.get('/:collection/holders', handleGetHolders)
  router.get('/:collection/wallets', handleGetLeaderboard)
  router.get('/:collection/mints', handleGetMints)
  router.get('/:collection/mint(s)/:mint', handleGetMint)

  return router;
}