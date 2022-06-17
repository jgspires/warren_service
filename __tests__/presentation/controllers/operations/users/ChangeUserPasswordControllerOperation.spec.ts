import { ApplicationError } from '../../../../../src/domain/errors'
import { IChangeUserPassword } from '../../../../../src/domain/useCases/users'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { ChangeUserPasswordControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: ChangeUserPasswordControllerOperation
  changeUserPasswordStub: IChangeUserPassword
}

const makeChangeUserPasswordStub = (): IChangeUserPassword => {
  class ChangeUserPasswordStub implements IChangeUserPassword {
    async execute(_props: IChangeUserPassword.Props): Promise<IChangeUserPassword.Response> {
      const user = UserBuilder.aUser().build()
      return right({ _id: user._id })
    }
  }

  return new ChangeUserPasswordStub()
}

const makeSut = (): ISutType => {
  const changeUserPasswordStub = makeChangeUserPasswordStub()
  const sut = new ChangeUserPasswordControllerOperation(changeUserPasswordStub)

  return { sut, changeUserPasswordStub }
}

describe('Change User Password Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should change user password, return 200 and user id response', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        password: 'newPassword!'
      }

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id })
        .withBody(body)
        .build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(200)
      expect(httpResponse.body).toEqual({
        _id: user._id
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, changeUserPasswordStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        password: 'newPassword!'
      }
      const returnedError = ErrorManager.InvalidError('User', 'password')

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id })
        .withBody(body)
        .build()

      jest.spyOn(changeUserPasswordStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
