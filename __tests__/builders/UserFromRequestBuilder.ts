import { UserFromRequestProps } from '../../src/domain/entities'

export class UserFromRequestBuilder {
  private userFromRequest: UserFromRequestProps = {
    _id: 'admin'
  }

  static aUserFromRequest(): UserFromRequestBuilder {
    return new UserFromRequestBuilder()
  }

  public build(): UserFromRequestProps {
    return this.userFromRequest
  }
}
