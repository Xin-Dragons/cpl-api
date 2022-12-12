"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMints = void 0;
const db_1 = require("../../db");
async function handleGetMints(req, res, next) {
    const { collection } = req.params;
    const { limit, offset, orderBy, publicKey } = req.query;
    try {
        const mints = await (0, db_1.getMints)({
            collection,
            limit: limit ? parseInt(limit, 10) : undefined,
            offset: offset ? parseInt(offset, 10) : undefined,
            orderBy,
            publicKey
        });
        res.status(200).end(JSON.stringify(mints, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetMints = handleGetMints;
//# sourceMappingURL=get-mints.js.map