module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    // @carbon/react pulls in temporal-polyfill, whose "exports" map points to an ESM-only entry
    "^temporal-polyfill/global$":
      "<rootDir>/node_modules/temporal-polyfill/global.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
