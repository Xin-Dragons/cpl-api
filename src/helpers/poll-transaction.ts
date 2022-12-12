import { sleep, connection } from './';

// default 14 * 2 seconds = 28 seconds
export async function pollTransaction(txnId: string, retries = 14): Promise<any> {
  if (retries <= 0) {
    throw new Error('Timed out waiting for confirmation')
  }
  try {
    console.log(`Polling txn: ${txnId}\n\nRetries remaining: ${retries}`)
    const txn = await connection.getTransaction(txnId);
    if (txn) {
      return txn;
    } else {
      await sleep(2000);
      return pollTransaction(txnId, retries - 1);
    }
  } catch {
    await sleep(2000);
    return pollTransaction(txnId, retries - 1);
  }
}