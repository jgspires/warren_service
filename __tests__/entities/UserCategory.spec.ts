import { UserCategory } from '../../src/domain/entities'
import { UserCategoryBuilder } from '../builders'

describe('User Category Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid user category', () => {
      const categoryOrError = UserCategory.create(UserCategoryBuilder.aUserCategory().build())
      expect(categoryOrError.isRight()).toBeTruthy()
    })
  })

  describe('Error Cases', () => {
    it('Should deny a user category with invalid name', () => {
      const categoryOrError = UserCategory.create(
        UserCategoryBuilder.aUserCategory().withBadName().build()
      )
      expect(categoryOrError.isLeft()).toBeTruthy()
    })
  })
})
