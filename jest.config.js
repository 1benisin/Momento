/** @type {import('jest').Config} */
const config = {
  preset: "jest-expo",

  // Handle module resolution
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Coverage configuration
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],

  // Test patterns - include __tests__ directories
  testMatch: [
    "<rootDir>/components/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/components/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/app/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/app/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/utils/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/utils/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/hooks/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/hooks/**/__tests__/**/*.{js,jsx,ts,tsx}",
  ],
};

module.exports = config;
