import { DeleteUserUseCase } from '../../data/useCases/users'
import { DeleteUserControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'

export const makeDeleteUser = (): DeleteUserControllerOperation => {
  const deleteUser = new DeleteUserUseCase(userRepository)

  return new DeleteUserControllerOperation(deleteUser)
}
