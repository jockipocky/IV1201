module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/**'
  ],
  coverageDirectory: 'test/coverage',
  verbose: true,
  clearMocks: true,
  transform: {}
};
