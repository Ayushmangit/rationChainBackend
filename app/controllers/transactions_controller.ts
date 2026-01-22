import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { calculateTransactionHash } from '../Utils/hashLedger.js'
import { createTransactionValidator } from '#validators/create_transaction'

export default class TransactionsController {

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTransactionValidator)

    const expectedHash = calculateTransactionHash({
      beneficiaryId: payload.beneficiaryId,
      shopId: payload.shopId,
      quantity: payload.quantity,
      period: payload.period,
      lastHash: payload.lastHash,
    })


    if (expectedHash !== payload.currentHash) {
      return response.badRequest({
        message: 'HASH_MISMATCH',
        error: 'Transaction hash does not match the data'
      })
    }

    const lastTransaction = await Transaction.query()
      .orderBy('id', 'desc')
      .first()

    if (lastTransaction) {
      if (payload.lastHash !== lastTransaction.currentHash) {
        return response.badRequest({
          message: 'CHAIN_BROKEN',
          error: 'Previous hash does not match the last transaction',
          expected: lastTransaction.currentHash,
          received: payload.lastHash,
        })
      }
    } else {
      if (payload.lastHash !== '0' && payload.lastHash !== '') {
        return response.badRequest({
          message: 'INVALID_GENESIS',
          error: 'First transaction must have previousHash as "0" or empty string',
        })
      }
    }

    const transaction = await Transaction.create({
      ...payload,
      isSynced: true,
    })

    return response.created(transaction)
  }
}
