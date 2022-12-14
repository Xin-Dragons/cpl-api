import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { NextFunction, Request, Response } from 'express';
import nacl from 'tweetnacl';
import { TextEncoder } from 'util';

export const validateMessage = (action: string) => (req: Request, res: Response, next: NextFunction) => {
  const { signedMessage, usingLedger, ...params } = req.body;

  if (usingLedger) {
    const transaction = Transaction.from(bs58.decode(signedMessage))
    const isVerifiedSignature = transaction.verifySignatures();

    if (isVerifiedSignature) {
      return next();
    }

    return next(new Error('Error validating wallet ownership'))
  } else {
    const message = `Sign message to confirm you own this wallet and are validating this action.\n\n${action}`

    const messageBytes = new TextEncoder().encode(message);

    const publicKeyBytes = bs58.decode(params.publicKey)
    const signatureBytes = typeof signedMessage === 'string'
      ? new Uint8Array(bs58.decode(signedMessage))
      : new Uint8Array(signedMessage.data)

    const validated = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (validated) {
      return next();
    } else {
      return next(new Error('Error validating wallet ownership'))
    }

  }

}