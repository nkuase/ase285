module.exports = {
    testEnvironment: 'node', // or 'jsdom' for browser environment
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'], // adjust the glob pattern based on your project structure
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    // You can add other configurations as needed
    // For example, setting up test coverage:
    // collectCoverage: true,
    // collectCoverageFrom: ['src/**/*.js'],
    // coverageReporters: ['lcov', 'text'],
  };