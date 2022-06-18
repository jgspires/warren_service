import { UserProps } from '../../../entities'

export type UserDataProps = Omit<UserProps, 'password' | '_id'>
