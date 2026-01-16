export default {
  testEnvironment: "node",
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js", // cluster should not be unit-tested
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
  },
};
