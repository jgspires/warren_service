import { UserProps } from '../../../../domain/entities'
import { ExternalResponse } from '../../../../shared'

export interface IUserRepositoryUpdateUser {
  updateUser(user: UserProps): ExternalResponse
}
