import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import Treatments from "../components/Treatments";
import {
  getAllDrugOrders,
  getEncounterType,
  stopDrugOrders,
} from "../utils/TreatmentsUtils";
import { SliderContext } from "../../../../context/SliderContext";

jest.mock("../utils/TreatmentsUtils", () => {
  const originalModule = jest.requireActual("../utils/TreatmentsUtils");
  return {
    ...originalModule,
    getAllDrugOrders: jest.fn(),
    getEncounterType: jest.fn(),
    stopDrugOrders: jest.fn(),
  };
});

jest.mock("../../../../utils/CommonUtils", () => {
  const originalModule = jest.requireActual("../../../../utils/CommonUtils");
  return {
    ...originalModule,
    getCookies: jest.fn().mockReturnValue({
      "bahmni.user.location": '{"uuid":"0fbbeaf4-f3ea-11ed-a05b-0242ac120002"}',
    }),
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

let stopDrugOrder = {
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
};

describe("Treatments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should display stop drug link after one dose of drug is administered", async () => {
    const treatments = [stopDrugOrder];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });
    const { getByText, queryByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Stop drug")).toBeTruthy();
      expect(queryByText("Edit Drug Chart")).toBeFalsy();
    });
  });

  it("should show the stop drug modal on click of stop drug link", async () => {
    const treatments = [stopDrugOrder];
    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });

    const { getByText, getAllByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      fireEvent.click(getAllByText("Stop drug")[0]);
      expect(
        getByText(
          "Are you sure you want to stop this drug? You will not be able to reverse this decision"
        )
      ).toBeTruthy();
      const stopDrugButton = getAllByText("Stop drug")[1];
      expect(stopDrugButton.className).toContain("bx--btn--disabled");
    });
  });

  it("should enable the stop drug button when reason is provided in stop drug modal", async () => {
    const treatments = [stopDrugOrder];

    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });

    const { getAllByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      getAllByText("Stop drug")[0].click();
      const stopDrugButton = getAllByText("Stop drug")[1];
      expect(stopDrugButton.className).toContain("bx--btn--disabled");
      const reasonInputField = container.querySelector(".bx--text-area");
      fireEvent.change(reasonInputField, {
        target: { value: "test" },
      });
      expect(stopDrugButton.className).not.toContain("bx--btn--disabled");
      expect(stopDrugButton.className).toContain("bx--btn--danger");
    });
  });

  it("should trigger the api when we click on stop drug button in stop drug modal", async () => {
    const treatments = [stopDrugOrder];

    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });

    getEncounterType.mockImplementation(() => {
      return Promise.resolve({
        encounterTypeUuid: "TestEncounterTypeUuid",
      });
    });

    stopDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        uuid: "TestUuid",
      });
    });

    const { getAllByText, container } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      getAllByText("Stop drug")[0].click();
      const stopDrugButton = getAllByText("Stop drug")[1];
      const reasonInputField = container.querySelector(".bx--text-area");
      fireEvent.change(reasonInputField, {
        target: { value: "test" },
      });
      fireEvent.click(stopDrugButton);
      expect(getEncounterType).toHaveBeenCalledWith("Consultation");
      expect(stopDrugOrders).toHaveBeenCalled();
    });
  });

  it("should update the drug status after the stop drug api call is success", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: 1704785404,
          dateStopped: 1704785404,
          dateActivated: null,
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

    const { queryByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("Stopped")).toBeTruthy();
      expect(queryByText("Stop drug")).toBeFalsy();
    });
  });

  it("should close the stop drug modal when cancel or close button is clicked", async () => {
    const treatments = [stopDrugOrder];

    getAllDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      });
    });

    const { getAllByText, queryByText, getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
      </SliderContext.Provider>
    );

    await waitFor(() => {
      getAllByText("Stop drug")[0].click();
      const cancelButton = getByText("Cancel");
      fireEvent.click(cancelButton);
      expect(
        queryByText(
          "Are you sure you want to stop this drug? You will not be able to reverse this decision"
        )
      ).toBeFalsy();
    });
  });
});
