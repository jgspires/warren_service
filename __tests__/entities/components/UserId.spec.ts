import { UserId } from '../../../src/domain/entities/components'

describe('User Id Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user id without numbers', () => {
      const userIdOrError = UserId.create('validId')
      expect(userIdOrError.isRight()).toBeTruthy()
    })

    it('Should allow a valid user id with numbers', () => {
      const userIdOrError = UserId.create('validId123')
      expect(userIdOrError.isRight()).toBeTruthy()
    })

    it('Should trim the given id', () => {
      const userIdOrError = UserId.create('   validId123      ')
      const userId = (userIdOrError.value as UserId).value
      expect(userIdOrError.isRight()).toBeTruthy()
      expect(userId).toBe('validId123')
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user id that is too small', () => {
      const userIdOrError = UserId.create('no')
      expect(userIdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user id that is too long', () => {
      const userIdOrError = UserId.create('OHMYGODITSSODAMNBIIIIIIIIIIIIIIIIIIIIIIIIIIIIG')
      expect(userIdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user id starting with a number', () => {
      const userIdOrError = UserId.create('1noGoodId')
      expect(userIdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user id with spaces', () => {
      const userIdOrError = UserId.create('closebutNot Good')
      expect(userIdOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user id with special characters', () => {
      const userIdOrError = UserId.create('notGoodEither!')
      expect(userIdOrError.isLeft()).toBeTruthy()
    })
  })
})
