import { Connection } from '@solana/web3.js';

export const connection = new Connection(process.env.RPC_URL as string, {
  commitment: "confirmed",
  httpHeaders: {
    Authorization: `Bearer ${process.env.HELLO_MOON_API_KEY}`
  }
});

export async function getRecentBlockhash() {
  const blockhash = (await connection.getRecentBlockhash()).blockhash
  return blockhash
}