import {
  IUserRepositoryChangePassword,
  IUserRepositoryGetUserData
} from '../../../src/data/dependencies/repositories/UserRepository'
import { ChangeUserPasswordUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { IChangeUserPassword } from '../../../src/domain/useCases/users'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import { UserBuilder } from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData & IUserRepositoryChangePassword

interface ISutType {
  sut: IChangeUserPassword
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async changePassword(
      _user: UserFromRequestProps,
      _newPassword: string
    ): ExternalResponse<null, ApplicationError> {
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
  const sut = new ChangeUserPasswordUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Change user password use case', () => {
  describe('Success Cases', () => {
    it('Should change user password if user exists and password is valid', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const props = { _id: user._id, newPassword: 'NewValidPwd!' }

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as UserFromRequestProps

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toEqual({ _id: props._id })
    })
  })
  describe('Error Cases', () => {
    it('Should fail to change password if user does not exist', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const props = { _id: user._id, newPassword: 'NewValidPwd!' }

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(null)
      })

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('NotFoundError')
    })

    it('Should fail to change password if new password is invalid', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const props = { _id: user._id, newPassword: 'badpwd' }

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('InvalidError')
    })

    it('Should fail to change password if new password is the same as the old one', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      const props = { _id: user._id, newPassword: user.password }

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('InvalidError')
    })

    it('Should return a connection error if connection to repo fails', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()
      const props = { _id: user._id, newPassword: 'NewValidPwd!' }

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
