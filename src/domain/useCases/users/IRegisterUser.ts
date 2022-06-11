import { Either } from '../../../shared'
import { UserFromRequestProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IRegisterUser extends IUseCase<IRegisterUser.Props, IRegisterUser.Response> {}

export namespace IRegisterUser {
  export type Props = {
    _id: string
    password: string
  }

  export type Success = UserFromRequestProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
