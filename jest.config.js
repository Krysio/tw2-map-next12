/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "\\.glsl$": "<rootDir>/src/__mocks__/glsl.js",
    ...pathsToModuleNameMapper(
      compilerOptions.paths, { prefix: '<rootDir>/' }
    )
  }
};