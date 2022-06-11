import { User } from '../../../domain/entities/User'
import { IRegisterUser } from '../../../domain/useCases/users'
import { ErrorManager, left, right } from '../../../shared'
import {
  IUserRepositoryGetUserData,
  IUserRepositoryRegisterUser
} from '../../dependencies/repositories/UserRepository'

export class RegisterUserUseCase implements IRegisterUser {
  constructor(
    private readonly userRepository: IUserRepositoryGetUserData & IUserRepositoryRegisterUser
  ) {}

  async execute(props: IRegisterUser.Props): Promise<IRegisterUser.Response> {
    const existingUserOrError = await this.userRepository.getUserData({ _id: props._id })
    if (existingUserOrError.isLeft()) return left(existingUserOrError.value)
    if (existingUserOrError.value) return left(ErrorManager.DuplicateError('User', props._id))

    const createdUserOrError = User.create(props)
    if (createdUserOrError.isLeft()) return left(createdUserOrError.value)
    const createdUserProps = createdUserOrError.value.value

    const nullOrError = await this.userRepository.registerUser({ ...createdUserProps })
    if (nullOrError.isLeft()) return left(nullOrError.value)

    return right({ _id: createdUserProps._id })
  }
}
