import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IDeleteUserTransaction
  extends IUseCase<IDeleteUserTransaction.Props, IDeleteUserTransaction.Response> {}

export namespace IDeleteUserTransaction {
  export type Props = {
    _id: string
    walletName: string
    categoryName: string
    transactionId: string
  }

  export type Success = null
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
