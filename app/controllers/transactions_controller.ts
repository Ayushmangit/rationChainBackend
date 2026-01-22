import Transaction from '#models/transaction'
import { createTransactionValidator } from '#validators/create_transaction'
import { HttpContext } from '@adonisjs/core/http'

export default class TransactionsController {

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTransactionValidator)

    const expectedHash = calculateTransactionHash({
      beneficiaryId: payload.beneficiaryId,
      shopId: payload.shopId,
      quantity: payload.quantity,
      period: payload.period,
      transactionTime: payload.transactionTime,
      previousHash: payload.previousHash,
    })

    if (expectedHash !== payload.currentHash) {
      return response.badRequest({ message: 'HASH_MISMATCH' })
    }

    try {
      const transaction = await Transaction.create({
        ...payload,
        isSynced: true,
        syncedAt: new Date()
      })

      return response.created(transaction)
    } catch {
      return response.conflict({ message: 'DUPLICATE_TRANSACTION' })
    }
  }
}
function calculateTransactionHash(arg0: { beneficiaryId: any; shopId: any; quantity: any; period: any; transactionTime: any; previousHash: any }) {
  throw new Error('Function not implemented.')
}
