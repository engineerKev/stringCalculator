module.exports = {
    setupFiles: [
        '<rootDir>/test/setupTests.js',
    ],
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/test/styleMock.js',
    }
};