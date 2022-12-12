"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRecentSales = void 0;
const db_1 = require("../../../db");
async function handleGetRecentSales(req, res, next) {
    const { publicKey } = req.params;
    const { limit } = req.query;
    try {
        const recentSales = await (0, db_1.getRecentSales)({ publicKey, limit: limit ? parseInt(limit, 10) : undefined });
        res.status(200).end(JSON.stringify(recentSales, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetRecentSales = handleGetRecentSales;
//# sourceMappingURL=get-recent-sales.js.map