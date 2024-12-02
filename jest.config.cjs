/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  rootDir: 'src',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  transform: { '^.+\\.ts$': 'ts-jest' },
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
};
