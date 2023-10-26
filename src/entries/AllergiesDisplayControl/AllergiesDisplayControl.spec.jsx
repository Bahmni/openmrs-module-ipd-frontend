import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import React from "react";
import { mockAllergiesIntolerenceResponse } from "./AllergiesDisplayCOntrolTestUtils";
import { AllergiesDisplayControl } from "./AllergiesDisplayControl";
import jest from "jest";

// let mockAxios;
jest.mock("axios");
describe("AllergiesDisplayControl", () => {
  //   beforeEach(() => {
  //     mockAxios = new MockAdapter(axios,{ onNoMatch: "throwException" });
  //     mockAxios.onGet(ALLERGIES_BASE_URL).reply(200, mockAllergiesIntolerenceResponse);
  //   });

  //   afterEach(() => {
  //     mockAxios.reset();
  //   });

  it("should render AllergiesDisplayControl", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    //    const mockAxios = new MockAdapter(axios,{ onNoMatch: "throwException" });
    //     mockAxios.onGet(ALLERGIES_BASE_URL).reply(200, {result: mockAllergiesIntolerenceResponse});
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Allergies")).toBeTruthy();
    });
  });
  it("should show data in the table", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Allergies")).toBeTruthy();
    });
    expect(screen.getByText("Beef")).toBeTruthy();
    expect(screen.getByText(/test comment/i)).toBeTruthy();
  });
  it("should highlight severity column when the value is high", async () => {
    axios.get.mockResolvedValue(mockAllergiesIntolerenceResponse);
    render(
      <AllergiesDisplayControl
        hostData={{ patientId: "__test_patient_uuid__" }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Allergies")).toBeTruthy();
    });

    screen.debug();
    expect(screen.getAllByRole("cell", { name: /high/i })[0]).toHaveClass(
      "high-severity-color"
    );
  });
});
