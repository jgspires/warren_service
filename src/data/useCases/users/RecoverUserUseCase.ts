import { IRecoverUser } from '../../../domain/useCases/users'
import { UserNoPasswordProps } from '../../../domain/useCases/users/DTOs'
import { ErrorManager, left, right } from '../../../shared'
import { IUserRepositoryGetUserData } from '../../dependencies/repositories/UserRepository'

export class RecoverUserUseCase implements IRecoverUser {
  constructor(private readonly userRepository: IUserRepositoryGetUserData) {}

  async execute(props: IRecoverUser.Props): Promise<IRecoverUser.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))
    const foundUser = existingUserOrError.value

    const response: UserNoPasswordProps = {
      _id: foundUser._id,
      categories: foundUser.categories,
      wallets: foundUser.wallets
    }

    return right(response)
  }
}
