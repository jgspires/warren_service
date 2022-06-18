import { UserProps } from '../../../domain/entities'
import { ApplicationError } from '../../../domain/errors'
import { IUpdateUser } from '../../../domain/useCases/users'
import { UserDataProps } from '../../../domain/useCases/users/DTOs'
import { Either, ErrorManager, left, right } from '../../../shared'
import {
  IUserRepositoryGetUserData,
  IUserRepositoryUpdateUser
} from '../../dependencies/repositories/UserRepository'

export class UpdateUserUseCase implements IUpdateUser {
  constructor(
    private readonly userRepository: IUserRepositoryGetUserData & IUserRepositoryUpdateUser
  ) {}

  async execute(props: IUpdateUser.Props): Promise<IUpdateUser.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))
    const foundUser = existingUserOrError.value

    const nullOrError = this.checkEntityNames(props.user)
    if (nullOrError.isLeft()) return left(nullOrError.value)

    const updatedUser: UserProps = {
      _id: foundUser._id,
      password: foundUser.password,
      ...props.user
    }
    const updatePwdResponseOrError = await this.userRepository.updateUser(updatedUser)
    if (updatePwdResponseOrError.isLeft()) return left(updatePwdResponseOrError.value)
    const response = { ...props.user, _id: props._id }
    return right(response)
  }

  checkEntityNames(user: UserDataProps): Either<ApplicationError, null> {
    for (const category of user.categories) {
      if (user.categories.filter(cat => cat.name === category.name).length > 1)
        return left(ErrorManager.DuplicateError('Category', category.name))
    }

    for (const wallet of user.wallets) {
      if (user.wallets.filter(wal => wal.name === wallet.name).length > 1)
        return left(ErrorManager.DuplicateError('Wallet', wallet.name))
    }

    return right(null)
  }
}
