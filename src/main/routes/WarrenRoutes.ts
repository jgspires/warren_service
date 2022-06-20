import { Router } from 'express'
import { adaptRoute } from '../adapters'
import {
  makeRegisterUser,
  makeLoginUser,
  makeChangeUserPassword,
  makeDeleteUser,
  makeRecoverUser,
  makeUpdateUser,
  makeGetUserPeriodBalance,
  makeGetUserPeriodTransferAmount
} from '../factories'

export const getWarrenRoutes = (): Router => {
  const router = Router()

  // User routes
  router.post('/login', adaptRoute(makeLoginUser(), { requireAuth: false }))
  router.post('/register', adaptRoute(makeRegisterUser(), { requireAuth: false }))
  router.get('/:_id', adaptRoute(makeRecoverUser()))

  router.put('/:_id', adaptRoute(makeUpdateUser()))
  router.put('/:_id/password', adaptRoute(makeChangeUserPassword()))

  router.delete('/:_id', adaptRoute(makeDeleteUser()))
  // User Balance Routes
  router.get('/:_id/balances', adaptRoute(makeGetUserPeriodBalance()))
  router.get('/:_id/transfers', adaptRoute(makeGetUserPeriodTransferAmount()))

  return router
}
