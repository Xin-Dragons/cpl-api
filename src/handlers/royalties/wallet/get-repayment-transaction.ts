import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { NextFunction, Request, Response } from "express";
import { getRepaidForWallet, getMostRecentSale } from '../../../db';
import bs58 from 'bs58';
import BN from 'bn.js';
import { connection } from '../../../helpers';
import { Metaplex } from '@metaplex-foundation/js';

const MEMO_PROGRAM_KEY = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'

interface Creator {
  share: number,
  address: PublicKey,
  verified: boolean
}

interface GetRepaymentTransactionProps {
  publicKey: PublicKey;
  creators: Creator[];
  debt: BN;
  mint: PublicKey
}

async function getRepaymentTransaction({
  publicKey,
  creators,
  debt,
  mint
}: GetRepaymentTransactionProps) {

  const instructions = creators.filter(c => c.share).map(c => {
    const instruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: c.address,
      lamports: debt
        .div(new BN(100))
        .mul(new BN(c.share))
        .toNumber()
    });

    instruction.keys.push({
      pubkey: mint,
      isSigner: false,
      isWritable: false
    });

    return instruction
  })

  instructions.push(
    new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: true
        }
      ],
      data: Buffer.from("ROYALTY REPAYMENT", 'utf-8'),
      programId: new PublicKey(MEMO_PROGRAM_KEY),
    })
  )

  const txn = new Transaction().add(...instructions)

  txn.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  txn.feePayer = publicKey;

  return bs58.encode(txn.serialize({ verifySignatures: false }));
}

const metaplex = Metaplex.make(connection)

export async function handleGetRepaymentTransaction(req: Request, res: Response, next: NextFunction) {
  const publicKey: string = req.params.publicKey;
  const mint: string = req.params.mint;

  try {
    const sale = await getMostRecentSale({ mint })

    if (!sale) {
      throw new Error('No sale found for mint');
    }

    if (!sale.debt_lamports) {
      throw new Error('No debt found for mint');
    }

    if (sale.settled) {
      throw new Error('Royalties already repaid for mint');
    }

    const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(sale.mint) })

    const txn = await getRepaymentTransaction({
      publicKey: new PublicKey(publicKey),
      debt: new BN(sale.debt_lamports),
      creators: nft.creators,
      mint: new PublicKey(sale.mint)
    });

    res.status(200).end(JSON.stringify(txn, null, 2))
  } catch (err: any) {
    console.error(err.stack);
    next(err)
  }
}

