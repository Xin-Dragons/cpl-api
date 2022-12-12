"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSendRepaymentTransaction = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const db_1 = require("../../../db");
const helpers_1 = require("../../../helpers");
async function handleSendRepaymentTransaction(req, res, next) {
    const { rawTransaction, mint } = req.body;
    const { publicKey } = req.params;
    if (!rawTransaction || !publicKey) {
        return res.status(500).send('Missing params');
    }
    let txnId;
    try {
        txnId = await helpers_1.connection.sendRawTransaction(rawTransaction, { skipPreflight: true });
        await (0, db_1.royaltiesRepaymentStarted)({ publicKey, txnId, mint });
        const txn = await (0, helpers_1.pollTransaction)(txnId);
        if (txn && !txn.meta.err) {
            await (0, db_1.royaltiesRepaymentCompleted)({ txnId, success: true, mint });
            return res.status(200).send('OK');
        }
        else {
            await (0, db_1.royaltiesRepaymentCompleted)({ txnId, success: false, mint });
            return next(new Error('Failed to send repayment'));
        }
    }
    catch (err) {
        const isTimeout = err.message.includes('Timed out waiting for confirmation');
        if (isTimeout) {
            (0, child_process_1.fork)(path_1.default.resolve(__dirname, '../../../workers/check-repayment-txn.worker.js'), [txnId, mint], { cwd: process.cwd() });
            return next(new Error('Timeout waiting for confirmation.\n\nWe will keep trying for 3 mins.\n\nCheck again after 3 mins to retry claim if not confirmed'));
        }
        else {
            console.log(err);
            try {
                await (0, db_1.royaltiesRepaymentCompleted)({ txnId: txnId, success: false, mint });
            }
            catch (err) {
                console.log(err);
            }
            finally {
                return next(new Error('Failed to send repayment'));
            }
        }
    }
}
exports.handleSendRepaymentTransaction = handleSendRepaymentTransaction;
//# sourceMappingURL=send-repayment-transaction.js.map