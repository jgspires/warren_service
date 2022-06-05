import { UserFromRequestProps } from '../../../domain/entities'
import { ApplicationError } from '../../../domain/errors'
import { Either } from '../../../shared'

export interface ITokenManagerDecode<T = UserFromRequestProps> {
  decode(token: string): Promise<Either<ApplicationError, T>>
}
