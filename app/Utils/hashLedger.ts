import crypto from 'crypto'

export interface HashLedgerInput {
  beneficiaryId: string
  shopId: string
  quantity: number
  period: string
  transactionTime: Date
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
    data.transactionTime.toISOString() +
    data.previousHash

  return crypto
    .createHash('sha256')
    .update(payload)
    .digest('hex')
}
