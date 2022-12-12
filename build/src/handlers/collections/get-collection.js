"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCollection = void 0;
const db_1 = require("../../db");
async function handleGetCollection(req, res, next) {
    const { collection } = req.params;
    try {
        const collections = await (0, db_1.getCollection)({ collection });
        res.status(200).end(JSON.stringify(collections, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetCollection = handleGetCollection;
//# sourceMappingURL=get-collection.js.map