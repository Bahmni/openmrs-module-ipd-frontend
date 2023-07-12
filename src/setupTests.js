// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();

// mock out i18n module with __mock__ based files
jest.mock("./features/i18n/utils");
