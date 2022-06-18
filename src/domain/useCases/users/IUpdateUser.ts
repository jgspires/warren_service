import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { UserDataProps, UserNoPasswordProps } from './DTOs'

export interface IUpdateUser extends IUseCase<IUpdateUser.Props, IUpdateUser.Response> {}

export namespace IUpdateUser {
  export type Props = {
    _id: string
    user: UserDataProps
  }

  export type Success = UserNoPasswordProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
