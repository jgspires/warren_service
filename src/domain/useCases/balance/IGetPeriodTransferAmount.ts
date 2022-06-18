import { Either } from '../../../shared'
import { ApplicationError } from '../../errors'
import { IUseCase } from '../contracts'
import { PeriodTransferAmountProps } from './DTOs'

export interface IGetPeriodTransferAmount
  extends IUseCase<IGetPeriodTransferAmount.Props, IGetPeriodTransferAmount.Response> {}

export namespace IGetPeriodTransferAmount {
  export type Props = {
    _id: string
    startingMonth: string // 2021-03 (ISO - YYYY-MM or YYYY-MM-DD)
    endingMonth: string // 2022-03
  }

  export type Success = PeriodTransferAmountProps
  export type Errors = ApplicationError

  export type Response = Either<Errors, Success>
}
