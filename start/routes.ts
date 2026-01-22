import SyncController from '#controllers/syncs_controller'
import TransactionsController from '#controllers/transactions_controller'
import UserController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.post('/transactions', [TransactionsController, 'store'])
router.post('/sync', [SyncController, 'sync'])

router.group(() => {
  router.post("/register", [UserController, 'register'])
  router.post("/login", [UserController, 'login'])
  router.post("/logout", [UserController, 'logout'])
  router.get("/me", [UserController, 'me'])
}).prefix("auth/")
