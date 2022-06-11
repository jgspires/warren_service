import { Either } from '../../../shared'
import { UserFromRequestProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IChangeUserPassword
  extends IUseCase<IChangeUserPassword.Props, IChangeUserPassword.Response> {}

export namespace IChangeUserPassword {
  export type Props = {
    _id: string
    newPassword: string
  }

  export type Success = UserFromRequestProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
