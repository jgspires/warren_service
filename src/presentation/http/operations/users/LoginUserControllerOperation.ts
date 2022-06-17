import { ILoginUser } from '../../../../domain/useCases/users'
import { left, right } from '../../../../shared'
import { ControllerOperationResponse, HttpRequest, IControllerOperation } from '../../../contracts'
import { success } from '../../helpers'
import { AuthTokenViewModel, UserViewModel } from '../../viewModels'

export class LoginUserControllerOperation implements IControllerOperation<HttpRequest> {
  constructor(private readonly loginUser: ILoginUser) {}

  async operate(
    request: HttpRequest<UserViewModel, any, any>
  ): ControllerOperationResponse<AuthTokenViewModel> {
    const user = request.body
    const tokenOrError = await this.loginUser.execute(user)

    if (tokenOrError.isRight())
      return right(
        success({
          token: tokenOrError.value
        })
      )
    else return left(tokenOrError.value)
  }
}
