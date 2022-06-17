import { Either } from '../../../shared'
import { UserTransactionProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { UserTransactionInteractProps } from '../DTOs'

export interface IRecoverUserTransaction
  extends IUseCase<IRecoverUserTransaction.Props, IRecoverUserTransaction.Response> {}

export namespace IRecoverUserTransaction {
  export type Props = {
    _id: string
    walletName: string
    categoryName: string
    transactionId: string
    transaction: UserTransactionInteractProps
  }

  export type Success = UserTransactionProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
