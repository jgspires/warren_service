import { IDecodeAccessToken } from '../../domain/useCases'
import { ErrorManager, left, right } from '../../shared'
import { ITokenManager } from '../../solutions/contracts'

export class DecodeAccessTokenUseCase implements IDecodeAccessToken {
  constructor(private readonly tokenManager: ITokenManager) {}

  async execute(props: IDecodeAccessToken.Props): Promise<IDecodeAccessToken.Response> {
    if (!props.accessToken) return left(ErrorManager.MissingTokenError())

    const token = props.accessToken.replace('Bearer ', '')

    const decodedTokenOrError = await this.tokenManager.decode(token)
    if (decodedTokenOrError.isLeft()) return left(decodedTokenOrError.value)

    return right(decodedTokenOrError.value)
  }
}
