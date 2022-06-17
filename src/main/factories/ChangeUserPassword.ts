import { ChangeUserPasswordUseCase } from '../../data/useCases/users'
import { ChangeUserPasswordControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'

export const makeChangeUserPassword = (): ChangeUserPasswordControllerOperation => {
  const changeUserPassword = new ChangeUserPasswordUseCase(userRepository)

  return new ChangeUserPasswordControllerOperation(changeUserPassword)
}
