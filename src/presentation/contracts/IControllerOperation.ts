import { HttpRequest, HttpResponse } from '.'
import { ApplicationError } from '../../domain/errors'
import { Either } from '../../shared'

export type ControllerOperationResponse<SuccessBody = any> = Promise<
  Either<ApplicationError, HttpResponse<SuccessBody>>
>

export interface IControllerOperation<RequestType extends HttpRequest = HttpRequest> {
  operate: (request: RequestType) => ControllerOperationResponse
}
