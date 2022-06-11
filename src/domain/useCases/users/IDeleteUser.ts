import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IDeleteUser extends IUseCase<IDeleteUser.Props, IDeleteUser.Response> {}

export namespace IDeleteUser {
  export type Props = {
    _id: string
  }

  export type Success = null
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
