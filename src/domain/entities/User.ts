import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserId, UserPassword } from './components'
import { UserCategoryProps } from './UserCategory'
import { UserWalletProps } from './UserWallet'

export type UserProps = {
  _id: string
  password: string
  categories: UserCategoryProps[]
  wallets: UserWalletProps[]
}

export class User {
  constructor(private props: UserProps) {}

  get value(): UserProps {
    return this.props
  }

  static create(props: UserProps): Either<ApplicationError, User> {
    const userIdOrError = UserId.create(props._id)
    if (userIdOrError.isLeft()) return left(userIdOrError.value)

    const userPwdOrError = UserPassword.create(props.password)
    if (userPwdOrError.isLeft()) return left(userPwdOrError.value)

    props._id = userIdOrError.value.value
    props.password = userPwdOrError.value.value
    return right(new User(props))
  }
}
