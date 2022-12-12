"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetHolders = void 0;
const db_1 = require("../../db");
async function handleGetHolders(req, res, next) {
    const { collection } = req.params;
    try {
        const holders = await (0, db_1.getHolders)({ collection });
        res.status(200).end(JSON.stringify(holders, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetHolders = handleGetHolders;
//# sourceMappingURL=get-holders.js.map