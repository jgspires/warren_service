import { ApplicationError } from '../../../../../src/domain/errors'
import { IGetPeriodTransferAmount } from '../../../../../src/domain/useCases/balance'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { GetUserPeriodTransferAmountControllerOperation } from '../../../../../src/presentation/http/operations/balance'
import { right, ErrorManager, left } from '../../../../../src/shared'
import { UserBuilder, HttpRequestBuilder } from '../../../../builders'

interface ISutType {
  sut: GetUserPeriodTransferAmountControllerOperation
  getUserPeriodTransferAmountStub: IGetPeriodTransferAmount
}

const makeGetUserPeriodTransferAmountStub = (): IGetPeriodTransferAmount => {
  class GetUserPeriodTransferAmountStub implements IGetPeriodTransferAmount {
    async execute(
      _props: IGetPeriodTransferAmount.Props
    ): Promise<IGetPeriodTransferAmount.Response> {
      return right({ deposits: 250.5, withdraws: 100.5 })
    }
  }

  return new GetUserPeriodTransferAmountStub()
}

const makeSut = (): ISutType => {
  const getUserPeriodTransferAmountStub = makeGetUserPeriodTransferAmountStub()
  const sut = new GetUserPeriodTransferAmountControllerOperation(getUserPeriodTransferAmountStub)

  return { sut, getUserPeriodTransferAmountStub }
}

describe('Get User Period Transfer Amount Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should get user period transfer amounts and return 200', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id, startingMonth: '2022-01', endingMonth: '2022-06' })
        .build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(200)
      expect(httpResponse.body).toEqual({ deposits: 250.5, withdraws: 100.5 })
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, getUserPeriodTransferAmountStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const returnedError = ErrorManager.ServerError()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id, startingMonth: '2022-01', endingMonth: '2022-06' })
        .build()

      jest.spyOn(getUserPeriodTransferAmountStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
