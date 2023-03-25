import { Router } from "express";
import { handleGetMints, handleGetMint, handleGetCollection, handleGetHolders, handleGetCollections, handleAddCollection } from '../handlers/collections';
import { limiter } from "../middleware";
import { handleGetLeaderboard } from "../handlers/royalties/wallet";
import { validateMessage } from "../middleware/validate-message";
import bodyParser from 'body-parser';
import { handleGetCollectionRoyalties } from "../handlers/collections/get-collection-royalties";

export function collections() {
  const router = Router({ mergeParams: true });

  router.use(limiter(1, 2))

  router.get('/', handleGetCollections)
  router.post('/', bodyParser.json(), validateMessage('new-collection'), handleAddCollection)
  router.get('/collection-info', handleGetCollection)
  router.get('/:collection', handleGetCollection)
  router.get('/:collection/holders', handleGetHolders)
  router.get('/:collection/wallets', handleGetLeaderboard)
  router.get('/:collection/mints', handleGetMints)
  router.get('/:collection/mint(s)/:mint', handleGetMint)
  router.get('/:collection/royalties/:mint?', handleGetCollectionRoyalties)

  return router;
}