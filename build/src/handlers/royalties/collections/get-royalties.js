"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRoyalties = void 0;
const db_1 = require("../../../db");
async function handleGetRoyalties(req, res, next) {
    const { collection, type } = req.params;
    const { before, after } = req.query;
    try {
        if (type && !['paid', 'unpaid'].includes(type)) {
            throw new Error('Type can only be paid or unpaid');
        }
        const royalties = await (0, db_1.getRoyalties)({ collection, type, before, after });
        res.status(200).end(JSON.stringify(royalties, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetRoyalties = handleGetRoyalties;
//# sourceMappingURL=get-royalties.js.map