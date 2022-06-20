import { IGetPeriodBalance } from '../../../../domain/useCases/balance'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { PeriodBalanceViewModel, PeriodDatesViewModel } from '../../viewModels'

export class GetUserPeriodBalanceControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly getPeriodBalance: IGetPeriodBalance) {}

  async operate(
    request: HttpRequest<any, any, PeriodDatesViewModel>
  ): ControllerOperationResponse<PeriodBalanceViewModel[]> {
    const params = request.params
    const responseOrError = await this.getPeriodBalance.execute({
      _id: params._id,
      startingMonth: params.startingMonth,
      endingMonth: params.endingMonth
    })

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
