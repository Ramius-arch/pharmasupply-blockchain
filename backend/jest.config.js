module.exports = {
  preset: '@shelf/jest-mongodb', // If we decide to use an in-memory MongoDB for testing
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: [], // e.g., setup an in-memory MongoDB
  collectCoverage: true,
  coverageDirectory: 'coverage',
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/web3/'], // Ignore web3 tests for backend
};
