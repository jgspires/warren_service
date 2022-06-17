import { UserTransactionProps } from '../../src/domain/entities'

export class UserTransactionBuilder {
  private userTransaction: UserTransactionProps = {
    _id: '005337198FE18A',
    name: 'User Transaction',
    amount: 600.5,
    date: '03/05/2022',
    sourceOrDestination: 'User Bank',
    paymentType: 'VISA Credit Card',
    transactionType: 'deposit'
  }

  static aUserTransaction(): UserTransactionBuilder {
    return new UserTransactionBuilder()
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
