"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionRoyalties = void 0;
const express_1 = require("express");
const collections_1 = require("../handlers/royalties/collections");
const middleware_1 = require("../middleware");
function collectionRoyalties() {
    const router = (0, express_1.Router)({ mergeParams: true });
    router.use((0, middleware_1.limiter)(1, 1));
    router.get('/', collections_1.handleGetSummary);
    router.get('/mints/:type?', collections_1.handleGetRoyalties);
    return router;
}
exports.collectionRoyalties = collectionRoyalties;
//# sourceMappingURL=collection-royalties.js.map