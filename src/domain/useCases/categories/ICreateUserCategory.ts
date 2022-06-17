import { Either } from '../../../shared'
import { UserCategoryProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface ICreateUserCategory
  extends IUseCase<ICreateUserCategory.Props, ICreateUserCategory.Response> {}

export namespace ICreateUserCategory {
  export type Props = {
    _id: string
    category: UserCategoryProps
  }

  export type Success = ICreateUserCategory.Props
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
