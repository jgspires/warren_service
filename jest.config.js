module.exports = {
  clearMocks: true,
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov'],
  testMatch: ['<rootDir>/**/*test.ts', '<rootDir>/**/*spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./jest.setup.ts']
}
