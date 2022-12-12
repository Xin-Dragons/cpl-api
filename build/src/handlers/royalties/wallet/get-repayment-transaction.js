"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRepaymentTransaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const db_1 = require("../../../db");
const bs58_1 = __importDefault(require("bs58"));
const bn_js_1 = __importDefault(require("bn.js"));
const MEMO_PROGRAM_KEY = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const connection = new web3_js_1.Connection(process.env.RPC_URL, 'confirmed');
async function getRepaymentTransaction({ publicKey, creators, debt, mint }) {
    const instructions = creators.filter(c => c.share).map(c => {
        const instruction = web3_js_1.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new web3_js_1.PublicKey(c.address),
            lamports: debt
                .div(new bn_js_1.default(100))
                .mul(new bn_js_1.default(c.share))
                .toNumber()
        });
        instruction.keys.push({
            pubkey: mint,
            isSigner: false,
            isWritable: false
        });
        return instruction;
    });
    instructions.push(new web3_js_1.TransactionInstruction({
        keys: [
            {
                pubkey: publicKey,
                isSigner: true,
                isWritable: true
            }
        ],
        data: Buffer.from("ROYALTY REPAYMENT", 'utf-8'),
        programId: new web3_js_1.PublicKey(MEMO_PROGRAM_KEY),
    }));
    const txn = new web3_js_1.Transaction().add(...instructions);
    txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    txn.feePayer = publicKey;
    return bs58_1.default.encode(txn.serialize({ verifySignatures: false }));
}
async function handleGetRepaymentTransaction(req, res, next) {
    const publicKey = req.params.publicKey;
    const mint = req.params.mint;
    try {
        const sale = await (0, db_1.getMostRecentSale)({ mint });
        if (!sale) {
            throw new Error('No sale found for mint');
        }
        if (!sale.debt_lamports) {
            throw new Error('No debt found for mint');
        }
        if (sale.settled) {
            throw new Error('Royalties already repaid for mint');
        }
        const txn = await getRepaymentTransaction({
            publicKey: new web3_js_1.PublicKey(publicKey),
            debt: new bn_js_1.default(sale.debt_lamports),
            creators: sale.creators,
            mint: new web3_js_1.PublicKey(sale.mint)
        });
        res.status(200).end(JSON.stringify(txn, null, 2));
    }
    catch (err) {
        console.error(err.stack);
        next(err);
    }
}
exports.handleGetRepaymentTransaction = handleGetRepaymentTransaction;
//# sourceMappingURL=get-repayment-transaction.js.map