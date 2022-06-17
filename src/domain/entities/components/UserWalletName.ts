import { Either, ErrorManager, left, right } from '../../../shared'
import { ApplicationError } from '../../errors'

export class UserWalletName {
  constructor(private props: string) {}

  get value(): string {
    return this.props
  }

  static create(walletName: string): Either<ApplicationError, UserWalletName> {
    const trimmedId = walletName.trim()

    return this.validate(trimmedId)
      ? right(new UserWalletName(trimmedId))
      : left(
          ErrorManager.InvalidError(
            'walletName',
            walletName,
            'Length cannot be higher than 30 characters.'
          )
        )
  }

  static validate(walletName: string): boolean {
    if (walletName.length > 30) return false
    return true
  }
}
