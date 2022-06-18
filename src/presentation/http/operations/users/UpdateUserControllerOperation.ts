import { IUpdateUser } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import {
  UserDataViewModel,
  UserFromRequestViewModel,
  UserNoPasswordViewModel
} from '../../viewModels'

export class UpdateUserControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly updateUser: IUpdateUser) {}

  async operate(
    request: HttpRequest<UserDataViewModel, any, UserFromRequestViewModel>
  ): ControllerOperationResponse<UserNoPasswordViewModel> {
    const user = request.body
    const props = {
      _id: request.params._id,
      user
    }
    const responseOrError = await this.updateUser.execute(props)

    if (responseOrError.isRight()) return right(success(responseOrError.value))
    else return left(responseOrError.value)
  }
}
