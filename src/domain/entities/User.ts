import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserId, UserPassword } from './components'

export type UserProps = {
  userId: string
  password: string
}

export class User {
  constructor(private props: UserProps) {}

  get value(): UserProps {
    return this.props
  }

  static create(props: UserProps): Either<ApplicationError, User> {
    const userIdOrError = UserId.create(props.userId)
    if (userIdOrError.isLeft()) return left(userIdOrError.value)

    const userPwdOrError = UserPassword.create(props.password)
    if (userPwdOrError.isLeft()) return left(userPwdOrError.value)

    return right(
      new User({ userId: userIdOrError.value.value, password: userPwdOrError.value.value })
    )
  }
}
