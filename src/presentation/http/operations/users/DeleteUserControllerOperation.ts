import { IDeleteUser } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { UserFromRequestViewModel } from '../../viewModels'

export class DeleteUserControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly deleteUser: IDeleteUser) {}

  async operate(
    request: HttpRequest<any, any, UserFromRequestViewModel>
  ): ControllerOperationResponse<null> {
    const user = request.params
    const responseOrError = await this.deleteUser.execute(user)

    if (responseOrError.isRight()) return right(success(null, 204))
    else return left(responseOrError.value)
  }
}
