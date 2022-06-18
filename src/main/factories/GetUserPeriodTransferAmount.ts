import { GetUserPeriodTransferAmountUseCase } from '../../data/useCases/balance'
import { GetUserPeriodTransferAmountControllerOperation } from '../../presentation/http/operations/balance'
import { userRepository } from './external/Repositories'

export const makeGetUserPeriodTransferAmount =
  (): GetUserPeriodTransferAmountControllerOperation => {
    const getPeriodTransferAmount = new GetUserPeriodTransferAmountUseCase(userRepository)

    return new GetUserPeriodTransferAmountControllerOperation(getPeriodTransferAmount)
  }
