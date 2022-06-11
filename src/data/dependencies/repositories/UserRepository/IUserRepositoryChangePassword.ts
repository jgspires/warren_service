import { UserFromRequestProps } from '../../../../domain/entities'
import { ExternalResponse } from '../../../../shared'

export interface IUserRepositoryChangePassword {
  changePassword(user: UserFromRequestProps, newPassword: string): ExternalResponse
}
