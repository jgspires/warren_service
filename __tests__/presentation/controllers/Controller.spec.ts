import { ApplicationError } from '../../../src/domain/errors'
import {
  IControllerOperation,
  HttpRequest,
  HttpResponse
} from '../../../src/presentation/contracts'
import { Controller } from '../../../src/presentation/http'
import { success } from '../../../src/presentation/http/helpers'
import { Either, right, left, ErrorManager } from '../../../src/shared'
import { HttpRequestBuilder } from '../../builders/HttpRequestBuilder'

interface ISutType {
  sut: Controller
  operationStub: IControllerOperation
}

const makeOperationStub = (): IControllerOperation => {
  class OperationStub implements IControllerOperation {
    async operate(_request: HttpRequest): Promise<Either<ApplicationError, HttpResponse<string>>> {
      return right(success('Success'))
    }
  }

  return new OperationStub()
}

const makeSut = (): ISutType => {
  const operationStub = makeOperationStub()
  const sut = new Controller(operationStub)

  return { sut, operationStub }
}

describe('Controller', () => {
  describe('Success Cases', () => {
    it('Should return the operation response if it were success', async () => {
      const { sut } = makeSut()

      const httpResponse = await sut.handle(HttpRequestBuilder.anHttpRequest().build())

      expect(httpResponse).toEqual(success('Success'))
    })
  })

  describe('Error Cases', () => {
    it('Should return a formatted error if the operation has failed', async () => {
      const { sut, operationStub } = makeSut()

      jest.spyOn(operationStub, 'operate').mockImplementation(async () => {
        return left(ErrorManager.MissingTokenError())
      })

      const httpResponse = await sut.handle(HttpRequestBuilder.anHttpRequest().build())

      expect(httpResponse).toEqual(ErrorManager.ErrorHttpResponse(ErrorManager.MissingTokenError()))
    })

    it('Should return a connection error if the use case throws', async () => {
      const { sut, operationStub } = makeSut()

      jest.spyOn(operationStub, 'operate').mockImplementation(async () => {
        throw new Error()
      })

      const httpResponse = await sut.handle(HttpRequestBuilder.anHttpRequest().build())

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.baseError).toBe(`ServerError`)
    })

    it('Should return a connection error if the use case throws with custom reason', async () => {
      const { sut, operationStub } = makeSut()
      const errorReason = 'Reason'

      jest.spyOn(operationStub, 'operate').mockImplementation(async () => {
        throw new Error(errorReason)
      })

      const httpResponse = await sut.handle(HttpRequestBuilder.anHttpRequest().build())
      console.log(httpResponse.body)

      expect(httpResponse.statusCode).toBe(500)
      expect(httpResponse.body.message).toBe(`${errorReason}`)
    })
  })
})
