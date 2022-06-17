import {
  IUserRepositoryUpdateUser,
  IUserRepositoryDeleteUser,
  IUserRepositoryGetUserData,
  IUserRepositoryRegisterUser
} from '../../data/dependencies/repositories/UserRepository'

export interface IUserRepository
  extends IUserRepositoryRegisterUser,
    IUserRepositoryUpdateUser,
    IUserRepositoryDeleteUser,
    IUserRepositoryGetUserData {}
