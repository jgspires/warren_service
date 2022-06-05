import { ITokenManager } from '../../../solutions/contracts'
import { JWTTokenManager } from '../../../solutions/jwt'

export const tokenManager: ITokenManager = new JWTTokenManager()
