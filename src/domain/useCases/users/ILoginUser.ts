import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface ILoginUser extends IUseCase<ILoginUser.Props, ILoginUser.Response> {}

export namespace ILoginUser {
  export type Props = {
    _id: string
    password: string
  }

  export type Success = string
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
