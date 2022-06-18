import { Router } from 'express'
import { adaptRoute } from '../adapters'
import {
  makeRegisterUser,
  makeLoginUser,
  makeChangeUserPassword,
  makeDeleteUser,
  makeRecoverUser,
  makeUpdateUser
} from '../factories'

export const getWarrenRoutes = (): Router => {
  const router = Router()

  // User routes
  router.get('/login', adaptRoute(makeLoginUser(), { requireAuth: false }))
  router.get('/register', adaptRoute(makeRegisterUser(), { requireAuth: false }))
  router.get('/:_id', adaptRoute(makeRecoverUser()))

  router.put('/:_id', adaptRoute(makeUpdateUser()))
  router.put('/:_id/password', adaptRoute(makeChangeUserPassword()))
  router.delete('/:_id', adaptRoute(makeDeleteUser()))
  // --

  return router
}
