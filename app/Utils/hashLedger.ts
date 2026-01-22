import crypto from 'node:crypto'

interface HashInput {
  beneficiaryId: string
  shopId: string
  quantity: number
  period: string
  previousHash: string
}

export function calculateTransactionHash(input: HashInput): string {
  const data =
    input.beneficiaryId +
    input.shopId +
    input.quantity +
    input.period +
    input.previousHash

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}
