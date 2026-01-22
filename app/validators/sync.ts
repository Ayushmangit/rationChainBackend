import vine from '@vinejs/vine'

export const syncValidator = vine.compile(
  vine.object({
    deviceId: vine.string(),
    batchId: vine.string().uuid(),
    transactions: vine.array(
      vine.object({
        id: vine.string().uuid(),
        beneficiaryId: vine.string(),
        shopId: vine.string(),
        quantity: vine.number(),
        period: vine.string(),
        transactionTime: vine.date(),
        previousHash: vine.string(),
        currentHash: vine.string(),
        deviceId: vine.string(),
      })
    )
  })
)
