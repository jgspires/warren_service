import { UpdateUserUseCase } from '../../data/useCases/users'
import { UpdateUserControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'

export const makeUpdateUser = (): UpdateUserControllerOperation => {
  const updateUserPassword = new UpdateUserUseCase(userRepository)

  return new UpdateUserControllerOperation(updateUserPassword)
}
