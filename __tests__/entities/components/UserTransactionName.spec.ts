import { UserTransactionName } from '../../../src/domain/entities/components'

describe('User Transaction Name Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid transaction name', () => {
      const transactionNameOrError = UserTransactionName.create('Valid Transaction Name')
      expect(transactionNameOrError.isRight()).toBeTruthy()
    })

    it('Should allow transaction name with special characters', () => {
      const transactionNameOrError = UserTransactionName.create('@ Valid Transaction Name!')
      expect(transactionNameOrError.isRight()).toBeTruthy()
    })

    it('Should trim the given transaction name', () => {
      const transactionNameOrError = UserTransactionName.create('  Valid Transaction ')
      const transactionName = (transactionNameOrError.value as UserTransactionName).value
      expect(transactionNameOrError.isRight()).toBeTruthy()
      expect(transactionName).toBe('Valid Transaction')
    })
  })

  describe('Error Cases', () => {
    it('Should deny a transaction name that is too long', () => {
      const userIdOrError = UserTransactionName.create(
        'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
      )
      expect(userIdOrError.isLeft()).toBeTruthy()
    })
  })
})
