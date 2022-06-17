import { Router } from 'express'
import { adaptRoute } from '../adapters'
import {
  makeRegisterUser,
  makeLoginUser,
  makeChangeUserPassword,
  makeDeleteUser,
  makeRecoverUser
} from '../factories'

export const getWarrenRoutes = (): Router => {
  const router = Router()

  // User routes
  router.get('/login', adaptRoute(makeLoginUser(), { requireAuth: false }))
  router.get('/register', adaptRoute(makeRegisterUser(), { requireAuth: false }))
  router.get('/:_id', adaptRoute(makeRecoverUser()))

  router.put('/:_id', adaptRoute(makeChangeUserPassword()))
  router.delete('/:_id', adaptRoute(makeDeleteUser()))
  // --

  return router
}
