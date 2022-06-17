import { UserTransactionProps } from '../../entities'

export type UserTransactionInteractProps = Omit<UserTransactionProps, '_id'>
