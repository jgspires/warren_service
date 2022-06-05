module.exports = {
  /**
   * Define some defaults to use for the in-memory MongoDB
   */
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      // Version of MongoDB
      version: '4.0.2',
      skipMD5: true
    },
    autoStart: false
  }
}
