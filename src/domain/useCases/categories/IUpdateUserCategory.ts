import { Either } from '../../../shared'
import { UserCategoryProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IUpdateUserCategory
  extends IUseCase<IUpdateUserCategory.Props, IUpdateUserCategory.Response> {}

export namespace IUpdateUserCategory {
  export type Props = {
    _id: string
    category: UserCategoryProps
  }

  export type Success = UserCategoryProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
