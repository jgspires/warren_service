import { RecoverUserUseCase } from '../../data/useCases/users'
import { RecoverUserControllerOperation } from '../../presentation/http/operations/users'
import { userRepository } from './external/Repositories'

export const makeRecoverUser = (): RecoverUserControllerOperation => {
  const recoverUser = new RecoverUserUseCase(userRepository)

  return new RecoverUserControllerOperation(recoverUser)
}
