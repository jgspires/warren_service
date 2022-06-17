import { UserTransactionProps } from '../../entities'

export type UserTransactionCreateResponse = {
  _id: string
  walletName: string
  categoryName: string
  transaction: UserTransactionProps
}
