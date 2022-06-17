import { Either } from '../../../shared'
import { UserWalletProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IUpdateUserWallet
  extends IUseCase<IUpdateUserWallet.Props, IUpdateUserWallet.Response> {}

export namespace IUpdateUserWallet {
  export type Props = {
    _id: string
    walletName: string
    wallet: UserWalletProps
  }

  export type Success = UserWalletProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
