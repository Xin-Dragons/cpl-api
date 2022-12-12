"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMint = void 0;
const db_1 = require("../../db");
async function handleGetMint(req, res, next) {
    const { collection, mint } = req.params;
    try {
        const m = await (0, db_1.getMint)({ collection, mint });
        res.status(200).end(JSON.stringify(m, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetMint = handleGetMint;
//# sourceMappingURL=get-mint.js.map