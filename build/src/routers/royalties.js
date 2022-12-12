"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.royalties = void 0;
const express_1 = require("express");
const royalties_1 = require("../handlers/royalties");
const _1 = require("./");
const middleware_1 = require("../middleware");
function royalties() {
    const router = (0, express_1.Router)({ mergeParams: true });
    router.use((0, middleware_1.limiter)(1, 1));
    router.get('/', royalties_1.handleGetSummary);
    router.use('/collections/:collection', (0, _1.collectionRoyalties)());
    return router;
}
exports.royalties = royalties;
//# sourceMappingURL=royalties.js.map