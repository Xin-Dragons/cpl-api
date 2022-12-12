"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const helpers_1 = require("../helpers");
const MAX_RETRIES = 45;
(async () => {
    const txnId = process.argv[2];
    const mint = process.argv[3];
    console.log(`Started polling: ${txnId}`);
    let confirmed = false;
    try {
        const txn = await (0, helpers_1.pollTransaction)(txnId, MAX_RETRIES);
        confirmed = txn && !txn.meta.err;
    }
    catch (err) {
        if (err.message.includes('Timed out waiting for confirmation')) {
            confirmed = false;
        }
        else {
            throw err;
        }
    }
    try {
        const pending = await (0, db_1.getPendingRoyaltiesRepaymentTransaction)({ mint, txnId });
        if (pending.change_id === txnId) {
            console.log('updating db from worker');
            await (0, db_1.royaltiesRepaymentCompleted)({ mint, txnId, success: confirmed });
        }
        console.log(`Done polling: successful: ${confirmed}`);
    }
    catch (err) {
        console.error('Error updating db from worker');
        console.error(err);
    }
})();
//# sourceMappingURL=check-repayment-transaction.worker.js.map