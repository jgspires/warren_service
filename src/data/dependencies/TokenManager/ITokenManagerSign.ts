import { UserFromRequestProps } from '../../../domain/entities'

export interface ITokenManagerSign<T = UserFromRequestProps> {
  sign(info: T, expiresIn?: string): Promise<string>
}
