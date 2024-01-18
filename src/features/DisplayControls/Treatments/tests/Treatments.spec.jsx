import { render, waitFor } from "@testing-library/react";
import React from "react";
import Treatments from "../components/Treatments";
import { getAllDrugOrders } from "../utils/TreatmentsUtils";
import { SliderContext } from "../../../../context/SliderContext";

jest.mock("../utils/TreatmentsUtils", () => {
  const originalModule = jest.requireActual("../utils/TreatmentsUtils");
  return {
    ...originalModule,
    getAllDrugOrders: jest.fn(),
  };
});

const mockProviderValue = {
  isSliderOpen: {
    treatments: false,
  },
  updateSliderOpen: jest.fn(),
  setSliderContentModified: jest.fn(),
  visitSummary: jest.fn(),
  visitUuid: "patient_visit_uuid",
};

describe("Treatments", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should show no treatments message if no drug orders are present for that patient", async () => {
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: [],
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
        drugOrder: {
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
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
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
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("20 Jan 1970")).toBeTruthy();
      expect(getByText("Drug 1")).toBeTruthy();
      expect(getByText("1 mg - Oral - Once a day - for 7 Day(s)")).toBeTruthy();
      expect(getByText("Dr. John Doe")).toBeTruthy();
      expect(getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("should render AddToDrugChart component when Add to Drug Chart link is clicked", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
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

  it("should open the slider when Add to Drug Chart link is clicked", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
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
      expect(mockProviderValue.updateSliderOpen).toHaveBeenCalledTimes(1);
    });
  });

  it("should render Tags near Drug Name", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(getByText(/drug 1/i)).toBeTruthy();
    });
    expect(getByText(/Rx/i)).toBeTruthy();
  });

  it("should change add to drug chart link to edit drug chart link when drug order is already added to drug chart", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1704798900],
          dayWiseSlotsStartTime: [1704853800, 1704885000],
          remainingDaySlotsStartTime: [1704940200],
          slotStartTime: null,
          medicationAdministrationStarted: false,
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    const editDrugChartLink = await waitFor(() => getByText("Edit Drug Chart"));
    await waitFor(() => {
      expect(editDrugChartLink).toBeTruthy();
      expect(editDrugChartLink.className).not.toContain("bx--link--disabled");
    });
  });

  it("should disable edit drug chart link after drug is administered", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1704798900],
          dayWiseSlotsStartTime: [1704853800, 1704885000],
          remainingDaySlotsStartTime: [1704940200],
          slotStartTime: null,
          medicationAdministrationStarted: true,
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Edit Drug Chart")).toBeTruthy();
      expect(getByText("Edit Drug Chart").className).toContain(
        "bx--link--disabled"
      );
    });
  });

  it("should not open slider on click of disabled edit drug chart link", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
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
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1704798900],
          dayWiseSlotsStartTime: [1704853800, 1704885000],
          remainingDaySlotsStartTime: [1704940200],
          slotStartTime: null,
          medicationAdministrationStarted: true,
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Edit Drug Chart")).toBeTruthy();
    });
    getByText("Edit Drug Chart").click();
    await waitFor(() => {
      expect(mockProviderValue.updateSliderOpen).toHaveBeenCalledTimes(1);
    });
  });
});
