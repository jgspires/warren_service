import { UserProps } from '../../../entities'

export type UserNoPasswordProps = Omit<UserProps, 'password'>
