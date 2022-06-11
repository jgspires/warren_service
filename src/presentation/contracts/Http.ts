import { UserFromRequestViewModel } from '../http/viewModels'

export interface HttpResponse<BodyType = any> {
  statusCode: number
  body: BodyType
}

export interface HttpRequest<
  BodyType = any,
  QueryType = any,
  ParamsType = any,
  Method = string,
  URL = string
> {
  body: BodyType
  query: QueryType
  params: ParamsType
  method: Method
  url: URL
  accessToken?: string
}

export interface DecodedHttpRequest<BodyType = any, QueryType = any, ParamsType = any>
  extends HttpRequest<BodyType, QueryType, ParamsType> {
  accessToken: string
  user: UserFromRequestViewModel
}
