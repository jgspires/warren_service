import { ApplicationError } from '../../../../../src/domain/errors'
import { ILoginUser } from '../../../../../src/domain/useCases/users'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { LoginUserControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: LoginUserControllerOperation
  loginUserStub: ILoginUser
}

const makeLoginUserStub = (): ILoginUser => {
  class LoginUserStub implements ILoginUser {
    async execute(_props: ILoginUser.Props): Promise<ILoginUser.Response> {
      return right('token.is.here')
    }
  }

  return new LoginUserStub()
}

const makeSut = (): ISutType => {
  const loginUserStub = makeLoginUserStub()
  const sut = new LoginUserControllerOperation(loginUserStub)

  return { sut, loginUserStub }
}

describe('Register User Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should login a user, return 200 and auth token response', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withBody(user).build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(200)
      expect(httpResponse.body).toEqual({
        token: 'token.is.here'
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, loginUserStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const returnedError = ErrorManager.ServerError()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withBody(user).build()

      jest.spyOn(loginUserStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
