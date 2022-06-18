import { GetUserPeriodBalanceUseCase } from '../../data/useCases/balance'
import { GetUserPeriodBalanceControllerOperation } from '../../presentation/http/operations/balance'
import { userRepository } from './external/Repositories'

export const makeGetUserPeriodBalance = (): GetUserPeriodBalanceControllerOperation => {
  const getPeriodBalance = new GetUserPeriodBalanceUseCase(userRepository)

  return new GetUserPeriodBalanceControllerOperation(getPeriodBalance)
}
