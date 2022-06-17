import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { UserNoPasswordProps } from './DTOs'

export interface IRecoverUser extends IUseCase<IRecoverUser.Props, IRecoverUser.Response> {}

export namespace IRecoverUser {
  export type Props = {
    _id: string
  }

  export type Success = UserNoPasswordProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
