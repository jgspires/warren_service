import { UserProps } from '../../../../domain/entities/User'
import { ExternalResponse } from '../../../../shared'

export interface IUserRepositoryRegisterUser {
  registerUser(user: UserProps): ExternalResponse
}
