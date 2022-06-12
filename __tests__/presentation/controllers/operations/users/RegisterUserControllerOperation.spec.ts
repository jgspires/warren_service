import { ApplicationError } from '../../../../../src/domain/errors'
import { IRegisterUser } from '../../../../../src/domain/useCases/users'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { RegisterUserControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { right, left, ErrorManager } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: RegisterUserControllerOperation
  registerUserStub: IRegisterUser
}

const makeRegisterUserDayStub = (): IRegisterUser => {
  class RegisterUserStub implements IRegisterUser {
    async execute(_props: IRegisterUser.Props): Promise<IRegisterUser.Response> {
      const user = UserBuilder.aUser().build()
      return right({ _id: user._id })
    }
  }

  return new RegisterUserStub()
}

const makeSut = (): ISutType => {
  const registerUserStub = makeRegisterUserDayStub()
  const sut = new RegisterUserControllerOperation(registerUserStub)

  return { sut, registerUserStub }
}

describe('Register User Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should register a user, return 201 and user id response', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withBody(user).build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(201)
      expect(httpResponse.body).toEqual({
        _id: user._id
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, registerUserStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const returnedError = ErrorManager.InvalidError('User', 'password')

      const httpRequest = HttpRequestBuilder.anHttpRequest().withBody(user).build()

      jest.spyOn(registerUserStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
