import { Router } from "express";
import { handleGetMints } from "../handlers/collections";
import {
  handleGetSummary,
  handleGetOutstanding,
  handleGetRepaid,
  handleGetPaid,
  handleGetLeaderboard,
  handleGetRecentSales,
  handleGetRepaymentTransaction,
  handleSendRepaymentTransaction
} from '../handlers/royalties/wallet';
import { limiter } from '../middleware';
import bodyParser from 'body-parser';

export function wallet() {
  const router = Router({ mergeParams: true });

  router.use(limiter(10, 1))

  router.get('/', handleGetLeaderboard);
  router.get('/:publicKey', handleGetSummary)
  router.get('/:publicKey/unpaid', handleGetOutstanding)
  router.get('/:publicKey/repaid', handleGetRepaid)
  router.get('/:publicKey/paid', handleGetPaid)
  router.get('/:publicKey/mints', handleGetMints)
  router.get('/:publicKey/recent-sales', handleGetRecentSales)
  router.get('/:publicKey/get-repayment-transaction/:mint', handleGetRepaymentTransaction)
  router.post('/:publicKey/send-repayment-transaction', bodyParser.json(), handleSendRepaymentTransaction)
  
  return router;
}