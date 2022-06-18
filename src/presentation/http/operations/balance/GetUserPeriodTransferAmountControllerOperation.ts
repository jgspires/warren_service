import { IGetPeriodTransferAmount } from '../../../../domain/useCases/balance'
import { PeriodTransferAmountProps } from '../../../../domain/useCases/balance/DTOs'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { PeriodDatesViewModel, UserFromRequestViewModel } from '../../viewModels'

export class GetUserPeriodTransferAmountControllerOperation
  implements IControllerOperation<HttpRequest>
{
  constructor(private readonly getPeriodTransferAmount: IGetPeriodTransferAmount) {}

  async operate(
    request: HttpRequest<PeriodDatesViewModel, any, UserFromRequestViewModel>
  ): ControllerOperationResponse<PeriodTransferAmountProps> {
    const userId = request.params._id
    const periodDates = request.body
    const responseOrError = await this.getPeriodTransferAmount.execute({
      _id: userId,
      startingMonth: periodDates.startingMonth,
      endingMonth: periodDates.endingMonth
    })

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
