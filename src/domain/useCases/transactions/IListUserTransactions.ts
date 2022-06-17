import { Either } from '../../../shared'
import { UserTransactionProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IListUserTransactions
  extends IUseCase<IListUserTransactions.Props, IListUserTransactions.Response> {}

export namespace IListUserTransactions {
  export type Props = {
    _id: string
  }

  export type Success = UserTransactionProps[]
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
