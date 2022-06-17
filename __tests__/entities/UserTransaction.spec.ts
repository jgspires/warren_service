import { UserTransaction } from '../../src/domain/entities/'
import { UserTransactionBuilder } from '../builders'

describe('User Transaction Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user transaction', () => {
      const transactionOrError = UserTransaction.create(
        UserTransactionBuilder.aUserTransaction().build()
      )
      expect(transactionOrError.isRight()).toBeTruthy()
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user transaction with invalid name', () => {
      const transactionOrError = UserTransaction.create(
        UserTransactionBuilder.aUserTransaction().withBadName().build()
      )
      expect(transactionOrError.isLeft()).toBeTruthy()
    })
  })
})
