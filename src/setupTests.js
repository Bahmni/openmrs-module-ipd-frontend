// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();

// extend jest matchers with @testing-library/jest-dom
require("@testing-library/jest-dom");

// mock out i18n module with __mock__ based files
jest.mock("./features/i18n/utils");
