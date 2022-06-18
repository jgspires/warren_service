import { UserTransactionProps } from '../../src/domain/entities'

export class UserTransactionBuilder {
  private userTransaction: UserTransactionProps = {
    name: 'User Transaction',
    amount: 600.5,
    date: '03/05/2022',
    sourceOrDestination: 'User Bank',
    paymentType: 'VISA Credit Card',
    transactionType: 'deposit',
    wallet: 'Wallet'
  }

  static aUserTransaction(): UserTransactionBuilder {
    return new UserTransactionBuilder()
  }

  public withName(name: string): UserTransactionBuilder {
    this.userTransaction.name = name
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
