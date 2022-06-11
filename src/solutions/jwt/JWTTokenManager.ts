import * as Yup from 'yup'
import { decode, sign } from 'jsonwebtoken'
import { UserFromRequestProps } from '../../domain/entities'
import { Either, right, left, ErrorManager } from '../../shared'
import { ITokenManager } from '../contracts'
import { ApplicationError } from '../../domain/errors'
import { TOKEN_SECRET } from '../../main/config'

export class JWTTokenManager implements ITokenManager<UserFromRequestProps> {
  private validatePayload(
    payload: UserFromRequestProps
  ): Either<ApplicationError, UserFromRequestProps> {
    const schema = Yup.object().shape({
      _id: Yup.string().required()
    })

    try {
      const validatedPayload = schema.validateSync(payload)
      return right(validatedPayload)
    } catch (error) {
      return left(ErrorManager.InvalidTokenPayloadError(payload))
    }
  }

  async decode(token: string): Promise<Either<ApplicationError, UserFromRequestProps>> {
    try {
      const decoded = decode(token) as UserFromRequestProps | null
      if (decoded) {
        return this.validatePayload(decoded)
      }
      return left(ErrorManager.InvalidTokenError(token))
    } catch (error) {
      return left(ErrorManager.InvalidTokenError(token))
    }
  }

  async sign(info: UserFromRequestProps): Promise<string> {
    const token = sign(info, TOKEN_SECRET)
    return token
  }
}
