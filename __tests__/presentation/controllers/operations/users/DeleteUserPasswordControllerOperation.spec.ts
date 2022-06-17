import { ApplicationError } from '../../../../../src/domain/errors'
import { IDeleteUser } from '../../../../../src/domain/useCases/users'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { DeleteUserControllerOperation } from '../../../../../src/presentation/http/operations/users'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: DeleteUserControllerOperation
  deleteUserStub: IDeleteUser
}

const makeDeleteUserStub = (): IDeleteUser => {
  class DeleteUserStub implements IDeleteUser {
    async execute(_props: IDeleteUser.Props): Promise<IDeleteUser.Response> {
      return right(null)
    }
  }

  return new DeleteUserStub()
}

const makeSut = (): ISutType => {
  const deleteUserStub = makeDeleteUserStub()
  const sut = new DeleteUserControllerOperation(deleteUserStub)

  return { sut, deleteUserStub }
}

describe('Delete User Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should delete user and return 204', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withParams({ _id: user._id }).build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(204)
      expect(httpResponse.body).toBeNull()
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, deleteUserStub } = makeSut()
      const returnedError = ErrorManager.ServerError()
      const user = UserBuilder.aUser().build()

      const httpRequest = HttpRequestBuilder.anHttpRequest().withParams({ _id: user._id }).build()

      jest.spyOn(deleteUserStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
