import vine from "@vinejs/vine";

export const createTransactionValidator = vine.compile(
  vine.object({
    beneficiaryId: vine.string().trim().minLength(1),
    shopId: vine.string().trim().minLength(1),
    quantity: vine.number().positive(),
    period: vine.string().regex(/^\d{4}-\d{2}$/),
    lastHash: vine.string().trim().minLength(1),
    currentHash: vine.string().trim(),
    isSynced: vine.boolean(),
    syncBatchId: vine.string().trim().nullable(),
  })
)
