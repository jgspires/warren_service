import { IUserRepositoryGetUserData } from '../../../src/data/dependencies/repositories/UserRepository'
import { ITokenManagerSign } from '../../../src/data/dependencies/TokenManager'
import { LoginUserUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { ILoginUser } from '../../../src/domain/useCases/users'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import { UserBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData

interface ISutType {
  sut: ILoginUser
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

const makeTokenManagerStub = (): ITokenManagerSign => {
  class TokenManagerStub implements ITokenManagerSign {
    async sign(_info: UserFromRequestProps, _expiresIn?: string | undefined): Promise<string> {
      return 'token.encoded.here'
    }
  }

  return new TokenManagerStub()
}

const makeSut = (): ISutType => {
  const userRepositoryStub = makeUserRepositoryStub()
  const tokenManagerStub = makeTokenManagerStub()
  const sut = new LoginUserUseCase(userRepositoryStub, tokenManagerStub)

  return { sut, userRepositoryStub }
}

describe('Login user use case', () => {
  describe('Success Cases', () => {
    it('Should log in user and return auth token', async () => {
      const { sut } = makeSut()
      const props = UserBuilder.aUser().build()

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as string

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toBe('token.encoded.here')
    })
  })
  describe('Error Cases', () => {
    it('Should fail to log in if user does not exist', async () => {
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

    it('Should fail to log in if password does not match', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const props = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right({ _id: props._id, password: 'DifferentPassword@!' })
      })

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('PermissionError')
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
