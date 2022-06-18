import { UserWalletProps } from '../../src/domain/entities/'

export class UserWalletBuilder {
  private userWallet: UserWalletProps = {
    name: 'User Wallet',
    colour: '#FFFFFF',
    iconIndex: 0
  }

  static aUserWallet(): UserWalletBuilder {
    return new UserWalletBuilder()
  }

  public withName(name: string): UserWalletBuilder {
    this.userWallet.name = name
    return this
  }

  public withBadName(): UserWalletBuilder {
    this.userWallet.name =
      'LOOONGLOOOONGMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN'
    return this
  }

  public build(): UserWalletProps {
    return this.userWallet
  }
}
