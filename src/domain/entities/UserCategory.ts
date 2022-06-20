import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserCategoryName } from './components'
import { UserTransactionProps } from './UserTransaction'

export type UserCategoryProps = {
  name: string
  iconIndex: number
  colour: string
  transactions: UserTransactionProps[]
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

  static getStartingCategory(): UserCategoryProps {
    return {
      name: 'Sem Categoria',
      colour: '#e4e4e4',
      iconIndex: 0,
      transactions: []
    }
  }
}
