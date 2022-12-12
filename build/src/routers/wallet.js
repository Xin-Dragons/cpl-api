"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet = void 0;
const express_1 = require("express");
const collections_1 = require("../handlers/collections");
const wallet_1 = require("../handlers/royalties/wallet");
const middleware_1 = require("../middleware");
const body_parser_1 = __importDefault(require("body-parser"));
function wallet() {
    const router = (0, express_1.Router)({ mergeParams: true });
    router.use((0, middleware_1.limiter)(10, 1));
    router.get('/', wallet_1.handleGetLeaderboard);
    router.get('/:publicKey', wallet_1.handleGetSummary);
    router.get('/:publicKey/unpaid', wallet_1.handleGetOutstanding);
    router.get('/:publicKey/repaid', wallet_1.handleGetRepaid);
    router.get('/:publicKey/paid', wallet_1.handleGetPaid);
    router.get('/:publicKey/mints', collections_1.handleGetMints);
    router.get('/:publicKey/recent-sales', wallet_1.handleGetRecentSales);
    router.get('/:publicKey/get-repayment-transaction/:mint', wallet_1.handleGetRepaymentTransaction);
    router.post('/:publicKey/send-repayment-transaction', body_parser_1.default.json(), wallet_1.handleSendRepaymentTransaction);
    return router;
}
exports.wallet = wallet;
//# sourceMappingURL=wallet.js.map