import { Either } from '../../shared'
import { UserFromRequestProps } from '../entities'
import { ApplicationError } from '../errors'
import { IUseCase } from './contracts'

export interface IDecodeAccessToken
  extends IUseCase<IDecodeAccessToken.Props, IDecodeAccessToken.Response> {}

export namespace IDecodeAccessToken {
  export type Props = {
    accessToken?: string
  }

  export type Success = UserFromRequestProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
