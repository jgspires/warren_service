import { Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeRegisterUser, makeLoginUser } from '../factories'

export const getWarrenRoutes = (): Router => {
  const router = Router()

  router.get('/login', adaptRoute(makeLoginUser(), { requireAuth: false }))
  router.get('/register', adaptRoute(makeRegisterUser(), { requireAuth: false }))
  // router.get('/users', adaptRoute())

  return router
}
