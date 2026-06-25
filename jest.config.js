/**
 * Jest configuration.
 * - testEnvironment 'node' because we are testing an HTTP API, not a browser DOM.
 * - setupFilesAfterEnv loads the custom `toMatchSchema` matcher before each test file.
 * - The suite runs in-process against the Express app by default (no network), so
 *   timeouts can be tight; they only loosen if BASE_URL points at a remote instance.
 */
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  testTimeout: 10000,
  collectCoverageFrom: ['server/**/*.js'],
};
