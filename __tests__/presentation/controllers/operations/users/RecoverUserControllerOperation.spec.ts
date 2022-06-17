import { ApplicationError } from '../../../../../src/domain/errors'
import { IRecoverUser } from '../../../../../src/domain/useCases/users'
import { UserNoPasswordProps } from '../../../../../src/domain/useCases/users/DTOs'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { RecoverUserControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: RecoverUserControllerOperation
  recoverUserStub: IRecoverUser
}

const makeRecoverUserStub = (): IRecoverUser => {
  class RecoverUserStub implements IRecoverUser {
    async execute(_props: IRecoverUser.Props): Promise<IRecoverUser.Response> {
      const user = UserBuilder.aUser().build()
      const userResponse: UserNoPasswordProps = {
        _id: user._id,
        categories: user.categories,
        wallets: user.wallets
      }
      return right(userResponse)
    }
  }

  return new RecoverUserStub()
}

const makeSut = (): ISutType => {
  const recoverUserStub = makeRecoverUserStub()
  const sut = new RecoverUserControllerOperation(recoverUserStub)

  return { sut, recoverUserStub }
}

describe('Recover User Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should recover a user and return 200', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const userResponse: UserNoPasswordProps = {
        _id: user._id,
        categories: user.categories,
        wallets: user.wallets
      }

      const httpRequest = HttpRequestBuilder.anHttpRequest().withParams({ _id: user._id }).build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(200)
      expect(httpResponse.body).toEqual(userResponse)
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, recoverUserStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const returnedError = ErrorManager.ServerError()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withParams({ _id: user._id }).build()

      jest.spyOn(recoverUserStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
