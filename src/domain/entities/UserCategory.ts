import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserCategoryName } from './components'

export type UserCategoryProps = {
  name: string
  iconIndex: number
  colour: string
  description?: string
}

export class UserCategory {
  constructor(private props: UserCategoryProps) {}

  get value(): UserCategoryProps {
    return this.props
  }

  static create(props: UserCategoryProps): Either<ApplicationError, UserCategory> {
    const categoryNameOrError = UserCategoryName.create(props.name)
    if (categoryNameOrError.isLeft()) return left(categoryNameOrError.value)

    props.name = categoryNameOrError.value.value
    return right(new UserCategory(props))
  }
}
