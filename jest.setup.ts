import { MongoMemoryServer } from 'mongodb-memory-server'
import { Collection, Db, MongoClient } from 'mongodb'

let mongo: MongoMemoryServer
let mongoClient: MongoClient
let db: Db

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()

  process.env.MONGO_ADDRESS = mongo.getUri().split('mongodb://').pop()
  process.env.MONGO_DB = mongo.instanceInfo?.dbName

  mongoClient = await MongoClient.connect(mongo.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  db = mongoClient.db(process.env.MONGO_DB)
})

beforeEach(async () => {
  const collections: Array<Collection> = await db.collections()
  await Promise.all(collections.map((collection: Collection) => collection.deleteMany({})))
})

afterAll(async () => {
  await mongoClient.close()
  await mongo.stop()
})
