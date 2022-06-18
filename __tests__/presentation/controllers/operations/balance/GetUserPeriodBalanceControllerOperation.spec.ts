import { ApplicationError } from '../../../../../src/domain/errors'
import { IGetPeriodBalance } from '../../../../../src/domain/useCases/balance'
import { HttpResponse } from '../../../../../src/presentation/contracts'
import { GetUserPeriodBalanceControllerOperation } from '../../../../../src/presentation/http/operations/balance'
import { ErrorManager, left, right } from '../../../../../src/shared'
import { HttpRequestBuilder, UserBuilder } from '../../../../builders'

interface ISutType {
  sut: GetUserPeriodBalanceControllerOperation
  getUserPeriodBalanceStub: IGetPeriodBalance
}

const makeGetUserPeriodBalanceStub = (): IGetPeriodBalance => {
  class GetUserPeriodBalanceStub implements IGetPeriodBalance {
    async execute(_props: IGetPeriodBalance.Props): Promise<IGetPeriodBalance.Response> {
      return right([{ date: '2021-02', balance: 100.5 }])
    }
  }

  return new GetUserPeriodBalanceStub()
}

const makeSut = (): ISutType => {
  const getUserPeriodBalanceStub = makeGetUserPeriodBalanceStub()
  const sut = new GetUserPeriodBalanceControllerOperation(getUserPeriodBalanceStub)

  return { sut, getUserPeriodBalanceStub }
}

describe('Get User Period Balance Controller Operation', () => {
  describe('Success Cases', () => {
    it('Should get user period balances and return 200', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        startingMonth: '2022-01',
        endingMonth: '2022-06'
      }

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id })
        .withBody(body)
        .build()

      const httpResponseOrError = await sut.operate(httpRequest)

      const httpResponse = httpResponseOrError.value as HttpResponse
      expect(httpResponseOrError.isRight()).toBeTruthy()
      expect(httpResponse.statusCode).toEqual(200)
      expect(httpResponse.body).toEqual([{ date: '2021-02', balance: 100.5 }])
    })
  })
  describe('Error Cases', () => {
    it('Should fail if use case returns error', async () => {
      const { sut, getUserPeriodBalanceStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const body = {
        startingMonth: '2022-01',
        endingMonth: '2022-06'
      }
      const returnedError = ErrorManager.ServerError()

      const httpRequest = HttpRequestBuilder.anHttpRequest()
        .withParams({ _id: user._id })
        .withBody(body)
        .build()

      jest.spyOn(getUserPeriodBalanceStub, 'execute').mockImplementation(async () => {
        return left(returnedError)
      })

      const httpResponseOrError = await sut.operate(httpRequest)
      const error = httpResponseOrError.value as ApplicationError

      expect(httpResponseOrError.isLeft()).toBeTruthy()
      expect(error).toEqual(returnedError)
    })
  })
})
