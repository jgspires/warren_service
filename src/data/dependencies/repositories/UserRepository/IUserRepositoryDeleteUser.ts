import { UserFromRequestProps } from '../../../../domain/entities'
import { ExternalResponse } from '../../../../shared'

export interface IUserRepositoryDeleteUser {
  deleteUser(user: UserFromRequestProps): ExternalResponse
}
