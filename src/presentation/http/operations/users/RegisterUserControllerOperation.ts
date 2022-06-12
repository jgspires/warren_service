import { UserFromRequestProps } from '../../../../domain/entities'
import { IRegisterUser } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { UserViewModel } from '../../viewModels'

export class RegisterUserControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly registerUser: IRegisterUser) {}

  async operate(
    request: HttpRequest<UserViewModel, any, any>
  ): ControllerOperationResponse<UserFromRequestProps> {
    const user = request.body
    const responseOrError = await this.registerUser.execute(user)

    if (responseOrError.isRight()) return right(success(responseOrError.value, 201))
    else return left(responseOrError.value)
  }
}
