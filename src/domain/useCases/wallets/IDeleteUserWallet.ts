import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IDeleteUserWallet
  extends IUseCase<IDeleteUserWallet.Props, IDeleteUserWallet.Response> {}

export namespace IDeleteUserWallet {
  export type Props = {
    _id: string
    walletName: string
  }

  export type Success = null
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
