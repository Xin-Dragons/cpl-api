"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentBlockhash = exports.connection = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.connection = new web3_js_1.Connection(process.env.RPC_URL, 'confirmed');
async function getRecentBlockhash() {
    const blockhash = (await exports.connection.getRecentBlockhash()).blockhash;
    return blockhash;
}
exports.getRecentBlockhash = getRecentBlockhash;
//# sourceMappingURL=connection.js.map