module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEach: ['@testing-library/jest-native/extend-expect'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/store/mockData.ts',
  ],
  coverageThreshold: {
    global: { branches: 30, functions: 40, lines: 40, statements: 40 },
  },
};
