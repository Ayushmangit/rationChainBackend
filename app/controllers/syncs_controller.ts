import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { calculateTransactionHash } from '../Utils/hashLedger.js'
import db from '@adonisjs/lucid/services/db'

export default class SyncController {
  public async sync({ request, response }: HttpContext) {
    const payload = request.all()

    const accepted: string[] = []
    const rejected: { id: string; reason: string; details?: string }[] = []

    const trx = await db.transaction()

    try {
      let lastTransaction = await Transaction.query({ client: trx })
        .orderBy('id', 'desc')
        .first()

      const sortedTransactions = [...payload.transactions].sort((a, b) => {
        return a.id.localeCompare(b.id)
      })

      for (const incomingTrx of sortedTransactions) {
        const expectedHash = calculateTransactionHash({
          beneficiaryId: incomingTrx.beneficiaryId,
          shopId: incomingTrx.shopId,
          quantity: incomingTrx.quantity,
          period: incomingTrx.period,
          previousHash: incomingTrx.previousHash,
        })

        if (expectedHash !== incomingTrx.currentHash) {
          rejected.push({
            id: incomingTrx.id,
            reason: 'HASH_MISMATCH',
            details: 'Transaction hash does not match the data',
          })
          continue
        }

        if (lastTransaction) {
          if (incomingTrx.previousHash !== lastTransaction.currentHash) {
            rejected.push({
              id: incomingTrx.id,
              reason: 'CHAIN_BROKEN',
              details: `Previous hash mismatch. Expected: ${lastTransaction.currentHash}, Got: ${incomingTrx.previousHash}`,
            })
            continue
          }
        } else {
          if (incomingTrx.previousHash !== '0' && incomingTrx.previousHash !== '') {
            rejected.push({
              id: incomingTrx.id,
              reason: 'INVALID_GENESIS',
              details: 'First transaction must have previousHash as "0" or empty',
            })
            continue
          }
        }

        const exists = await Transaction.query({ client: trx })
          .where('currentHash', incomingTrx.currentHash)
          .first()

        if (exists) {
          rejected.push({
            id: incomingTrx.id,
            reason: 'DUPLICATE',
            details: 'Transaction with this hash already exists',
          })
          continue
        }

        try {
          const created = await Transaction.create(
            {
              ...incomingTrx,
              isSynced: true,
              syncBatchId: payload.batchId,
            },
            { client: trx }
          )

          lastTransaction = created
          accepted.push(incomingTrx.id)
        } catch (error) {
          rejected.push({
            id: incomingTrx.id,
            reason: 'DATABASE_ERROR',
            details: error.message,
          })
        }
      }

      await trx.commit()

      return response.ok({
        batchId: payload.batchId,
        accepted,
        rejected,
        summary: {
          total: payload.transactions.length,
          acceptedCount: accepted.length,
          rejectedCount: rejected.length,
        },
      })
    } catch (error) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Sync failed',
        error: error.message,
      })
    }
  }
}
