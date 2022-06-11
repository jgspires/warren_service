import { UserFromRequestProps } from '../../domain/entities'
import { UserProps } from '../../domain/entities/User'
import { ApplicationError } from '../../domain/errors'
import { ExternalResponse, right, left, ErrorManager } from '../../shared'
import { logger } from '../../shared/logger'
import { IUserRepository } from '../ports'
import { dbAddressWarren } from './config'
import Mongo from './db/Mongo'
import { UserSchema } from './schemas'

export class MongoUserRepository extends Mongo implements IUserRepository {
  private serviceName = 'Mongo Users Repository'
  private collectionName = 'userData'

  constructor(dbAddress?: string) {
    super(dbAddress || dbAddressWarren, logger)
  }

  async registerUser(user: UserProps): ExternalResponse {
    try {
      await this.save<UserSchema>(user._id, this.collectionName, user)

      return right(null)
    } catch (e) {
      return left(ErrorManager.ConnectionError(this.serviceName))
    }
  }

  async getUserData(user: UserFromRequestProps): ExternalResponse<UserProps | null> {
    try {
      const [recoveredUser] = await this.load<UserSchema>(user._id, this.collectionName, {
        _id: user._id
      })

      return right(recoveredUser || null)
    } catch (e) {
      return left(ErrorManager.ConnectionError(this.serviceName))
    }
  }

  async changePassword(user: UserFromRequestProps, newPassword: string): ExternalResponse {
    try {
      await this.update<UserSchema>(
        user._id,
        this.collectionName,
        { _id: user._id },
        { $set: { _id: user._id, password: newPassword } }
      )

      return right(null)
    } catch (e) {
      return left(ErrorManager.ConnectionError(this.serviceName))
    }
  }

  async deleteUser(user: UserFromRequestProps): ExternalResponse<null, ApplicationError> {
    try {
      await this.dropDb(user._id)

      return right(null)
    } catch (e) {
      return left(ErrorManager.ConnectionError(this.serviceName))
    }
  }
}
