import { UserProps } from '../../../src/domain/entities/User'
import { MongoUserRepository } from '../../../src/solutions/mongodb'
import { UserBuilder } from '../../builders'

let userRepository: MongoUserRepository

beforeAll(async () => {
  userRepository = new MongoUserRepository(process.env.MONGO_ADDRESS!)
})

afterAll(async () => {
  await userRepository.closeConnection()
})

describe('Mongo User Repository', () => {
  describe('Register User', () => {
    it('Should register a user', async () => {
      const user = UserBuilder.aUser().build()
      const nullOrError = await userRepository.registerUser(user)

      const createdUserOrError = await userRepository.getUserData({ _id: user._id })
      const createdUser = createdUserOrError.value as UserProps

      expect(nullOrError.isRight()).toBeTruthy()
      expect(nullOrError.value).toBeNull()
      expect(createdUserOrError.isRight()).toBeTruthy()
      expect(createdUser).toEqual(user)
    })
  })
  describe('Recover User', () => {
    it('Should recover a user', async () => {
      const user = UserBuilder.aUser().build()
      await userRepository.registerUser(user)

      const recoveredUserOrError = await userRepository.getUserData({ _id: user._id })
      const recoveredUser = recoveredUserOrError.value as UserProps

      expect(recoveredUserOrError.isRight()).toBeTruthy()
      expect(recoveredUser).toEqual(user)
    })

    it('Should return null if Id is not found', async () => {
      const user = UserBuilder.aUser().build()
      user._id = 'unregisteredId'

      const recoveredUserOrError = await userRepository.getUserData({ _id: user._id })

      expect(recoveredUserOrError.isRight()).toBeTruthy()
      expect(recoveredUserOrError.value).toBeNull()
    })
  })
  describe('Change Password', () => {
    it('Should change a user`s password', async () => {
      const user = UserBuilder.aUser().build()
      const newPassword = 'newPass!'

      const nullOrError = await userRepository.changePassword({ _id: user._id }, newPassword)

      const updatedUserOrError = await userRepository.getUserData({ _id: user._id })

      expect(nullOrError.isRight()).toBeTruthy()
      expect(nullOrError.value).toBeNull()
      expect(updatedUserOrError.isRight()).toBeTruthy()
      expect(updatedUserOrError.value).toEqual({ ...user, password: newPassword })
    })
  })

  describe('Delete User', () => {
    it('Should delete a user', async () => {
      const user = UserBuilder.aUser().build()

      const NullOrError = await userRepository.deleteUser({ _id: user._id })

      const deletedUserOrError = await userRepository.getUserData({ _id: user._id })

      expect(NullOrError.isRight()).toBeTruthy()
      expect(NullOrError.value).toBeNull()
      expect(deletedUserOrError.isRight()).toBeTruthy()
      expect(deletedUserOrError.value).toBeNull()
    })
  })
})
