// eslint-disable-next-line no-unused-vars
import {
  BulkWriteOperation,
  CollectionBulkWriteOptions,
  FilterQuery,
  MongoClient,
  OptionalId,
  UpdateOneOptions,
  UpdateQuery
} from 'mongodb'

export default class Mongo {
  protected _connection: MongoClient
  protected dbAddress: string
  protected logger: any
  constructor(dbAddress: string, logger?: any) {
    this.dbAddress = dbAddress
    if (logger) {
      this.logger = logger
    }
  }

  private async initialize() {
    try {
      this._connection = await MongoClient.connect(`mongodb://${this.dbAddress}`, {
        useUnifiedTopology: true
      })
      if (this.logger) {
        this.logger.info(`[mongo] ${this.dbAddress} connected`)
      } else {
        console.log('[mongo] connected', this.dbAddress)
      }
    } catch (error) {
      if (this.logger) {
        this.logger.info(`[mongo] error ${this.dbAddress}\n${error}`)
      } else {
        console.log('[mongo] error', this.dbAddress, error)
      }
    }
  }

  async closeConnection() {
    return await this._connection.close()
  }

  async save<Data = any>(dbName: string, collectionName: string, docs: OptionalId<Data>) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).collection<Data>(collectionName).insertOne(docs)
  }

  async update<Data = any>(
    dbName: string,
    collectionName: string,
    filter: FilterQuery<Data>,
    update: UpdateQuery<Data> | Partial<Data>,
    options?: UpdateOneOptions
  ) {
    if (!this._connection) await this.initialize()
    return this._connection
      .db(dbName)
      .collection<Data>(collectionName)
      .updateOne(filter, update, options)
  }

  async load<Data = any>(
    dbName: string,
    collectionName: string,
    query?: FilterQuery<Data>,
    projection?: object
  ) {
    if (!this._connection) await this.initialize()
    const queryFind = query || {}
    const projectionFind = projection ? { projection: projection } : {}
    return this._connection
      .db(dbName)
      .collection<Data>(collectionName)
      .find(queryFind, projectionFind)
      .toArray()
  }

  async loadMap<Data = any, MappedData = unknown>(
    dbName: string,
    collectionName: string,
    query: FilterQuery<Data>,
    f: (document: Data) => MappedData
  ) {
    if (!this._connection) await this.initialize()
    return this._connection
      .db(dbName)
      .collection<Data>(collectionName)
      .find(query)
      .map<MappedData>(f)
      .toArray()
  }

  async loadPipeline<Data = any>(
    dbName: string,
    collectionName: string,
    pipeline?: object[],
    allowDiskUse = false
  ) {
    if (!this._connection) await this.initialize()
    return this._connection
      .db(dbName)
      .collection<Data>(collectionName)
      .aggregate(pipeline, { allowDiskUse })
      .toArray()
  }

  async delete<Data = any>(dbName: string, collectionName: string, filter: FilterQuery<Data>) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).collection<Data>(collectionName).deleteOne(filter)
  }

  async deleteMany<Data = any>(dbName: string, collectionName: string, filter: FilterQuery<Data>) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).collection<Data>(collectionName).deleteMany(filter)
  }

  async dropCollection(dbName: string, collectionName: string) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).collection(collectionName).drop()
  }

  async dropDb(dbName: string) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).dropDatabase()
  }

  async bulkWrite(
    dbName: string,
    collectionName: string,
    operations: BulkWriteOperation<any>[],
    options?: CollectionBulkWriteOptions | undefined
  ) {
    if (!this._connection) await this.initialize()
    return this._connection.db(dbName).collection(collectionName).bulkWrite(operations, options)
  }
}
