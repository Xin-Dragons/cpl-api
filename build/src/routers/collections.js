"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
const express_1 = require("express");
const collections_1 = require("../handlers/collections");
const middleware_1 = require("../middleware");
const wallet_1 = require("../handlers/royalties/wallet");
function collections() {
    const router = (0, express_1.Router)({ mergeParams: true });
    router.use((0, middleware_1.limiter)(10, 1));
    router.get('/', collections_1.handleGetCollections);
    router.get('/:collection', collections_1.handleGetCollection);
    router.get('/:collection/holders', collections_1.handleGetHolders);
    router.get('/:collection/wallets', wallet_1.handleGetLeaderboard);
    router.get('/:collection/mints', collections_1.handleGetMints);
    router.get('/:collection/mint(s)/:mint', collections_1.handleGetMint);
    return router;
}
exports.collections = collections;
//# sourceMappingURL=collections.js.map