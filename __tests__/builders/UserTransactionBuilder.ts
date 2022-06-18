import { UserTransactionProps } from '../../src/domain/entities'

export class UserTransactionBuilder {
  private userTransaction: UserTransactionProps = {
    name: 'User Transaction',
    amount: 600.5,
    date: '2022-05-30',
    sourceOrDestination: 'User Bank',
    paymentType: 'VISA Credit Card',
    transactionType: 'deposit',
    walletId: 0
  }

  static aUserTransaction(): UserTransactionBuilder {
    return new UserTransactionBuilder()
  }

  public withName(name: string): UserTransactionBuilder {
    this.userTransaction.name = name
    return this
  }

  public withAmount(amount: number): UserTransactionBuilder {
    this.userTransaction.amount = amount
    return this
  }

  public withDate(date: string): UserTransactionBuilder {
    this.userTransaction.date = date
    return this
  }

  public withBadName(): UserTransactionBuilder {
    this.userTransaction.name =
      'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
    return this
  }

  public build(): UserTransactionProps {
    return this.userTransaction
  }
}
