import { IUserRepositoryGetUserData } from '../../../src/data/dependencies/repositories/UserRepository'
import { GetPeriodBalanceUseCase } from '../../../src/data/useCases/balance'
import { UserFromRequestProps, UserProps } from '../../../src/domain/entities'
import { ApplicationError } from '../../../src/domain/errors'
import { IGetPeriodBalance } from '../../../src/domain/useCases/balance'
import { PeriodBalanceProps } from '../../../src/domain/useCases/balance/DTOs'
import { ExternalResponse, right, left, ErrorManager } from '../../../src/shared'
import { UserBuilder, UserCategoryBuilder, UserTransactionBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData

interface ISutType {
  sut: IGetPeriodBalance
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async getUserData(_user: UserFromRequestProps): ExternalResponse<UserProps | null> {
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().withName('2nd Category').build())
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(100.5).withDate('2022-04-01').build()
      )
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(50).withDate('2022-04-15').build()
      )
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(75).withDate('2022-06-02').build()
      )
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(20.25).withDate('2022-06-01').build()
      )
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(33).withDate('2021-12-01').build()
      )
      user.categories[1].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(10.3).withDate('2022-02-15').build()
      )
      user.categories[1].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(5).withDate('2022-06-15').build()
      )
      user.categories[0].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(10).withDate('2022-12-31').build()
      )
      user.categories[1].transactions.push(
        UserTransactionBuilder.aUserTransaction().withAmount(10).withDate('2022-12-31').build()
      )
      return right(user)
    }
  }

  return new UserRepositoryStub()
}

const makeSut = (): ISutType => {
  const userRepositoryStub = makeUserRepositoryStub()
  const sut = new GetPeriodBalanceUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Get Period Balance use case', () => {
  describe('Success Cases', () => {
    it('Should get period balance', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()

      const responseOrError = await sut.execute({
        _id: user._id,
        startingMonth: '2021-12',
        endingMonth: '2022-12'
      })
      const response = responseOrError.value as PeriodBalanceProps[]

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response.length).toBe(13)
      expect(response).toEqual([
        { date: '2021-12', balance: 33 },
        { date: '2022-01', balance: 0 },
        { date: '2022-02', balance: 10.3 },
        { date: '2022-03', balance: 0 },
        { date: '2022-04', balance: 150.5 },
        { date: '2022-05', balance: 1201 },
        { date: '2022-06', balance: 100.25 },
        { date: '2022-07', balance: 0 },
        { date: '2022-08', balance: 0 },
        { date: '2022-09', balance: 0 },
        { date: '2022-10', balance: 0 },
        { date: '2022-11', balance: 0 },
        { date: '2022-12', balance: 20 }
      ])
    })
  })
  describe('Error Cases', () => {
    it('Should fail to get period balance if user does not exist', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(null)
      })

      const responseOrError = await sut.execute({
        _id: user._id,
        startingMonth: '2021-12',
        endingMonth: '2022-12'
      })
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('NotFoundError')
    })

    it('Should return a connection error if connection to repo fails', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return left(ErrorManager.ConnectionError('User Repo'))
      })

      const responseOrError = await sut.execute({
        _id: user._id,
        startingMonth: '2021-12',
        endingMonth: '2022-12'
      })
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('ConnectionError')
    })
  })
})
