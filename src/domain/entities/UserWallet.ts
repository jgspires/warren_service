import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserWalletName } from './components'

export type UserWalletProps = {
  name: string
  iconIndex: number
  colour: string
}

export class UserWallet {
  constructor(private props: UserWalletProps) {}

  get value(): UserWalletProps {
    return this.props
  }

  static create(props: UserWalletProps): Either<ApplicationError, UserWallet> {
    const walletNameOrError = UserWalletName.create(props.name)
    if (walletNameOrError.isLeft()) return left(walletNameOrError.value)

    const propsToCreate: UserWalletProps = {
      name: walletNameOrError.value.value,
      iconIndex: props.iconIndex,
      colour: props.colour
    }
    return right(new UserWallet(propsToCreate))
  }
}
