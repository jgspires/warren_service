import { UserFromRequestProps } from '../../../../domain/entities'
import { UserProps } from '../../../../domain/entities/User'
import { ExternalResponse } from '../../../../shared'

export interface IUserRepositoryGetUserData {
  getUserData(user: UserFromRequestProps): ExternalResponse<UserProps | null>
}
