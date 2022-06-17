import { UserFromRequestProps } from '../../../../domain/entities'
import { IChangeUserPassword } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { UserFromRequestViewModel, UserPasswordViewModel } from '../../viewModels'

export class ChangeUserPasswordControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly changeUserPassword: IChangeUserPassword) {}

  async operate(
    request: HttpRequest<UserPasswordViewModel, any, UserFromRequestViewModel>
  ): ControllerOperationResponse<UserFromRequestProps> {
    const user = request.params
    const newPassword = request.body
    const props = {
      _id: user._id,
      newPassword: newPassword.password
    }
    const responseOrError = await this.changeUserPassword.execute(props)

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
