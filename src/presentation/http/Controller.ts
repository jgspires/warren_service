import { ErrorManager } from '../../shared'
import { logger } from '../../shared/logger'
import { HttpRequest, IControllerOperation, HttpResponse } from '../contracts'
import { IController } from '../contracts/IController'

export class Controller<RequestType extends HttpRequest = HttpRequest>
  implements IController<RequestType>
{
  constructor(private operation: IControllerOperation<RequestType>) {}

  async handle(httpRequest: RequestType): Promise<HttpResponse> {
    try {
      const operationResponse = await this.operation.operate(httpRequest)
      if (operationResponse.isRight()) {
        logger.info(`${httpRequest.method} ${httpRequest.url}`)
        return operationResponse.value
      }

      const error = operationResponse.value
      logger.error(`${httpRequest.method} ${httpRequest.url}: ${error.name}`)

      return ErrorManager.ErrorHttpResponse(error)
    } catch (e) {
      const error = e as Error
      const serverError = ErrorManager.ServerError(error.message)
      return ErrorManager.ErrorHttpResponse(serverError)
    }
  }
}
