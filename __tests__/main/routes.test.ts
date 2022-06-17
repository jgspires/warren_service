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
      .send({
        _id: 'admin',
        password: 'Password!'
      })
      .expect(201)
  })

  test('Login Route', async () => {
    await request(app)
      .get('/login')
      .send({
        _id: 'admin',
        password: 'Password!'
      })
      .expect(404)
  })

  test('Recover User Route', async () => {
    await request(app).get('/userId').set('Authorization', `${accessToken}`).send().expect(404)
  })

  test('Change User Password Route', async () => {
    await request(app)
      .put('/userId')
      .set('Authorization', `${accessToken}`)
      .send({
        newPassword: 'newPassword!'
      })
      .expect(404)
  })

  test('Delete User Route', async () => {
    await request(app)
      .delete('/userId')
      .set('Authorization', `${accessToken}`)
      .send({
        newPassword: 'newPassword!'
      })
      .expect(404)
  })
})
