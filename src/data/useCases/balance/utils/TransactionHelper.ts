import moment from 'moment'
import { UserProps, UserTransactionProps } from '../../../../domain/entities'

export class TransactionHelper {
  static getPeriodTransactions(
    user: UserProps,
    startTimestamp: number,
    endTimestamp: number
  ): UserTransactionProps[] {
    let periodTransactions: UserTransactionProps[] = []
    for (const category of user.categories) {
      const validCategoryTransactions = category.transactions.filter(tran => {
        const transactionTimestamp = moment(tran.date).unix()
        if (transactionTimestamp >= startTimestamp && transactionTimestamp <= endTimestamp)
          return true
        else return false
      })
      periodTransactions = periodTransactions.concat(validCategoryTransactions)
    }
    return periodTransactions
  }
}
