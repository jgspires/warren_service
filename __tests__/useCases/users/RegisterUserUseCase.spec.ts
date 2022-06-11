import {
  IUserRepositoryGetUserData,
  IUserRepositoryRegisterUser
} from '../../../src/data/dependencies/repositories/UserRepository'
import { RegisterUserUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { IRegisterUser } from '../../../src/domain/useCases/users'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import { UserBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData & IUserRepositoryRegisterUser

interface ISutType {
  sut: IRegisterUser
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async getUserData(_user: UserFromRequestProps): ExternalResponse<UserProps | null> {
      return right(null)
    }

    async registerUser(_user: UserProps): ExternalResponse {
      return right(null)
    }
  }

  return new UserRepositoryStub()
}

const makeSut = (): ISutType => {
  const userRepositoryStub = makeUserRepositoryStub()
  const sut = new RegisterUserUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Register user use case', () => {
  describe('Success Cases', () => {
    it('Should register user if one does not already exist', async () => {
      const { sut } = makeSut()
      const props = UserBuilder.aUser().build()

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as UserFromRequestProps

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toEqual({ _id: props._id })
    })
  })
  describe('Error Cases', () => {
    it('Should deny creation if user already exists', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const props = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(props)
      })

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('DuplicateError')
    })

    it('Should deny creation if user id is invalid', async () => {
      const { sut } = makeSut()
      const props = UserBuilder.aUser().withBadUserId().build()

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('InvalidError')
    })

    it('Should deny creation if user password is invalid', async () => {
      const { sut } = makeSut()
      const props = UserBuilder.aUser().withBadUserPwd().build()

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(response.baseError).toEqual('InvalidError')
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
