import { Either } from '../../../shared'
import { UserWalletProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface ICreateUserWallet
  extends IUseCase<ICreateUserWallet.Props, ICreateUserWallet.Response> {}

export namespace ICreateUserWallet {
  export type Props = {
    _id: string
    wallet: UserWalletProps
  }

  export type Success = ICreateUserWallet.Props
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
