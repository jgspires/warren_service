import { LoginUserUseCase } from '../../data/useCases/users'
import { LoginUserControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'
import { tokenManager } from './external/Utils'

export const makeLoginUser = (): LoginUserControllerOperation => {
  const loginUser = new LoginUserUseCase(userRepository, tokenManager)

  return new LoginUserControllerOperation(loginUser)
}
