import { Either } from '../../../shared'
import { UserCategoryProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IListUserCategories
  extends IUseCase<IListUserCategories.Props, IListUserCategories.Response> {}

export namespace IListUserCategories {
  export type Props = {
    _id: string
  }

  export type Success = UserCategoryProps[]
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
