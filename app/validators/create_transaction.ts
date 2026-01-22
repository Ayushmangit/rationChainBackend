import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    id: vine.string().uuid(),
    beneficiaryId: vine.string(),
    shopId: vine.string(),
    quantity: vine.number(),
    period: vine.string(),
    transactionTime: vine.date(),
    previousHash: vine.string(),
    currentHash: vine.string(),
    deviceId: vine.string()
  })
)
