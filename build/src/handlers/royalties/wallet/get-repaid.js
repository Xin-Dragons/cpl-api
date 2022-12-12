"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRepaid = void 0;
const db_1 = require("../../../db");
async function handleGetRepaid(req, res, next) {
    const { publicKey } = req.params;
    try {
        const summary = await (0, db_1.getRepaidForWallet)({ publicKey });
        res.status(200).end(JSON.stringify(summary, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetRepaid = handleGetRepaid;
//# sourceMappingURL=get-repaid.js.map