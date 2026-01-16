const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  collectCoverage: true,

  // 👇 THIS IS THE KEY PART
  coverageReporters: ["text", "text-summary"],

  // 👇 Prevents coverage folder creation
  coverageDirectory: undefined,
};

module.exports = createJestConfig(customJestConfig);
