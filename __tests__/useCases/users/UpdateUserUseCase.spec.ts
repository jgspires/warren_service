import {
  IUserRepositoryGetUserData,
  IUserRepositoryUpdateUser
} from '../../../src/data/dependencies/repositories/UserRepository'
import { UpdateUserUseCase } from '../../../src/data/useCases/users'
import { UserFromRequestProps } from '../../../src/domain/entities'
import { UserProps } from '../../../src/domain/entities/User'
import { ApplicationError } from '../../../src/domain/errors'
import { IUpdateUser } from '../../../src/domain/useCases/users'
import { UserNoPasswordProps } from '../../../src/domain/useCases/users/DTOs'
import { ErrorManager, ExternalResponse, left, right } from '../../../src/shared'
import {
  UserBuilder,
  UserCategoryBuilder,
  UserTransactionBuilder,
  UserWalletBuilder
} from '../../builders'

type RepoUseCases = IUserRepositoryGetUserData & IUserRepositoryUpdateUser

interface ISutType {
  sut: IUpdateUser
  userRepositoryStub: RepoUseCases
}

const makeUserRepositoryStub = (): RepoUseCases => {
  class UserRepositoryStub implements RepoUseCases {
    async updateUser(_user: UserProps): ExternalResponse<null, ApplicationError> {
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
  const sut = new UpdateUserUseCase(userRepositoryStub)

  return { sut, userRepositoryStub }
}

describe('Update user use case', () => {
  describe('Success Cases', () => {
    it('Should update user if user exists', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().withName('New Category').build())
      user.wallets.push(UserWalletBuilder.aUserWallet().withName('New Wallet').build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as UserNoPasswordProps

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toEqual({
        categories: user.categories,
        wallets: user.wallets,
        _id: user._id
      })
    })

    it('Should update user if there are multiple transactions with same name', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().withName('New Category').build())
      user.wallets.push(UserWalletBuilder.aUserWallet().withName('New Wallet').build())
      user.categories[0].transactions.push(UserTransactionBuilder.aUserTransaction().build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

      const responseOrError = await sut.execute(props)
      const response = responseOrError.value as UserNoPasswordProps

      expect(responseOrError.isRight()).toBeTruthy()
      expect(response).toEqual({
        categories: user.categories,
        wallets: user.wallets,
        _id: user._id
      })
    })
  })
  describe('Error Cases', () => {
    it('Should fail to update user if user does not exist', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().build())
      user.wallets.push(UserWalletBuilder.aUserWallet().build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

      jest.spyOn(userRepositoryStub, 'getUserData').mockImplementation(async () => {
        return right(null)
      })

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('NotFoundError')
    })

    it('Should fail to update user if there are duplicate wallets', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().withName('New Category').build())
      user.wallets.push(UserWalletBuilder.aUserWallet().build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('DuplicateError')
    })

    it('Should fail to update user if there are duplicate categories', async () => {
      const { sut } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().build())
      user.wallets.push(UserWalletBuilder.aUserWallet().withName('New Wallet').build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

      const responseOrError = await sut.execute(props)
      const error = responseOrError.value as ApplicationError

      expect(responseOrError.isLeft()).toBeTruthy()
      expect(error.baseError).toEqual('DuplicateError')
    })

    it('Should return a connection error if connection to repo fails', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const user = UserBuilder.aUser().build()
      user.categories.push(UserCategoryBuilder.aUserCategory().build())
      user.wallets.push(UserWalletBuilder.aUserWallet().build())
      const props = { _id: user._id, user: { categories: user.categories, wallets: user.wallets } }

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
