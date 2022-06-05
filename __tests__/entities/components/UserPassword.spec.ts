import { UserPassword } from '../../../src/domain/entities/components'

describe('User Password Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user password without numbers', () => {
      const userPwdOrError = UserPassword.create('Password!')
      expect(userPwdOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid user password with numbers', () => {
      const userPwdOrError = UserPassword.create('Password!123')
      expect(userPwdOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid user password starting with a number', () => {
      const userPwdOrError = UserPassword.create('1Password!123')
      expect(userPwdOrError.isRight()).toBeTruthy()
    })

    it('Should trim the given password', () => {
      const userPwdOrError = UserPassword.create('   Password!123      ')
      const userPwd = (userPwdOrError.value as UserPassword).value
      expect(userPwdOrError.isRight()).toBeTruthy()
      expect(userPwd).toBe('Password!123')
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user password that is too small', () => {
      const userPwdOrError = UserPassword.create('No!')
      expect(userPwdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user password that is too long', () => {
      const userPwdOrError = UserPassword.create('oHMYGODITSSODAMNBIIIIIIIIIIIIIIIIIIIIIIIIIIIIG!')
      expect(userPwdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user password without special characters', () => {
      const userPwdOrError = UserPassword.create('noGoodPwd')
      expect(userPwdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user password with spaces', () => {
      const userPwdOrError = UserPassword.create('ClosebutNot Good!')
      expect(userPwdOrError.isLeft()).toBeTruthy()
    })
  })
})
