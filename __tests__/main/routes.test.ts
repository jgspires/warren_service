import request from 'supertest'
import { app } from '../../src/main/config/app'
import { tokenManager } from '../../src/main/factories/external/Utils'

jest.mock('../../src/solutions/mongodb/MongoUserRepository')

let accessToken: string

describe('Service Routes', () => {
  beforeAll(async () => {
    accessToken = await tokenManager.sign({
      _id: 'admin'
    })
  })

  test('Register Route', async () => {
    await request(app)
      .get('/register')
      .set('Authorization', `${accessToken}`)
      .send({
        _id: 'admin',
        password: 'Password!'
      })
      .expect(201)
  })

  test('Login Route', async () => {
    await request(app)
      .get('/login')
      .set('Authorization', `${accessToken}`)
      .send({
        _id: 'admin',
        password: 'Password!'
      })
      .expect(404)
  })
})
