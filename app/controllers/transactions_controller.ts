import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { calculateTransactionHash } from '../Utils/hashLedger.js'
import { createTransactionValidator } from '#validators/create_transaction'
import { DateTime } from 'luxon'

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
      return response.badRequest({
        message: 'HASH_MISMATCH'
      })
    }
    try {
      const transaction = await Transaction.create({
        ...payload,
        isSynced: true,
        syncedAt: DateTime.now()
      })
      return response.created(transaction)
    } catch {
      return response.conflict({
        message: 'DUPLICATE_TRANSACTION'
      })
    }
  }
}
