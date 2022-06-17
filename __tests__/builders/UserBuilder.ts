import { UserProps } from '../../src/domain/entities/User'
import { UserCategoryBuilder } from './UserCategoryBuilder'
import { UserWalletBuilder } from './UserWalletBuilder'

export class UserBuilder {
  private user: UserProps = {
    _id: 'validId',
    password: 'ValidPwd!',
    categories: [UserCategoryBuilder.aUserCategory().build()],
    wallets: [UserWalletBuilder.aUserWallet().build()]
  }

  static aUser(): UserBuilder {
    return new UserBuilder()
  }

  public withBadUserId(): UserBuilder {
    this.user._id = 'invalid id'
    return this
  }

  public withBadUserPwd(): UserBuilder {
    this.user.password = 'nope'
    return this
  }

  public build(): UserProps {
    return this.user
  }
}
