import { User } from '../../src/domain/entities/'
import { UserBuilder } from '../builders'

describe('User Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user', () => {
      const userOrError = User.create(UserBuilder.aUser().build())
      expect(userOrError.isRight()).toBeTruthy()
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user with invalid user id', () => {
      const userOrError = User.create(UserBuilder.aUser().withBadUserId().build())
      expect(userOrError.isLeft()).toBeTruthy()
    })

    it('Should deny a user with invalid password', () => {
      const userOrError = User.create(UserBuilder.aUser().withBadUserPwd().build())
      expect(userOrError.isLeft()).toBeTruthy()
    })
  })
})
