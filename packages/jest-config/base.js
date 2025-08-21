/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    './src': {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coveragePathIgnorePatterns: ['index\.ts', 'main\.ts', '.*\.module\.ts'], // list of regex expressions
};

module.exports = config;
