import { UserWalletName } from '../../../src/domain/entities/components'

describe('User Wallet Name Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid wallet name', () => {
      const walletNameOrError = UserWalletName.create('Valid Wallet Name')
      expect(walletNameOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid wallet name with numbers', () => {
      const walletNameOrError = UserWalletName.create('Valid Wallet 123')
      expect(walletNameOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid wallet name starting with a number', () => {
      const walletNameOrError = UserWalletName.create('1 Valid Wallet')
      expect(walletNameOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid wallet name without capital letters', () => {
      const walletNameOrError = UserWalletName.create('valid wallet name')
      expect(walletNameOrError.isRight()).toBeTruthy()
    })

    it('Should trim the given wallet name', () => {
      const walletNameOrError = UserWalletName.create('  Valid Wallet ')
      const walletName = (walletNameOrError.value as UserWalletName).value
      expect(walletNameOrError.isRight()).toBeTruthy()
      expect(walletName).toBe('Valid Wallet')
    })
  })

  describe('Error Cases', () => {
    it('Should deny a wallet name that is too long', () => {
      const userIdOrError = UserWalletName.create(
        'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
      )
      expect(userIdOrError.isLeft()).toBeTruthy()
    })
  })
})
