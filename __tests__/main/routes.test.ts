import request from 'supertest'
import { app } from '../../src/main/config/app'
import { tokenManager } from '../../src/main/factories/external/Utils'
import { UserBuilder } from '../builders'

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

  test('Get User Period Balance Route', async () => {
    await request(app)
      .get('/userId/balance')
      .set('Authorization', `${accessToken}`)
      .send()
      .expect(404)
  })

  test('Update User Route', async () => {
    const user = UserBuilder.aUser().build()
    const userDataToSend = {
      wallets: user.wallets,
      categories: user.categories
    }
    await request(app)
      .put('/userId')
      .set('Authorization', `${accessToken}`)
      .send(userDataToSend)
      .expect(404)
  })

  test('Change User Password Route', async () => {
    await request(app)
      .put('/userId/password')
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
