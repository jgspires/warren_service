import { Router } from 'express'
import { adaptRoute } from '../adapters'

export const getWarrenRoutes = (): Router => {
  const router = Router()

  router.get('/login', adaptRoute({ requireAuth: false }))
  router.get('/register', adaptRoute({ requireAuth: false }))
  router.get('/users', adaptRoute())

  return router
}
