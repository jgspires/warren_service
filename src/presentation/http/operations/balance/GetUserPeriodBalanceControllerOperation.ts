import { IGetPeriodBalance } from '../../../../domain/useCases/balance'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import {
  PeriodBalanceViewModel,
  PeriodDatesViewModel,
  UserFromRequestViewModel
} from '../../viewModels'

export class GetUserPeriodBalanceControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly getPeriodBalance: IGetPeriodBalance) {}

  async operate(
    request: HttpRequest<PeriodDatesViewModel, any, UserFromRequestViewModel>
  ): ControllerOperationResponse<PeriodBalanceViewModel[]> {
    const userId = request.params._id
    const periodDates = request.body
    const responseOrError = await this.getPeriodBalance.execute({
      _id: userId,
      startingMonth: periodDates.startingMonth,
      endingMonth: periodDates.endingMonth
    })

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
