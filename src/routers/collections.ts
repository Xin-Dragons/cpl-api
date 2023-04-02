import { Router } from "express";
import { handleGetMints, handleGetMint, handleGetCollection, handleGetHolders, handleGetCollections, handleAddCollection } from '../handlers/collections';
import { limiter } from "../middleware";
import { handleGetLeaderboard } from "../handlers/royalties/wallet";
import { validateMessage } from "../middleware/validate-message";
import bodyParser from 'body-parser';
import { handleGetCollectionRoyalties } from "../handlers/collections/get-collection-royalties";
import { handleGetSalesOverTime } from "../handlers/collections/get-sales-over-time";
import { handleGetWeeklyLeaders } from "../handlers/collections/get-weekly-leaders";

export function collections() {
  const router = Router({ mergeParams: true });

  router.use(limiter(1, 2))

  router.get('/', handleGetCollections)
  router.post('/', bodyParser.json(), validateMessage('new-collection'), handleAddCollection)
  router.get('/weekly-leaders', handleGetWeeklyLeaders)
  router.get('/collection-info', handleGetCollection)
  router.get('/:collection', handleGetCollection)
  router.get('/:collection/holders', handleGetHolders)
  router.get('/:collection/sales-over-time', handleGetSalesOverTime)
  router.get('/:collection/wallets', handleGetLeaderboard)
  router.get('/:collection/mints', handleGetMints)
  router.get('/:collection/mint(s)/:mint', handleGetMint)
  router.get('/:collection/royalties/:mint?', handleGetCollectionRoyalties)

  return router;
}