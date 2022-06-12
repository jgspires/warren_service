import { UserPassword } from '../../../domain/entities/components'
import { IChangeUserPassword } from '../../../domain/useCases/users'
import { ErrorManager, left, right } from '../../../shared'
import {
  IUserRepositoryChangePassword,
  IUserRepositoryGetUserData
} from '../../dependencies/repositories/UserRepository'

export class ChangeUserPasswordUseCase implements IChangeUserPassword {
  constructor(
    private readonly userRepository: IUserRepositoryGetUserData & IUserRepositoryChangePassword
  ) {}

  async execute(props: IChangeUserPassword.Props): Promise<IChangeUserPassword.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))
    const foundUser = existingUserOrError.value

    const passwordOrError = UserPassword.create(props.newPassword)
    if (passwordOrError.isLeft()) return left(passwordOrError.value)
    const validatedPassword = passwordOrError.value.value

    if (validatedPassword === foundUser.password)
      return left(
        ErrorManager.InvalidError('User', 'password', 'New and old passwords must differ')
      )

    const updatePwdResponseOrError = await this.userRepository.changePassword(
      { _id: props._id },
      validatedPassword
    )
    if (updatePwdResponseOrError.isLeft()) return left(updatePwdResponseOrError.value)

    return right({ _id: foundUser._id })
  }
}
