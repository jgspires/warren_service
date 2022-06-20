import { UserFromRequestProps } from '../../../../domain/entities'
import { IRecoverUser } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { UserNoPasswordViewModel } from '../../viewModels'

export class RecoverUserControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly recoverUser: IRecoverUser) {}

  async operate(
    request: HttpRequest<any, any, UserFromRequestProps>
  ): ControllerOperationResponse<UserNoPasswordViewModel> {
    const user = request.params
    const userOrError = await this.recoverUser.execute(user)

    if (userOrError.isRight()) return right(success(userOrError.value))
    else return left(userOrError.value)
  }
}
