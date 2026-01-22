import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { syncValidator } from '#validators/sync'
import { calculateTransactionHash } from '../Utils/hashLedger.js'
import { DateTime } from 'luxon'

export default class SyncController {

  public async sync({ request, response }: HttpContext) {
    const payload = await request.validateUsing(syncValidator)

    const accepted: string[] = []
    const rejected: { id: string; reason: string }[] = []

    for (const trx of payload.transactions) {
      const expectedHash = calculateTransactionHash({
        beneficiaryId: trx.beneficiaryId,
        shopId: trx.shopId,
        quantity: trx.quantity,
        period: trx.period,
        transactionTime: trx.transactionTime,
        previousHash: trx.previousHash,
      })
      if (expectedHash !== trx.currentHash) {
        rejected.push({
          id: trx.id,
          reason: 'HASH_MISMATCH'
        })
        continue
      }
      try {
        await Transaction.create({
          ...trx,
          isSynced: true,
          syncedAt: DateTime.now(),
          syncBatchId: payload.batchId
        })
        accepted.push(trx.id)
      } catch {
        rejected.push({
          id: trx.id,
          reason: 'DUPLICATE_OR_CONFLICT'
        })
      }
    }
    return response.ok({
      accepted,
      rejected
    })
  }
}
