import { royaltiesRepaymentCompleted, getPendingRoyaltiesRepaymentTransaction } from '../db';
import { pollTransaction } from '../helpers';

const MAX_RETRIES = 45;

(async () => {
  const txnId = process.argv[2];
  const mint = process.argv[3];
  console.log(`Started polling: ${txnId}`)

  let confirmed = false;

  try {
    const txn = await pollTransaction(txnId, MAX_RETRIES)
    confirmed = txn && !txn.meta.err;
  } catch (err: any) {
    if (err.message.includes('Timed out waiting for confirmation')) {
      confirmed = false;
    } else {
      throw err;
    }
  }

  try {
    const pending = await getPendingRoyaltiesRepaymentTransaction({ mint, txnId })

    if (pending.change_id === txnId) {
      console.log('updating db from worker')
      await royaltiesRepaymentCompleted({ mint, txnId, success: confirmed });
    }

    console.log(`Done polling: successful: ${confirmed}`);
  } catch (err) {
    console.error('Error updating db from worker')
    console.error(err)
  }


})();
