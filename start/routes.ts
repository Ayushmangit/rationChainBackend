import SyncController from '#controllers/syncs_controller'
import TransactionsController from '#controllers/transactions_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/transactions', [TransactionsController, 'store'])
router.post('/sync', [SyncController, 'sync'])
