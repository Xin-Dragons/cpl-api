"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.royaltiesRepaymentCompleted = exports.getPendingRoyaltiesRepaymentTransaction = exports.royaltiesRepaymentStarted = exports.getMostRecentSale = exports.getRecentSales = exports.getLeaderboard = exports.getPaidForWallet = exports.getRepaidForWallet = exports.getOutstandingForWallet = exports.getWalletSummary = exports.getRoyalties = exports.getSummary = exports.getHolders = exports.getMint = exports.getMints = exports.getRpcHosts = exports.getCollection = exports.getCollections = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const lodash_1 = require("lodash");
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("./utils");
const DB_URL = process.env.DB_URL;
const DB_SECRET = process.env.DB_SECRET;
if (!DB_URL || !DB_SECRET) {
    throw new Error('Fatal, missing DB params');
}
const supabase = (0, supabase_js_1.createClient)(DB_URL, DB_SECRET);
async function getCollections({ limit } = {}) {
    const { data, error } = await supabase
        .rpc('get_collections_with_royalties', { rows: limit });
    if (error) {
        console.error(error);
        throw new Error('Error looking up collections');
    }
    return data;
}
exports.getCollections = getCollections;
async function getCollection({ collection }) {
    const { data, error } = await supabase
        .from('collections')
        .select(`
      id,
      collection,
      first_verified_creator,
      update_authority,
      name,
      image,
      description,
      project,
      symbol
    `)
        .eq('id', collection)
        .limit(1)
        .single();
    if (error) {
        console.error(error);
        throw new Error('Error looking up collection');
    }
    return data;
}
exports.getCollection = getCollection;
async function getRpcHosts() {
    const { data, error } = await supabase
        .from('**rpc-providers')
        .select('url');
    if (error) {
        throw new Error('Error looking up rpc hosts');
    }
    return data.map(d => d.url);
}
exports.getRpcHosts = getRpcHosts;
async function getMints({ collection, limit, offset, orderBy, publicKey }) {
    const method = orderBy === 'debt_lamports'
        ? 'get_mints_with_royalties_for_collection_sort_by_outstanding'
        : 'get_mints_with_royalties_for_collection_sort_by_paid';
    const { data, error } = await supabase
        .rpc(method, { coll: collection, rows: limit, start: offset, order_by: orderBy, public_key: publicKey });
    if (error) {
        console.error(error);
        throw new Error('Error looking up mints for collection');
    }
    return data;
}
exports.getMints = getMints;
async function getMint({ collection, mint }) {
    const { data, error } = await supabase
        .from('nfts')
        .select(`*`)
        .eq('collection', collection)
        .eq('mint', mint)
        .limit(1)
        .single();
    if (error) {
        console.error(error);
        throw new Error('Error looking up mint');
    }
    return (0, lodash_1.omit)({
        ...data,
        holder: data.holder === '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix' ? 'Magic Eden' : data.holder
    }, 'created_at');
}
exports.getMint = getMint;
async function getHolders({ collection }) {
    const { data, error } = await supabase
        .from('nfts')
        .select('mint, holder')
        .eq('collection', collection);
    if (error) {
        console.error(error);
        throw new Error('Error looking up holders');
    }
    return data
        .map(item => {
        return {
            ...item,
            holder: item.holder === '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix' ? 'Magic Eden' : item.holder
        };
    })
        .reduce((all, item) => {
        return {
            ...all,
            [item.holder]: all[item.holder] ? [
                ...all[item.holder],
                item.mint
            ] : [item.mint]
        };
    }, {});
}
exports.getHolders = getHolders;
async function getSummary({ collection, publicKey } = {}) {
    console.log({ publicKey });
    const { data, error } = await supabase
        .rpc('get_royalties_summary', { coll: collection, public_key: publicKey });
    if (error) {
        console.log(error);
        throw new Error('Error looking up summary');
    }
    console.log(data);
    return data;
}
exports.getSummary = getSummary;
async function getRoyalties({ collection, type, before, after }) {
    const { data, error } = await supabase
        .rpc('get_royalties_for_collection', { coll: collection, before, after });
    if (error) {
        console.log(error);
        throw new Error('Error looking up royalties');
    }
    const paid = data.filter(i => i.debt && !i.settled).map(item => item.mint);
    const unpaid = data.filter(i => !i.debt || i.settled).map(item => item.mint);
    if (type === 'unpaid') {
        return unpaid;
    }
    if (type === 'paid') {
        return paid;
    }
    return {
        paid,
        unpaid
    };
}
exports.getRoyalties = getRoyalties;
function formatSummary(data, pretty) {
    return (0, lodash_1.mapValues)(data, (item, key) => {
        if (!item || (typeof item === 'string')) {
            return item;
        }
        const number = key === 'paid' ? (item / web3_js_1.LAMPORTS_PER_SOL).toFixed(2) : (item || 0).toFixed(2);
        return pretty ? (0, utils_1.numberWithCommas)(number) : number;
    });
}
async function getWalletSummary({ publicKey, pretty = false }) {
    const { data, error } = await supabase
        .rpc('get_royalties_for_wallet', { public_key: publicKey });
    if (error) {
        console.log(error);
        throw new Error('Error looking up summary for wallet');
    }
    return formatSummary(data, pretty);
}
exports.getWalletSummary = getWalletSummary;
async function getOutstandingForWallet({ publicKey }) {
    const { data, error } = await supabase
        .rpc('get_outstanding_for_wallet', { public_key: publicKey });
    if (error) {
        console.log(error);
        throw new Error('Error looking up unpaid for wallet');
    }
    return data;
}
exports.getOutstandingForWallet = getOutstandingForWallet;
async function getRepaidForWallet({ publicKey }) {
    const { data, error } = await supabase
        .rpc('get_repaid_for_wallet', { public_key: publicKey });
    if (error) {
        console.log(error);
        throw new Error('Error looking up repaid for wallet');
    }
    return data;
}
exports.getRepaidForWallet = getRepaidForWallet;
async function getPaidForWallet({ publicKey }) {
    const { data, error } = await supabase
        .rpc('get_paid_for_wallet', { public_key: publicKey });
    if (error) {
        console.log(error);
        throw new Error('Error looking up paid for wallet');
    }
    return data;
}
exports.getPaidForWallet = getPaidForWallet;
async function getLeaderboard({ limit, collection }) {
    const { data, error } = await supabase
        .rpc('get_leaderboard', { rows: limit, coll: collection });
    if (error) {
        console.log(error);
        throw new Error('Error looking up leaderboard');
    }
    return data;
}
exports.getLeaderboard = getLeaderboard;
async function getRecentSales({ publicKey, limit }) {
    const { data, error } = await supabase
        .rpc('get_recent_sales', { public_key: publicKey, rows: limit });
    if (error) {
        console.log(error);
        throw new Error('Error looking up recent sales');
    }
    return data;
}
exports.getRecentSales = getRecentSales;
async function getMostRecentSale({ mint }) {
    const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('mint', mint)
        .order('sale_date', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        throw new Error('Error looking up last sale for mint');
    }
    if (!data) {
        throw new Error('No sale found for mint');
    }
    return data;
}
exports.getMostRecentSale = getMostRecentSale;
async function royaltiesRepaymentStarted({ publicKey, txnId, mint }) {
    const { data, error } = await supabase
        .from('**transactions')
        .insert({
        change_id: txnId,
        address: publicKey,
        type: 'royalties-repayment',
        ref_id: mint
    });
    if (error) {
        console.log(error);
        throw new Error('Error marking transaction started');
    }
    return data;
}
exports.royaltiesRepaymentStarted = royaltiesRepaymentStarted;
async function getPendingRoyaltiesRepaymentTransaction({ txnId, mint }) {
    const { data, error } = await supabase
        .from('**transactions')
        .select('*')
        .eq('ref_id', mint)
        .eq('change_id', txnId)
        .eq('type', 'royalties-repayment')
        .is('pending', true)
        .limit(1)
        .single();
    if (error) {
        console.log(error);
        throw new Error('Error looking up repayment txn');
    }
    return data;
}
exports.getPendingRoyaltiesRepaymentTransaction = getPendingRoyaltiesRepaymentTransaction;
async function royaltiesRepaymentCompleted({ txnId, mint, success }) {
    const txn = await getPendingRoyaltiesRepaymentTransaction({ txnId, mint });
    const { data, error } = await supabase
        .from('**transactions')
        .update({ pending: false, success })
        .eq('id', txn.id);
    if (success) {
        const sale = await supabase
            .from('sales')
            .select('*')
            .eq('mint', mint)
            .order('sale_date', { ascending: false })
            .limit(1)
            .single();
        if (sale.error) {
            throw new Error('Error looking up sale record');
        }
        const { data, error } = await supabase
            .from('sales')
            .update({
            settled: new Date().toUTCString(),
            repayment_transaction: txnId,
            repaid_by: txn.address
        })
            .match({ id: sale.data.id, mint: sale.data.mint });
        // const { data, error } = await supabase
        //   .rpc('settle_debt', {
        //     sale_id: sale.data.id,
        //     sale_settled: new Date().toUTCString(),
        //     sale_repayment_transaction: txnId,
        //     sale_repaid_by: txn.address
        //   })
        console.log(data, error);
        if (error) {
            console.log(error);
            throw new Error('Error settling debt');
        }
    }
}
exports.royaltiesRepaymentCompleted = royaltiesRepaymentCompleted;
//# sourceMappingURL=db.js.map