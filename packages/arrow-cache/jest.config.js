module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.spec.json"
    }
  },
  setupFiles: ["jsdom-worker"]
};
