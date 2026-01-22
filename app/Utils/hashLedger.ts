import crypto from 'node:crypto'

interface HashInput {
  beneficiaryId: string
  shopId: string
  quantity: number
  period: string
  lastHash: string
}

export function calculateTransactionHash(input: HashInput): string {
  const data =
    input.beneficiaryId +
    input.shopId +
    input.quantity +
    input.period +
    input.lastHash

  return crypto
    .createHash('sha256')
    .update(data)
    .digest('hex')
}
