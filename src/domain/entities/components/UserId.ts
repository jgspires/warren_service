import { Either, ErrorManager, left, right } from '../../../shared'
import { ApplicationError } from '../../errors'

export class UserId {
  constructor(private props: string) {}

  get value(): string {
    return this.props
  }

  static create(userId: string): Either<ApplicationError, UserId> {
    const trimmedId = userId.trim()

    return this.validate(trimmedId)
      ? right(new UserId(trimmedId))
      : left(
          ErrorManager.InvalidError(
            'userId',
            userId,
            'Length must be between 3 and 30 characters. Only letters and numbers are allowed. No spaces or special characters. Usernames must start with a letter'
          )
        )
  }

  static validate(userId: string): boolean {
    const tester = /^[A-z](?=.*\w*)(?!.* )(?!.*[^\w]).*$/
    if (userId.length < 3 || userId.length > 30) return false
    return tester.test(userId)
  }
}
