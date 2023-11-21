import { render, waitFor } from "@testing-library/react";
import React from "react";
import Treatments from "../components/Treatments";
import { getPrescribedAndActiveDrugOrders } from "../utils/TreatmentsUtils";
import { SliderContext } from "../../../../context/SliderContext";

jest.mock("../utils/TreatmentsUtils", () => {
  const originalModule = jest.requireActual("../utils/TreatmentsUtils");
  return {
    ...originalModule,
    getPrescribedAndActiveDrugOrders: jest.fn(),
  };
});

const mockProviderValue = {
  isSliderOpen: false,
  updateSliderOpen: jest.fn(),
};

describe("Treatments", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show no treatments message if no drug orders are present for that patient", async () => {
    getPrescribedAndActiveDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        visitDrugOrders: [],
        activeDrugOrders: [],
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(
        getByText("No IPD Medication is prescribed for this patient yet")
      ).toBeTruthy();
    });
  });

  it("should not show OPD treatments", async () => {
    const treatments = [
      {
        uuid: "1",
        effectiveStartDate: new Date("01/01/2022"),
        dateStopped: null,
        drug: {
          name: "Drug 1",
        },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions:
            '{"instructions":"As directed","additionalInstructions":"all good"}',
        },
        duration: 7,
        durationUnits: "days",
        provider: {
          name: "Dr. John Doe",
        },
        careSetting: "OUTPATIENT",
      },
    ];
    getPrescribedAndActiveDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        visitDrugOrders: treatments,
        activeDrugOrders: [],
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(
        getByText("No IPD Medication is prescribed for this patient yet")
      ).toBeTruthy();
    });
  });

  it("should render an AddToDrugChart link for IPD treatments", async () => {
    const treatments = [
      {
        uuid: "1",
        effectiveStartDate: new Date("01/01/2022"),
        dateStopped: null,
        drug: {
          name: "Drug 1",
        },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions:
            '{"instructions":"As directed","additionalInstructions":"all good"}',
        },
        duration: 7,
        durationUnits: "days",
        provider: {
          name: "Dr. John Doe",
        },
        careSetting: "INPATIENT",
      },
    ];
    getPrescribedAndActiveDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        visitDrugOrders: treatments,
        activeDrugOrders: [],
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("01/01/2022")).toBeTruthy();
      expect(getByText("Drug 1")).toBeTruthy();
      expect(getByText("1 mg - Oral - Once a day - for 7 days")).toBeTruthy();
      expect(getByText("Dr. John Doe")).toBeTruthy();
      expect(getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("should render AddToDrugChart component when Add to Drug Chart link is clicked", async () => {
    const treatments = [
      {
        uuid: "1",
        effectiveStartDate: new Date("01/01/2022"),
        dateStopped: null,
        drug: {
          name: "Drug 1",
        },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions:
            '{"instructions":"As directed","additionalInstructions":"all good"}',
        },
        duration: 7,
        durationUnits: "days",
        provider: {
          name: "Dr. John Doe",
        },
        careSetting: "INPATIENT",
      },
    ];
    getPrescribedAndActiveDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        visitDrugOrders: treatments,
        activeDrugOrders: [],
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Add to Drug Chart")).toBeTruthy();
    });
    getByText("Add to Drug Chart").click();
    await waitFor(() => {
      expect(getByText("Add to Drug Chart")).toBeTruthy();
    });
  });
});
