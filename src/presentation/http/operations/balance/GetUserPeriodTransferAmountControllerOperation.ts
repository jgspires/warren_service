import { IGetPeriodTransferAmount } from '../../../../domain/useCases/balance'
import { PeriodTransferAmountProps } from '../../../../domain/useCases/balance/DTOs'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { PeriodDatesViewModel } from '../../viewModels'

export class GetUserPeriodTransferAmountControllerOperation
  implements IControllerOperation<HttpRequest>
{
  constructor(private readonly getPeriodTransferAmount: IGetPeriodTransferAmount) {}

  async operate(
    request: HttpRequest<any, any, PeriodDatesViewModel>
  ): ControllerOperationResponse<PeriodTransferAmountProps> {
    const params = request.params
    const responseOrError = await this.getPeriodTransferAmount.execute({
      _id: params._id,
      startingMonth: params.startingMonth,
      endingMonth: params.endingMonth
    })

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
