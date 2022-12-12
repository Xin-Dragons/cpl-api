"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCollections = void 0;
const db_1 = require("../../db");
async function handleGetCollections(req, res, next) {
    const { limit } = req.query;
    try {
        const collections = await (0, db_1.getCollections)({ limit: limit ? parseInt(limit, 10) : undefined });
        res.status(200).end(JSON.stringify(collections, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetCollections = handleGetCollections;
//# sourceMappingURL=get-collections.js.map