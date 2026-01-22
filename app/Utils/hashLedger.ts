import crypto from 'crypto'
import { DateTime } from 'luxon'

export interface HashLedgerInput {
  beneficiaryId: string
  shopId: string
  quantity: number
  period: string
  transactionTime: DateTime
  previousHash: string
}

export function calculateTransactionHash(
  data: HashLedgerInput
): string {

  const payload =
    data.beneficiaryId +
    data.shopId +
    data.quantity +
    data.period +
    data.transactionTime.toJSDate().toISOString() +
    data.previousHash

  return crypto
    .createHash('sha256')
    .update(payload)
    .digest('hex')
}
