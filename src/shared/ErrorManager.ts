import { BaseError, ApplicationError } from '../domain/errors'
import { HttpResponse } from '../presentation/contracts'

export class ErrorManager {
  static baseErrorStatus: Record<BaseError, number> = {
    PreConditionError: 412,
    PermissionError: 403,
    UnauthorizedError: 401,
    DuplicateError: 409,
    InvalidError: 422,
    NotFoundError: 404,
    InvalidInputError: 400,
    ApplicationError: 400,
    ServerError: 500,
    ConnectionError: 500
  }

  static ErrorHttpResponse(error: ApplicationError): HttpResponse {
    return { body: { ...error.body, name: error.name }, statusCode: error.status }
  }

  static ServerError(message: string = 'Unexpected error.'): ApplicationError {
    const baseError: BaseError = 'ServerError'
    return {
      baseError,
      external: true,
      body: { message },
      name: 'ServerError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static ConnectionError(service: string): ApplicationError {
    const baseError: BaseError = 'ConnectionError'
    return {
      baseError,
      external: true,
      body: { message: `Connection Error: connection to ${service} failed.` },
      name: 'ConnectionError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static MissingTokenError(): ApplicationError {
    const baseError: BaseError = 'PreConditionError'
    return {
      baseError,
      external: false,
      body: { message: 'Auth token missing.' },
      name: 'MissingTokenError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static InvalidTokenPayloadError(payload: any): ApplicationError {
    const baseError: BaseError = 'PreConditionError'
    return {
      baseError,
      external: false,
      body: { message: 'Token payload not as expected.', payload },
      name: 'InvalidTokenPayloadError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static InvalidTokenError(token: any): ApplicationError {
    const baseError: BaseError = 'PreConditionError'
    return {
      baseError,
      external: false,
      body: { message: `Access token token expired or with invalid signature.`, token },
      name: 'InvalidTokenError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static PermissionError(
    message: string = 'Insufficient permission to access resource.'
  ): ApplicationError {
    const baseError: BaseError = 'PermissionError'
    return {
      baseError,
      external: false,
      body: { message },
      name: 'PermissionError',
      status: this.baseErrorStatus[baseError]
    }
  }

  static InvalidError(entityType: string, entity: string, expected?: string): ApplicationError {
    const baseError: BaseError = 'InvalidError'
    let message = `Invalid ${entityType}: "${entity}".`
    if (expected) message = message.concat(` ${expected}.`)
    return {
      baseError,
      external: false,
      body: { message },
      name: `Invalid${entityType}Error`,
      status: this.baseErrorStatus[baseError]
    }
  }

  static DuplicateError(entityType: string, entity: string): ApplicationError {
    const baseError: BaseError = 'DuplicateError'
    return {
      baseError,
      external: false,
      body: { message: `Duplicate ${entityType}: "${entity}".` },
      name: `Duplicate${entityType}Error`,
      status: this.baseErrorStatus[baseError]
    }
  }

  static NotFoundError(entityType: string, entity: string): ApplicationError {
    const baseError: BaseError = 'NotFoundError'
    return {
      baseError,
      external: false,
      body: { message: `${entityType}: "${entity}" not found.` },
      name: `${entityType}NotFoundError`,
      status: this.baseErrorStatus[baseError]
    }
  }
}
