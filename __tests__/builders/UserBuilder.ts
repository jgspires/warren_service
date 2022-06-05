import { UserProps } from '../../src/domain/entities/User'

export class UserBuilder {
  private user: UserProps = {
    userId: 'validId',
    password: 'ValidPwd!'
  }

  static aUser(): UserBuilder {
    return new UserBuilder()
  }

  public withBadUserId(): UserBuilder {
    this.user.userId = 'invalid id'
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