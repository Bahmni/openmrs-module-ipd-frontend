import React from "react";
import { render, waitFor } from "@testing-library/react";
import { ViewFormModal } from "../components/ViewFormModal";
import {
  mockFormStructure,
  mockFormTranslations,
  mockObservations,
} from "./ViewFormModalMock";
import moment from "moment";
jest.mock("../utils/ViewFormUtils", () => {
  const originalModule = jest.requireActual("../utils/ViewFormUtils");
  return {
    ...originalModule,
    fetchAllObservations: jest.fn(() => {
      return Promise.resolve(mockObservations);
    }),
  };
});
describe("View Form Modal", () => {
  it("should match snapshot", async () => {
    const metadata = {
      formName: "Test Form",
      encounterDateTime: moment(1714145870000),
      provider: "Provider",
    };
    const { container, getByText } = render(
      <ViewFormModal
        form={{
          formTemplate: mockFormStructure,
          formTranslations: mockFormTranslations,
        }}
        metadata={metadata}
        encounterUuid={"b6cdc4e4-79e9-4f0e-a5de-a9e58aa3abad"}
      />
    );
    await waitFor(() => {
      expect(getByText("Image")).toBeTruthy();
    });
    expect(container).toMatchSnapshot();
  });
});
