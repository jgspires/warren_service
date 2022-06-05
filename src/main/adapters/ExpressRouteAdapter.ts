import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { HttpRequest } from '../../presentation/contracts'
import { logger } from '../../shared/logger'
import { TOKEN_SECRET } from '../config'

export const adaptRoute = (
  options: { requireAuth: boolean } = { requireAuth: true }
): RequestHandler => {
  return async (req, res) => {
    const httpRequest: HttpRequest = {
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      accessToken: req.headers.authorization
    }

    if (options.requireAuth) {
      if (!httpRequest.accessToken) res.sendStatus(403)
      jwt.verify(httpRequest.accessToken as string, TOKEN_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403)

        res.json({ user: user })
      })
    }

    logger.info(`"${httpRequest.method} ${httpRequest.url}"`)
    res.status(200).json({ body: httpRequest.body })
  }
}
