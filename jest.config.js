process.env.MONGO_URI = 'mongodb://localhost:27017/leopold';
process.env.PORT = '8000';
process.env.HOST = 'localhost';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    'dist',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: -10,
    },
  },
};
