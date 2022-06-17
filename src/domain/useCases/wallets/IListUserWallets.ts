import { Either } from '../../../shared'
import { UserWalletProps } from '../../entities'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'

export interface IListUserWallets
  extends IUseCase<IListUserWallets.Props, IListUserWallets.Response> {}

export namespace IListUserWallets {
  export type Props = {
    _id: string
  }

  export type Success = UserWalletProps[]
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
