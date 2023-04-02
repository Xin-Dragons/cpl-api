import { createClient } from "@supabase/supabase-js";
import { mapValues, omit } from "lodash";
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { numberWithCommas } from "./utils";
import { StringDecoder } from "string_decoder";

const DB_URL = process.env.DB_URL;
const DB_SECRET = process.env.DB_SECRET;

if (!DB_URL || !DB_SECRET) {
  throw new Error('Fatal, missing DB params')
}

const supabase = createClient(DB_URL, DB_SECRET);

interface Pagination {
  limit?: number;
  page?: number;
  orderBy?: string;
}

interface CollectionParams extends Pagination {
  collection?: string;
  publicKey?: string;
}

interface MintParams {
  mint: string;
}

interface MintAndCollectionParams extends CollectionParams {
  mint: string;
}

export async function getCollections({ limit, page }: { limit?: number, page?: number } = {}) {
  const { data, error } = await supabase
    .rpc('get_collections_with_royalties', { rows: limit, page })
  
    if (error) {
      console.error(error)
      throw new Error('Error looking up collections')
    }

    return data;
}

export async function getCollection({ collection }: CollectionParams) {
  if (!collection) {
    const { data, error } = await supabase
      .rpc('count_nfts')

    return { num_mints: data };
  }
  const { data, error } = await supabase
    .rpc('get_collection_info', { coll: collection })
  
    if (error) {
      console.error(error)
      throw new Error('Error looking up collection')
    }

    return data;
}

export async function getRpcHosts() {
  const { data, error } = await supabase
    .from('**rpc-providers')
    .select('url')

  if (error) {
    throw new Error('Error looking up rpc hosts')
  }

  return data.map(d => d.url)
}

export async function getMints({ collection, limit, page, orderBy, publicKey }: CollectionParams) {
  const method = orderBy === 'debt_lamports'
    ? 'get_mints_with_royalties_for_collection_sort_by_outstanding'
    : 'get_mints_with_royalties_for_collection_sort_by_paid'
  const { data, error } = await supabase
    .rpc(method, { coll: collection, rows: limit, page, order_by: orderBy, public_key: publicKey })

  if (error) {
    console.error(error)
    throw new Error('Error looking up mints for collection');
  }

  return data
}

export async function lookupApiKey(apiKey: string) {
  const { data, error } = await supabase
    .from('cpl-api-access')
    .select('*')
    .eq('api_key', apiKey)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error('Error looking up API key')
  }

  return data;
}

export async function getCollectionWithRoyalties(collection: string, mint?: string, publicKey?: string) {
  const params = {
    coll: collection
  } as any;
  if (mint) {
    params.mint = mint;
  }
  if (publicKey) {
    params.public_key = publicKey
  }
  const { data, error } = await supabase
    .rpc('get_nft_with_royalties', params);

  if (error) {
    console.log(error)
    throw new Error('Error looking up mints')
  }

  return data;
}

export async function getMint({ collection, mint }: MintAndCollectionParams) {
  const { data, error } = await supabase
    .from('nfts')
    .select(`*`)
    .eq('collection', collection)
    .eq('mint', mint)
    .limit(1)
    .single()

  if (error) {
    console.error(error)
    throw new Error('Error looking up mint');
  }

  return omit(
    {
      ...data,
      holder: data.holder === '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix' ? 'Magic Eden' : data.holder
    },
    'created_at'
  )
}

export async function getHolders({ collection }: CollectionParams) {
  const { data, error } = await supabase
    .from('nfts')
    .select('mint, holder')
    .eq('collection', collection)

  if (error) {
    console.error(error)
    throw new Error('Error looking up holders')
  }

  return data
    .map(item => {
      return {
        ...item,
        holder: item.holder === '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix' ? 'Magic Eden' : item.holder
      }
    })
    .reduce((all: Object, item) => {
      return {
        ...all,
        [item.holder as keyof object]: all[item.holder as keyof object] ? [
          ...all[item.holder as keyof object],
          item.mint
        ] : [item.mint]
      }
    }, {})
}

export async function getSummary({ collection, publicKey }: { collection?: string, publicKey?: string } = {}) {
  const { data, error } = await supabase
    .rpc('get_royalties_summary', { coll: collection, public_key: publicKey })

  if (error) {
    console.log(error);
    throw new Error('Error looking up summary');
  }

  return data
}

export async function getRoyalties({ collection, type, before, after }: { collection: string, type?: string, before?: string, after?: string }) {
  const { data, error } = await supabase
    .rpc('get_royalties_for_collection', { coll: collection, before, after })

  if (error) {
    console.log(error)
    throw new Error('Error looking up royalties');
  }

  const paid = data.filter(i => i.debt && !i.settled).map(item => item.mint)
  const unpaid = data.filter(i => !i.debt || i.settled).map(item => item.mint)

  if (type === 'unpaid') {
    return unpaid
  }

  if (type === 'paid') {
    return paid
  }

  return {
    paid,
    unpaid
  }
}

export async function getWalletSummary({ publicKey, pretty = false }: { publicKey: string, pretty?: boolean }) {
  const { data, error } = await supabase
    .rpc('get_royalties_for_wallet', { public_key: publicKey })

  if (error) {
    console.log(error)
    throw new Error('Error looking up summary for wallet')
  }

  return data
}

export async function getOutstandingForWallet({ publicKey }: { publicKey: string }) {
  const { data, error } = await supabase
    .rpc('get_outstanding_for_wallet', { public_key: publicKey })

  if (error) {
    console.log(error)
    throw new Error('Error looking up unpaid for wallet')
  }

  return data;
}

export async function getRepaidForWallet({ publicKey }: { publicKey: string }) {
  const { data, error } = await supabase
    .rpc('get_repaid_for_wallet', { public_key: publicKey })

  if (error) {
    console.log(error)
    throw new Error('Error looking up repaid for wallet')
  }

  return data;
}

export async function getPaidForWallet({ publicKey }: { publicKey: string }) {
  const { data, error } = await supabase
    .rpc('get_paid_for_wallet', { public_key: publicKey })

  if (error) {
    console.log(error)
    throw new Error('Error looking up paid for wallet')
  }

  return data;
}

export async function getLeaderboard({ limit, collection }: { limit?: number, collection?: string }) {
  const { data, error } = await supabase
    .rpc('get_leaderboard', { rows: limit, coll: collection })

  if (error) {
    console.log(error)
    throw new Error('Error looking up leaderboard')
  }

  return data
}

export async function getRecentSales({ publicKey, limit }: { publicKey?: string, limit?: number }) {
  const { data, error } = await supabase
    .rpc('get_recent_sales', { public_key: publicKey, rows: limit })

  if (error) {
    console.log(error)
    throw new Error('Error looking up recent sales');
  }
  
  return data
}

export async function getMostRecentSale({ mint }: { mint: string }) {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('mint', mint)
    .order('sale_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error('Error looking up last sale for mint')
  }

  if (!data) {
    throw new Error('No sale found for mint');
  }

  return data;
}

export async function royaltiesRepaymentStarted({
  publicKey,
  txnId,
  mint
}: {
  publicKey: string,
  txnId: string,
  mint: StringDecoder
}) {
  const { data, error } = await supabase
    .from('**transactions')
    .insert({
      change_id: txnId,
      address: publicKey,
      type: 'royalties-repayment',
      ref_id: mint
    })

  if (error) {
    console.log(error)
    throw new Error('Error marking transaction started');
  }

  return data; 
}

export async function getSalesOverTime(
  collection: string,
) {
  console.log(collection)
  const { data, error } = await supabase
    .rpc('get_sales_over_time', { coll: collection })

  if (error) {
    console.log(error)
    throw new Error('Error getting sales over time for collection')
  }

  return data
}

export async function getWeeklyLeaders() {
  const { data, error } = await supabase
    .rpc('get_weekly_leaders')

  if (error) {
    console.log(error)
    throw new Error("Error getting weekly leaders")
  }

  return data;
}
 
export async function getPendingRoyaltiesRepaymentTransaction({
  txnId,
  mint
}: {
  txnId: string;
  mint: string;
}) {
  const { data, error } = await supabase
    .from('**transactions')
    .select('*')
    .eq('ref_id', mint)
    .eq('change_id', txnId)
    .eq('type', 'royalties-repayment')
    .is('pending', true)
    .limit(1)
    .single()

  if (error) {
    console.log(error)
    throw new Error('Error looking up repayment txn')
  }

  return data;
}

export async function royaltiesRepaymentCompleted({
  txnId,
  mint,
  success
}: {
  txnId: string;
  mint: string;
  success: boolean;
}) {
  const txn = await getPendingRoyaltiesRepaymentTransaction({ txnId, mint });

  const { data, error } = await supabase
    .from('**transactions')
    .update({ pending: false, success })
    .eq('id', txn.id)

  if (success) {
    const sale = await supabase
      .from('sales')
      .select('*')
      .eq('mint', mint)
      .order('sale_date', { ascending: false })
      .limit(1)
      .single()

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
      .match({ id: sale.data.id, mint: sale.data.mint })

    if (error) {
      console.log(error)
      throw new Error('Error settling debt')
    }
  }
}

export async function getAllCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    throw new Error('Error looking up all collections')
  }

  return data;
}

export async function addCollection({
  name,
  symbol,
  slug,
  collection,
  updateAuthority,
  firstVerifiedCreator,
  image,
  description
}: {
  name: string,
  symbol: string,
  slug: string,
  collection?: string,
  updateAuthority: string,
  firstVerifiedCreator: string,
  image: string,
  description: string
}) {
  const { data, error } = await supabase
    .from('collections')
    .insert({
      id: slug,
      name,
      symbol,
      collection,
      update_authority: updateAuthority,
      first_verified_creator: firstVerifiedCreator,
      image,
      description,
      poll_mints: true
    })
    .select('*')
    .single();

  if (error) {
    console.log(error)
    throw new Error('Error adding collection')
  }

  return data;
}