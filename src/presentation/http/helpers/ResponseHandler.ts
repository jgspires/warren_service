import { HttpResponse } from '../../contracts'

export const success = <T = unknown>(data: T, statusCode = 200): HttpResponse<T> => ({
  statusCode,
  body: data
})
