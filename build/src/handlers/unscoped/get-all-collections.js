"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAllCollections = void 0;
const db_1 = require("../../db");
async function handleGetAllCollections(req, res, next) {
    try {
        const collections = await (0, db_1.getCollections)();
        res.status(200).end(JSON.stringify(collections, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetAllCollections = handleGetAllCollections;
//# sourceMappingURL=get-all-collections.js.map