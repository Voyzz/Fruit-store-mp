module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "verbose": true,
    "testURL": "http://localhost/",
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "testEnvironment": "node",
    "setupTestFrameworkScriptFile": "<rootDir>/test/setup.js"
};