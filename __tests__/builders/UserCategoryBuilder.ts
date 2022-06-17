import { UserCategoryProps } from '../../src/domain/entities'

export class UserCategoryBuilder {
  private userCategory: UserCategoryProps = {
    name: 'User Category',
    colour: '#FFFFFF',
    iconIndex: 0
  }

  static aUserCategory(): UserCategoryBuilder {
    return new UserCategoryBuilder()
  }

  public withBadName(): UserCategoryBuilder {
    this.userCategory.name =
      'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
    return this
  }

  public build(): UserCategoryProps {
    return this.userCategory
  }
}
