import moment from 'moment'
import { IGetPeriodTransferAmount } from '../../../domain/useCases/balance'
import { PeriodTransferAmountProps } from '../../../domain/useCases/balance/DTOs'
import { ErrorManager, left, right } from '../../../shared'
import { IUserRepositoryGetUserData } from '../../dependencies/repositories/UserRepository'
import { TransactionHelper } from './utils'

export class GetUserPeriodTransferAmountUseCase implements IGetPeriodTransferAmount {
  constructor(private readonly userRepository: IUserRepositoryGetUserData) {}

  async execute(props: IGetPeriodTransferAmount.Props): Promise<IGetPeriodTransferAmount.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))
    const foundUser = existingUserOrError.value

    const startTimestamp = moment(props.startingMonth).startOf('month').unix()
    const endTimestamp = moment(props.endingMonth).endOf('month').unix()

    if (endTimestamp < startTimestamp)
      return left(
        ErrorManager.InvalidError(
          'Starting Month',
          props.startingMonth,
          `Starting month (${props.startingMonth}) must be the same or come earlier than ending month (${props.endingMonth}).`
        )
      )

    const periodTransactions = TransactionHelper.getPeriodTransactions(
      foundUser,
      startTimestamp,
      endTimestamp
    )
    const periodDepositsWithdraws: PeriodTransferAmountProps = {
      deposits: 0,
      withdraws: 0
    }

    for (const transaction of periodTransactions) {
      // YYYY-MM-DD
      if (transaction.transactionType === 'deposit')
        periodDepositsWithdraws.deposits += transaction.amount
      else if (transaction.transactionType === 'withdraw')
        periodDepositsWithdraws.withdraws += transaction.amount
    }

    return right(periodDepositsWithdraws)
  }
}
