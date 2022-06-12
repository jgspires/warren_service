import {
  IUserRepositoryDeleteUser,
  IUserRepositoryGetUserData
} from '../../../src/data/dependencies/repositories/UserRepository'
import { DeleteUserUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { IDeleteUser } from '../../../src/domain/useCases/users'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import { UserBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData & IUserRepositoryDeleteUser

interface ISutType {
  sut: IDeleteUser
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async deleteUser(_user: UserFromRequestProps): ExternalResponse<null, ApplicationError> {
      return right(null)
    }

    async getUserData(_user: UserFromRequestProps): ExternalResponse<UserProps | null> {
      return right(UserBuilder.aUser().build())
    }
  }

  return new UserRepositoryStub()
}

const makeSut = (): ISutType => {
  const userRepositoryStub = makeUserRepositoryStub()
  const sut = new DeleteUserUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Delete user use case', () => {
  describe('Success Cases', () => {
    it('Should delete user if it exists', async () => {
      const { sut } = makeSut()
      const props = { _id: UserBuilder.aUser().build()._id }

      const nullOrError = await sut.execute(props)

      expect(nullOrError.isRight()).toBeTruthy()
      expect(nullOrError.value).toBeNull()
    })
  })
  describe('Error Cases', () => {
    it('Should fail to delete if user does not exist', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const props = UserBuilder.aUser().build()

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(null)
      })

      const nullOrError = await sut.execute({ _id: props._id })
      const error = nullOrError.value as ApplicationError

      expect(nullOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('NotFoundError')
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
