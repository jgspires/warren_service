import { MongoUserRepository } from '../../../solutions/mongodb'
import { IUserRepository } from '../../../solutions/ports'

export const userRepository: IUserRepository = new MongoUserRepository()
