export type BaseError =
  | 'ApplicationError'
  | 'InvalidInputError'
  | 'PreConditionError'
  | 'UnauthorizedError'
  | 'PermissionError'
  | 'NotFoundError'
  | 'DuplicateError'
  | 'InvalidError'
  | 'ConnectionError'
  | 'ServerError'

export type ApplicationError = {
  status: number
  baseError: BaseError
  name: string
  body: Record<any, any>
  external: boolean
}
