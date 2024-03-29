import moment from 'moment'
import { IGetPeriodBalance } from '../../../domain/useCases/balance'
import { PeriodBalanceProps } from '../../../domain/useCases/balance/DTOs'
import { ErrorManager, left, right } from '../../../shared'
import { IUserRepositoryGetUserData } from '../../dependencies/repositories/UserRepository'
import { TransactionHelper } from './utils'

export class GetUserPeriodBalanceUseCase implements IGetPeriodBalance {
  constructor(private readonly userRepository: IUserRepositoryGetUserData) {}

  async execute(props: IGetPeriodBalance.Props): Promise<IGetPeriodBalance.Response> {
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
    const periodBalances: PeriodBalanceProps[] = this.setupPeriod(
      props.startingMonth,
      props.endingMonth
    )

    for (const transaction of periodTransactions) {
      // YYYY-MM-DD
      const transactionMonth = transaction.date.slice(0, 7)
      const existingPeriod = periodBalances.find(period => period.date === transactionMonth)
      if (!existingPeriod)
        periodBalances.push({ balance: transaction.amount, date: transactionMonth })
      else {
        const existingPeriodIndex = periodBalances.indexOf(existingPeriod)
        if (transaction.transactionType === 'deposit')
          periodBalances[existingPeriodIndex].balance += transaction.amount
        else if (transaction.transactionType === 'withdraw')
          periodBalances[existingPeriodIndex].balance -= transaction.amount
      }
    }

    return right(periodBalances)
  }

  setupPeriod(startingMonth: string, endingMonth: string): PeriodBalanceProps[] {
    const periodBalances: PeriodBalanceProps[] = []
    let currentDate = startingMonth
    do {
      // YYYY-MM
      periodBalances.push({ date: currentDate, balance: 0 })
      const currentYear = parseInt(currentDate.slice(0, 4))
      const currentMonth = parseInt(currentDate.slice(5, 7))
      if (currentMonth === 12) {
        currentDate = currentDate.replace(currentDate.slice(0, 4), (currentYear + 1).toString())
        currentDate = currentDate.replace(currentDate.slice(5, 7), '01')
      } else {
        const newMonth = this.createMonthStringFromNumber(currentMonth + 1)
        currentDate = `${currentYear}-${newMonth}`
      }
    } while (currentDate !== endingMonth)
    periodBalances.push({ date: endingMonth, balance: 0 })
    return periodBalances
  }

  createMonthStringFromNumber(monthNumber: number): string {
    return monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`
  }
}
