/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['js', 'ts', 'json'],
  rootDir: 'src',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  transform: { '^.+\\.ts$': 'ts-jest' },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/app.module.ts',
    '<rootDir>/main.config.ts',
    '<rootDir>/main.ts',
    '<rootDir>/health',
    '<rootDir>/payment/payment.module.ts',
    '<rootDir>/payment/infrastructure/migrations',
    '<rootDir>/payment/infrastructure/service/fake-payment-gateway.service.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
