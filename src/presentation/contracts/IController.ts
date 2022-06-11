import { HttpRequest, HttpResponse } from './Http'

export interface IController<RequestType extends HttpRequest = HttpRequest> {
  handle: (request: RequestType) => Promise<HttpResponse>
}
