/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testEnvironment: "node",
  collectCoverage: false,
  testTimeout: 1000 * 60 * 30,
  roots: ["<rootDir>/src/"],
  testMatch: ["**/?(*.)+(spec).ts?(x)", "**\\?(*.)+(spec).ts?(x)"]
};

module.exports = config;