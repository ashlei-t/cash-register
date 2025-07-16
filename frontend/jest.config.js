module.exports = {
    testEnvironment: 'jsdom',

    // Transform ES modules in node_modules
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)'
    ],

    // Configure Babel to handle ES modules
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },

    // Module file extensions
    moduleFileExtensions: ['js', 'jsx', 'json'],

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

    // Module name mapping for CSS and other assets
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },

    // Coverage configuration
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
      '!src/reportWebVitals.js'
    ]
  };
