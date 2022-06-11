import { ApplicationError } from '../domain/errors'
import { Either } from './Either'

export type ExternalResponse<SuccessResponse = null, ErrorResponse = ApplicationError> = Promise<
  Either<ErrorResponse, SuccessResponse>
>
