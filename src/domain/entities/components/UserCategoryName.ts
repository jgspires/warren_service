import { Either, ErrorManager, left, right } from '../../../shared'
import { ApplicationError } from '../../errors'

export class UserCategoryName {
  constructor(private props: string) {}

  get value(): string {
    return this.props
  }

  static create(categoryName: string): Either<ApplicationError, UserCategoryName> {
    const trimmedId = categoryName.trim()

    return this.validate(trimmedId)
      ? right(new UserCategoryName(trimmedId))
      : left(
          ErrorManager.InvalidError(
            'categoryName',
            categoryName,
            'Length cannot be higher than 30 characters.'
          )
        )
  }

  static validate(categoryName: string): boolean {
    if (categoryName.length > 30) return false
    return true
  }
}
