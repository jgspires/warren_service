import { ITokenManagerDecode, ITokenManagerSign } from '../../data/dependencies/TokenManager'
import { UserFromRequestProps } from '../../domain/entities'

export interface ITokenManager<T = UserFromRequestProps>
  extends ITokenManagerDecode<T>,
    ITokenManagerSign<T> {}
