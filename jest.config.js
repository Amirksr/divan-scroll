/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // tsconfig.json sets jsx: "preserve" for Next.js's own SWC compiler;
        // ts-jest needs JSX actually compiled to JS, so override it here
        // rather than changing the app-wide tsconfig.
        tsconfig: { jsx: 'react-jsx' },
      },
    ],
  },
};

module.exports = config;
