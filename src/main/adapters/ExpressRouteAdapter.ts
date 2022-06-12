import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { HttpRequest, IControllerOperation } from '../../presentation/contracts'
import { Controller } from '../../presentation/http'
import { TOKEN_SECRET } from '../config'

export const adaptRoute = (
  controllerOp: IControllerOperation<HttpRequest>,
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

    const controller = new Controller(controllerOp)

    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
