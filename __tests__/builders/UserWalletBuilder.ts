import { UserWalletProps } from '../../src/domain/entities/'

export class UserWalletBuilder {
  private user: UserWalletProps = {
    name: 'User Wallet',
    colour: '#FFFFFF',
    iconIndex: 0
  }

  static aUserWallet(): UserWalletBuilder {
    return new UserWalletBuilder()
  }

  public withBadName(): UserWalletBuilder {
    this.user.name =
      'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
    return this
  }

  public build(): UserWalletProps {
    return this.user
  }
}
