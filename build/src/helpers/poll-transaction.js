"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollTransaction = void 0;
const _1 = require("./");
// default 14 * 2 seconds = 28 seconds
async function pollTransaction(txnId, retries = 14) {
    if (retries <= 0) {
        throw new Error('Timed out waiting for confirmation');
    }
    try {
        console.log(`Polling txn: ${txnId}\n\nRetries remaining: ${retries}`);
        const txn = await _1.connection.getTransaction(txnId);
        if (txn) {
            return txn;
        }
        else {
            await (0, _1.sleep)(2000);
            return pollTransaction(txnId, retries - 1);
        }
    }
    catch (_a) {
        await (0, _1.sleep)(2000);
        return pollTransaction(txnId, retries - 1);
    }
}
exports.pollTransaction = pollTransaction;
//# sourceMappingURL=poll-transaction.js.map