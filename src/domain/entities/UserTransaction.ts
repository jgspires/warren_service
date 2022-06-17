import { Either, left, right } from '../../shared'
import { ApplicationError } from '../errors'
import { UserTransactionName } from './components/'

export type Recurrence = 'monthly'
export type TransactionType = 'deposit' | 'withdraw'

export type UserTransactionProps = {
  name: string
  date: string
  amount: number
  sourceOrDestination: string
  transactionType: TransactionType
  paymentType: string
  recurrence?: Recurrence
  description?: string
}

export class UserTransaction {
  constructor(private props: UserTransactionProps) {}

  get value(): UserTransactionProps {
    return this.props
  }

  static create(props: UserTransactionProps): Either<ApplicationError, UserTransaction> {
    const transactionNameOrError = UserTransactionName.create(props.name)
    if (transactionNameOrError.isLeft()) return left(transactionNameOrError.value)

    props.name = transactionNameOrError.value.value
    return right(new UserTransaction(props))
  }
}
