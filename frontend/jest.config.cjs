module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // For @testing-library/jest-dom extensions
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    '^.+\.svg$': 'jest-transform-stub', // Mock SVG imports
  },
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest', // Use babel-jest for JS/JSX
  },
};