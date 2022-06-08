module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.ts?$": "ts-jest",
    },
    collectCoverageFrom: [
        "**/*.test.{ts,tsx}",
    ],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
