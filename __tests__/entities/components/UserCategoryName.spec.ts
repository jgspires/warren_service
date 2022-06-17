import { UserCategoryName } from '../../../src/domain/entities/components'

describe('User Category Name Entity', () => {
  describe('Success Cases', () => {
    it('Should allow a valid category name', () => {
      const categoryNameOrError = UserCategoryName.create('Valid Category Name')
      expect(categoryNameOrError.isRight()).toBeTruthy()
    })

    it('Should allow category name with special characters', () => {
      const categoryNameOrError = UserCategoryName.create('@ Valid Category Name!')
      expect(categoryNameOrError.isRight()).toBeTruthy()
    })

    it('Should trim the given category name', () => {
      const categoryNameOrError = UserCategoryName.create('  Valid Category ')
      const categoryName = (categoryNameOrError.value as UserCategoryName).value
      expect(categoryNameOrError.isRight()).toBeTruthy()
      expect(categoryName).toBe('Valid Category')
    })
  })

  describe('Error Cases', () => {
    it('Should deny a category name that is too long', () => {
      const userIdOrError = UserCategoryName.create(
        'OHMYGODITSSODAMNBIIIIIIIIIIIIIIIIIIIIIIIIIIIIG'
      )
      expect(userIdOrError.isLeft()).toBeTruthy()
    })
  })
})
