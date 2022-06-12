import { IDeleteUser } from '../../../domain/useCases/users'
import { ErrorManager, left, right } from '../../../shared'
import {
  IUserRepositoryDeleteUser,
  IUserRepositoryGetUserData
} from '../../dependencies/repositories/UserRepository'

export class DeleteUserUseCase implements IDeleteUser {
  constructor(
    private readonly userRepository: IUserRepositoryGetUserData & IUserRepositoryDeleteUser
  ) {}

  async execute(props: IDeleteUser.Props): Promise<IDeleteUser.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (!existingUserOrError.value) return left(ErrorManager.NotFoundError('User', props._id))

    const deleteResponseOrError = await this.userRepository.deleteUser({ _id: props._id })
    if (deleteResponseOrError.isLeft()) return left(deleteResponseOrError.value)

    return right(null)
  }
}
