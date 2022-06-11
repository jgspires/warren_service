import { ILoginUser } from '../../../domain/useCases/users'
import { ErrorManager, left, right } from '../../../shared'
import { IUserRepositoryGetUserData } from '../../dependencies/repositories/UserRepository'
import { ITokenManagerSign } from '../../dependencies/TokenManager'

export class LoginUserUseCase implements ILoginUser {
  constructor(
    private readonly userRepository: IUserRepositoryGetUserData,
    private readonly tokenManager: ITokenManagerSign
  ) {}

  async execute(props: ILoginUser.Props): Promise<ILoginUser.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))
    const foundUser = existingUserOrError.value

    if (foundUser.password !== props.password)
      return left(ErrorManager.PermissionError('User password mismatch.'))

    const authToken = await this.tokenManager.sign({ _id: props._id })

    return right(authToken)
  }
}
