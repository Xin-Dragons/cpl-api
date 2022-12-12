"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetLeaderboard = void 0;
const db_1 = require("../../../db");
async function handleGetLeaderboard(req, res, next) {
    const { collection } = req.params;
    let { limit } = req.query;
    try {
        const summary = await (0, db_1.getLeaderboard)({ limit: limit ? parseInt(limit) : undefined, collection });
        res.status(200).end(JSON.stringify(summary, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetLeaderboard = handleGetLeaderboard;
//# sourceMappingURL=get-leaderboard.js.map