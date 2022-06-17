import { Either, ErrorManager, left, right } from '../../../shared'
import { ApplicationError } from '../../errors'

export class UserTransactionName {
  constructor(private props: string) {}

  get value(): string {
    return this.props
  }

  static create(transactionName: string): Either<ApplicationError, UserTransactionName> {
    const trimmedId = transactionName.trim()

    return this.validate(trimmedId)
      ? right(new UserTransactionName(trimmedId))
      : left(
          ErrorManager.InvalidError(
            'transactionName',
            transactionName,
            'Length cannot be higher than 100 characters.'
          )
        )
  }

  static validate(transactionName: string): boolean {
    if (transactionName.length > 100) return false
    return true
  }
}
