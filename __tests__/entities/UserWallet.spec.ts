import { UserWallet } from '../../src/domain/entities/'
import { UserWalletBuilder } from '../builders'

describe('User Wallet Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user wallet', () => {
      const walletOrError = UserWallet.create(UserWalletBuilder.aUserWallet().build())
      expect(walletOrError.isRight()).toBeTruthy()
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user wallet with invalid name', () => {
      const walletOrError = UserWallet.create(UserWalletBuilder.aUserWallet().withBadName().build())
      expect(walletOrError.isLeft()).toBeTruthy()
    })
  })
})
