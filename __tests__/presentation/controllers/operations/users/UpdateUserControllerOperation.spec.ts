import { ApplicationError } from '../../../../../src/domain/errors'
import { IUpdateUser } from '../../../../../src/domain/useCases/users'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { UpdateUserControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: UpdateUserControllerOperation
  updateUserStub: IUpdateUser
}

const makeUpdateUserStub = (): IUpdateUser => {
  class UpdateUserStub implements IUpdateUser {
    async execute(_props: IUpdateUser.Props): Promise<IUpdateUser.Response> {
      const user = UserBuilder.aUser().build()
      return right({ _id: user._id, wallets: user.wallets, categories: user.categories })
    }
  }

  return new UpdateUserStub()
}

const makeSut = (): ISutType => {
  const updateUserStub = makeUpdateUserStub()
  const sut = new UpdateUserControllerOperation(updateUserStub)

  return { sut, updateUserStub }
}

describe('Update User Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should update user, return 200 and user no pwd response', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        wallets: user.wallets,
        categories: user.categories
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
        _id: user._id,
        ...body
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, updateUserStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        wallets: user.wallets,
        categories: user.categories
      }
      const returnedError = ErrorManager.ServerError()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id })
        .withBody(body)
        .build()

      jest.spyOn(updateUserStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
