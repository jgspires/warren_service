import {
  IUserRepositoryChangePassword,
  IUserRepositoryDeleteUser,
  IUserRepositoryGetUserData,
  IUserRepositoryRegisterUser
} from '../../data/dependencies/repositories/UserRepository'

export interface IUserRepository
  extends IUserRepositoryRegisterUser,
    IUserRepositoryChangePassword,
    IUserRepositoryDeleteUser,
    IUserRepositoryGetUserData {}
