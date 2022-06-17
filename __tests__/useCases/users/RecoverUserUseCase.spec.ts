import { IUserRepositoryGetUserData } from '../../../src/data/dependencies/repositories/UserRepository'
import { RecoverUserUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { IRecoverUser } from '../../../src/domain/useCases/users'
import { UserNoPasswordProps } from '../../../src/domain/useCases/users/DTOs'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import { UserBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData

interface ISutType {
  sut: IRecoverUser
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async getUserData(_user: UserFromRequestProps): ExternalResponse<UserProps | null> {
      return right(UserBuilder.aUser().build())
    }
  }

  return new UserRepositoryStub()
}

const makeSut = (): ISutType => {
  const userRepositoryStub = makeUserRepositoryStub()
  const sut = new RecoverUserUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Recover user use case', () => {
  describe('Success Cases', () => {
    it('Should recover user data', async () => {
      const { sut } = makeSut()
      const props = UserBuilder.aUser().build()

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as UserNoPasswordProps

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toEqual({
        _id: props._id,
        categories: props.categories,
        wallets: props.wallets
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail to recover user if user does not exist', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const props = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(null)
      })

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('NotFoundError')
    })

    it('Should return a connection error if connection to repo fails', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const props = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return left(ErrorManager.ConnectionError('User Repo'))
      })

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('ConnectionError')
    })
  })
})
