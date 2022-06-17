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
    let authError = false

    if (options.requireAuth) {
      if (!httpRequest.accessToken) authError = true
      else {
        const token = httpRequest.accessToken.replace('Bearer ', '')
        jwt.verify(token as string, TOKEN_SECRET, (err: any, _user: any) => {
          if (err) authError = true
        })
        if (authError) return res.sendStatus(403)
      }
    }

    const controller = new Controller(controllerOp)

    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
