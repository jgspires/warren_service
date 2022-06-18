import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { PeriodBalanceProps } from './DTOs'

export interface IGetPeriodBalance
  extends IUseCase<IGetPeriodBalance.Props, IGetPeriodBalance.Response> {}

export namespace IGetPeriodBalance {
  export type Props = {
    _id: string
    startingMonth: string // 2021-03 (ISO - YYYY-MM or YYYY-MM-DD)
    endingMonth: string // 2022-03
  }

  export type Success = PeriodBalanceProps[]
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
