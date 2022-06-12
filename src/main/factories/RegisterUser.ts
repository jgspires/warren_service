import { RegisterUserUseCase } from '../../data/useCases/users'
import { RegisterUserControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'

export const makeRegisterUser = (): RegisterUserControllerOperation => {
  const registerUser = new RegisterUserUseCase(userRepository)

  return new RegisterUserControllerOperation(registerUser)
}
