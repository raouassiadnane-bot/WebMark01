module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js','jsx','json','node'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
