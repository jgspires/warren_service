import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IDeleteUserCategory
  extends IUseCase<IDeleteUserCategory.Props, IDeleteUserCategory.Response> {}

export namespace IDeleteUserCategory {
  export type Props = {
    _id: string
    categoryName: string
  }

  export type Success = null
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
