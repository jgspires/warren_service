import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { UserTransactionCreateResponse, UserTransactionInteractProps } from '../DTOs'

export interface ICreateUserTransaction
  extends IUseCase<ICreateUserTransaction.Props, ICreateUserTransaction.Response> {}

export namespace ICreateUserTransaction {
  export type Props = {
    _id: string
    walletName: string
    categoryName: string
    transaction: UserTransactionInteractProps
  }

  export type Success = UserTransactionCreateResponse
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
