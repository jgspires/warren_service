import { UserFromRequestProps } from '../../../domain/entities'
import { UserProps } from '../../../domain/entities/User'
import { ApplicationError } from '../../../domain/errors'
import { ExternalResponse, right } from '../../../shared'
import { IUserRepository } from '../../ports'

export class MongoUserRepository implements IUserRepository {
  async registerUser(_user: UserProps): ExternalResponse<null, ApplicationError> {
    return right(null)
  }

  async changePassword(
    _user: UserFromRequestProps,
    _newPassword: string
  ): ExternalResponse<null, ApplicationError> {
    return right(null)
  }

  async deleteUser(_user: UserFromRequestProps): ExternalResponse<null, ApplicationError> {
    return right(null)
  }

  async getUserData(
    _user: UserFromRequestProps
  ): ExternalResponse<UserProps | null, ApplicationError> {
    return right(null)
  }
}
