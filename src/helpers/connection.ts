import { Connection } from '@solana/web3.js';

export const connection = new Connection(process.env.RPC_URL as string, 'confirmed');

export async function getRecentBlockhash() {
  const blockhash = (await connection.getRecentBlockhash()).blockhash
  return blockhash
}