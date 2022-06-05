import { Either, ErrorManager, left, right } from '../../../shared'
import { ApplicationError } from '../../errors'

export class UserPassword {
  constructor(private props: string) {}

  get value(): string {
    return this.props
  }

  static create(userPassword: string): Either<ApplicationError, UserPassword> {
    const trimmedPwd = userPassword.trim()

    return this.validate(trimmedPwd)
      ? right(new UserPassword(trimmedPwd))
      : left(
          ErrorManager.InvalidError(
            'userPassword',
            userPassword,
            'Passwords must between 7 and 30 characters, a lowercase letter, an uppercase letter and a special character. It must also not contain spaces'
          )
        )
  }

  static validate(userPassword: string): boolean {
    const tester = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.*[a-z])(?!.* ).*$/
    if (userPassword.length < 7 || userPassword.length > 30) return false
    return tester.test(userPassword)
  }
}
