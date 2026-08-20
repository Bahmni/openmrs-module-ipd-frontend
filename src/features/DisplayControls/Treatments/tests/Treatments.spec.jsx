import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import Treatments from "../components/Treatments";
import {
  getEncounterType,
  isPRNEligibleForNextDose,
  stopDrugOrders,
} from "../utils/TreatmentsUtils";
import { SliderContext } from "../../../../context/SliderContext";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import { MedicationIndicatorsContext } from "../../../../context/MedicationIndicatorsContext";
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import {
  mockUserWithAllRequiredPrivileges,
  mockUserWithoutAnyPrivilege,
} from "../../../../utils/mockUserData";
import { variableDoseStopDrugOrder } from "./TreatmentsMockData";

const mockHandleAuditEvent = jest.fn();

jest.mock("../utils/TreatmentsUtils", () => {
  const originalModule = jest.requireActual("../utils/TreatmentsUtils");
  return {
    ...originalModule,
    getEncounterType: jest.fn(),
    stopDrugOrders: jest.fn(),
    getSlotsForAnOrderAndServiceType: jest.fn().mockResolvedValue([]),
    isPRNEligibleForNextDose: jest.fn().mockReturnValue(true),
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

const mockAllMedicationsProviderValue = {
  data: {
    emergencyMedications: [],
    ipdDrugOrders: [],
  },
  getAllDrugOrders: jest.fn(),
};

const withMedicationIndicators = (element) => (
  <MedicationIndicatorsContext.Provider
    value={{
      regularCount: 0,
      vdpCount: 0,
      setMedicationIndicators: jest.fn(),
    }}
  >
    {element}
  </MedicationIndicatorsContext.Provider>
);

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
    pendingSlotsAvailable: true,
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
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider
            value={mockAllMedicationsProviderValue}
          >
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(
        getByText("No IPD Medication is prescribed for this patient yet")
      ).toBeTruthy();
    });
  });

  it("should show opd and ipd treatments", async () => {
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
          careSetting: "OUTPATIENT",
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
      {
        drugOrder: {
          uuid: "2",
          effectiveStartDate: 1704785404,
          dateStopped: null,
          dateActivated: 1704785404,
          scheduledDate: 1704785404,
          drug: {
            name: "Drug 2",
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Drug 1")).toBeTruthy();
      expect(getByText("Drug 2")).toBeTruthy();
    });
  });

  it("should show OPD treatments in IPD treatments view (preceding visit medications)", async () => {
    const treatments = [
      {
        drugOrder: {
          uuid: "1",
          effectiveStartDate: new Date("01/01/2022"),
          dateStopped: null,
          drug: { name: "Drug 1" },
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
          careSetting: "OUTPATIENT",
        },
        provider: { name: "Dr. John Doe" },
      },
    ];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: { emergencyMedications: [], ipdDrugOrders: treatments },
    };
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Drug 1")).toBeTruthy();
    });
  });

  describe("AC4: Admission-date filter", () => {
    const admissionDate = new Date("2024-01-10").getTime();
    const mockSliderWithAdmission = {
      ...mockProviderValue,
      visitSummary: { startDateTime: admissionDate },
    };
    const buildDrugOrder = (
      autoExpireDate,
      effectiveStartDate,
      careSetting = "OUTPATIENT"
    ) => ({
      drugOrder: {
        uuid: "ac4-drug",
        effectiveStartDate,
        dateStopped: null,
        drug: { name: "AC4 Drug" },
        autoExpireDate,
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions: "{}",
        },
        durationUnits: "Day(s)",
        careSetting,
      },
      provider: { name: "Dr. Test" },
    });

    it("should NOT render OPD drug whose course ended before admission", async () => {
      const treatments = [
        buildDrugOrder(
          new Date("2024-01-05").getTime(), // expired before admission
          new Date("2024-01-01").getTime() // prescribed before admission
        ),
      ];
      const { queryByText } = render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockSliderWithAdmission}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        expect(queryByText("AC4 Drug")).toBeNull();
      });
    });

    it("should NOT render OPD drug whose course ended after admission but is no longer ongoing", async () => {
      const treatments = [
        buildDrugOrder(
          new Date("2024-02-01").getTime(), // expired after admission but before today
          new Date("2024-01-01").getTime() // prescribed before admission
        ),
      ];
      const { queryByText } = render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockSliderWithAdmission}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        expect(queryByText("AC4 Drug")).toBeNull();
      });
    });

    it("should render OPD drug whose course is still ongoing", async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const treatments = [
        buildDrugOrder(
          futureDate.getTime(), // still ongoing
          new Date("2024-01-01").getTime() // prescribed before admission
        ),
      ];
      const { getByText } = render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockSliderWithAdmission}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        expect(getByText("AC4 Drug")).toBeTruthy();
      });
    });

    it("should render OPD drug with no autoExpireDate (open-ended) regardless of admission date", async () => {
      const treatments = [
        buildDrugOrder(null, new Date("2024-01-01").getTime()),
      ];
      const { getByText } = render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockSliderWithAdmission}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        expect(getByText("AC4 Drug")).toBeTruthy();
      });
    });

    it("should render IPD drug (prescribed after admission) even if course is now complete", async () => {
      const treatments = [
        buildDrugOrder(
          new Date("2024-01-15").getTime(), // expired after admission but before today
          new Date("2024-01-12").getTime(), // prescribed AFTER admission (IPD drug)
          "INPATIENT"
        ),
      ];
      const { getByText } = render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockSliderWithAdmission}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        expect(getByText("AC4 Drug")).toBeTruthy();
      });
    });
  });

  describe("AC5: Add to Drug Chart disabled for completed medications", () => {
    it("should enable Add PRN Tasks button after task completion when time interval has passed", async () => {
      const prnDrug = {
        drugOrder: {
          uuid: "prn-completed",
          effectiveStartDate: new Date("01/01/2022"),
          dateStopped: null,
          drug: { name: "PRN Drug" },
          dosingInstructions: {
            dose: 1,
            doseUnits: "mg",
            route: "Oral",
            frequency: "Once a day",
            asNeeded: true,
            administrationInstructions: "{}",
          },
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: { name: "Dr. Test" },
        drugOrderSchedule: { allSlotsAttended: true },
        prnHasPendingPlaceholder: false,
        prnEligible: true,
      };
      const { getByText } = render(
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: false,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <SliderContext.Provider value={mockProviderValue}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: {
                  emergencyMedications: [],
                  ipdDrugOrders: [prnDrug],
                },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        const link = getByText("Add to Tasks").closest("a");
        expect(link).not.toHaveAttribute("aria-disabled", "true");
      });
    });

    it("should keep Add PRN Tasks button disabled after task completion when time interval has not passed", async () => {
      isPRNEligibleForNextDose.mockReturnValueOnce(false);
      const prnDrug = {
        drugOrder: {
          uuid: "prn-not-yet-eligible",
          effectiveStartDate: new Date("01/01/2022"),
          dateStopped: null,
          drug: { name: "PRN Drug" },
          dosingInstructions: {
            dose: 1,
            doseUnits: "mg",
            route: "Oral",
            frequency: "Every Hour",
            asNeeded: true,
            administrationInstructions: "{}",
          },
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: { name: "Dr. Test" },
        drugOrderSchedule: { allSlotsAttended: true },
      };
      const { getByText } = render(
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: false,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <SliderContext.Provider value={mockProviderValue}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: {
                  emergencyMedications: [],
                  ipdDrugOrders: [prnDrug],
                },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        const link = getByText("Add to Tasks").closest("a");
        expect(link).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("should disable Add to Drug Chart link for a non-PRN drug whose autoExpireDate has passed", async () => {
      const admissionDate = new Date("2024-01-10").getTime();
      const expiredDrug = {
        drugOrder: {
          uuid: "expired-drug",
          effectiveStartDate: new Date("2024-01-12").getTime(), // prescribed after admission (IPD drug)
          dateStopped: null,
          drug: { name: "Expired Drug" },
          autoExpireDate: new Date("2024-01-15").getTime(), // course ended during IPD stay
          dosingInstructions: {
            dose: 1,
            doseUnits: "mg",
            route: "Oral",
            frequency: "Once a day",
            asNeeded: false,
            administrationInstructions: "{}",
          },
          durationUnits: "Day(s)",
          careSetting: "INPATIENT",
        },
        provider: { name: "Dr. Test" },
      };
      const { getByText } = render(
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: false,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <SliderContext.Provider
            value={{
              ...mockProviderValue,
              visitSummary: { startDateTime: admissionDate },
            }}
          >
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: {
                  emergencyMedications: [],
                  ipdDrugOrders: [expiredDrug],
                },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
      await waitFor(() => {
        const link = getByText("Add to Drug Chart").closest("a");
        expect(link).toHaveAttribute("aria-disabled", "true");
      });
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("20 Jan 1970")).toBeTruthy();
      expect(getByText("Drug 1")).toBeTruthy();
      expect(getByText("1 mg - Oral - Once a day - for 7 Day(s)")).toBeTruthy();
      expect(getByText("Dr. John Doe")).toBeTruthy();
      expect(getByText("Add to Drug Chart")).toBeTruthy();
    });
  });

  it("should not render an AddToDrugChart link for treatments when privilege is not present", async () => {
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText, queryByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithoutAnyPrivilege,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("20 Jan 1970")).toBeTruthy();
      expect(getByText("Drug 1")).toBeTruthy();
      expect(getByText("1 mg - Oral - Once a day - for 7 Day(s)")).toBeTruthy();
      expect(getByText("Dr. John Doe")).toBeTruthy();
      expect(queryByText("Add to Drug Chart")).toBeFalsy();
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            <RefreshDisplayControl.Provider value={[]}>
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </RefreshDisplayControl.Provider>
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: false,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    const editDrugChartLink = await waitFor(() => getByText("Edit Drug Chart"));
    await waitFor(() => {
      expect(editDrugChartLink).toBeTruthy();
      expect(editDrugChartLink.className).not.toContain("bx--link--disabled");
    });
  });

  it("should not render edit drug chart link when privilege is not present", async () => {
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { queryByText } = render(
      <SliderContext.Provider value={mockProviderValue}>
        <IPDContext.Provider
          value={{
            config: mockConfig,
            isReadMode: false,
            currentUser: mockUserWithAllRequiredPrivileges,
          }}
        >
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </IPDContext.Provider>
      </SliderContext.Provider>
    );
    await waitFor(() => {
      expect(queryByText("Edit Drug Chart")).toBeFalsy();
    });
  });

  it("should display stop drug link after one dose of drug is administered", async () => {
    const treatments = [stopDrugOrder];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText, queryByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            <RefreshDisplayControl.Provider value={[]}>
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </RefreshDisplayControl.Provider>
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Stop drug")).toBeTruthy();
      expect(queryByText("Edit Drug Chart")).toBeFalsy();
    });
  });

  it("should not render stop drug link when prvilege is not present", async () => {
    const treatments = [stopDrugOrder];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { queryByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithoutAnyPrivilege,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("Stop drug")).toBeFalsy();
    });
  });

  it("should show the stop drug modal on click of stop drug link", async () => {
    const treatments = [stopDrugOrder];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };

    const { getByText, getAllByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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

    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };

    const { getAllByText, container } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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

    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };

    getEncounterType.mockImplementation(() => {
      return Promise.resolve({
        encounterTypeUuid: "TestEncounterTypeUuid",
      });
    });

    stopDrugOrders.mockImplementation(() => {
      return Promise.resolve({
        uuid: "TestUuid",
        status: 200,
      });
    });

    const { getAllByText, container } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          handleAuditEvent: mockHandleAuditEvent,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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
    expect(mockHandleAuditEvent).toHaveBeenCalledWith(
      "STOP_SCHEDULED_MEDICATION_TASK"
    );
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

    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };

    const { queryByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("Stopped")).toBeTruthy();
      expect(queryByText("Stop drug")).toBeFalsy();
    });
  });

  it("should close the stop drug modal when cancel or close button is clicked", async () => {
    const treatments = [stopDrugOrder];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };

    const { getAllByText, queryByText, getByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
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

  it("should render an AddToDrugChart link disabled for IPD treatments read mode", async () => {
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
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByRole } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: true,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      const link = getByRole("link", { disabled: true });
      expect(link).toBeTruthy();
    });
  });

  it("should show status as Completed when all slots are attended", async () => {
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
          allSlotsAttended: true,
        },
        provider: {
          name: "Dr. John Doe",
        },
      },
    ];
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: treatments,
      },
    };
    const { getByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText(/drug 1/i)).toBeTruthy();
    });
    expect(getByText(/Completed/i)).toBeTruthy();
  });

  it("should show Stop drug link in expandable row for variable dose when administration has started", async () => {
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: [variableDoseStopDrugOrder],
      },
    };

    const { queryByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("VDP Drug")).toBeTruthy();
    });
    expect(queryByText("Stop drug")).toBeTruthy();
  });

  it("should not show Stop drug link for variable dose when administration has not started", async () => {
    const notStartedOrder = {
      ...variableDoseStopDrugOrder,
      drugOrderSchedule: {
        stageSchedules: [
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: false,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
        ],
        medicationAdministrationStarted: false,
      },
    };
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: [notStartedOrder],
      },
    };

    const { queryByText } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("VDP Drug")).toBeTruthy();
    });
    expect(queryByText("Stop drug")).toBeFalsy();
  });

  it("should stop variable dose medication and show success stop notification on modal submit", async () => {
    getEncounterType.mockResolvedValueOnce({
      uuid: "81852aee-3f10-11e4-adec-0800271c1b75",
    });
    stopDrugOrders.mockResolvedValueOnce({ status: 200 });

    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: [variableDoseStopDrugOrder],
      },
    };

    const { getAllByText, container } = render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
          handleAuditEvent: mockHandleAuditEvent,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );

    await waitFor(() => {
      getAllByText("Stop drug")[0].click();
      const reasonInputField = container.querySelector(".bx--text-area");
      fireEvent.change(reasonInputField, { target: { value: "test reason" } });
      const stopDrugButton = getAllByText("Stop drug")[1];
      fireEvent.click(stopDrugButton);
      expect(getEncounterType).toHaveBeenCalledWith("Consultation");
      expect(stopDrugOrders).toHaveBeenCalled();
    });
    expect(mockHandleAuditEvent).toHaveBeenCalledWith(
      "STOP_SCHEDULED_MEDICATION_TASK"
    );
  });

  describe("VDP default expanded state", () => {
    const secondVdpOrder = {
      ...variableDoseStopDrugOrder,
      drugOrder: {
        ...variableDoseStopDrugOrder.drugOrder,
        uuid: "vdp-2",
        drug: { name: "VDP Drug 2" },
      },
    };

    const renderTreatments = (ipdDrugOrders) => {
      const updatedAllMedications = {
        ...mockAllMedicationsProviderValue,
        data: { emergencyMedications: [], ipdDrugOrders },
      };
      return render(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockProviderValue}>
            <AllMedicationsContext.Provider value={updatedAllMedications}>
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );
    };

    it("renders a single VDP expanded by default", async () => {
      const { getByTestId, getByText } = renderTreatments([
        variableDoseStopDrugOrder,
      ]);
      await waitFor(() => expect(getByText("VDP Drug")).toBeTruthy());
      expect(getByTestId("expandable-row")).toHaveClass("bx--expandable-row");
    });

    it("renders all VDPs expanded by default", async () => {
      const { getAllByTestId, getByText } = renderTreatments([
        variableDoseStopDrugOrder,
        secondVdpOrder,
      ]);
      await waitFor(() => expect(getByText("VDP Drug")).toBeTruthy());
      const rows = getAllByTestId("expandable-row");
      expect(rows).toHaveLength(2);
      rows.forEach((row) => expect(row).toHaveClass("bx--expandable-row"));
    });

    it("renders normal medications without the expanded class", async () => {
      const { getByTestId, getByText } = renderTreatments([stopDrugOrder]);
      await waitFor(() => expect(getByText("Drug 1")).toBeTruthy());
      expect(getByTestId("non-expandable-row")).not.toHaveClass(
        "bx--expandable-row"
      );
    });

    it("allows a user to manually collapse an expanded VDP", async () => {
      const { getByTestId, getByLabelText, getByText } = renderTreatments([
        variableDoseStopDrugOrder,
      ]);
      await waitFor(() => expect(getByText("VDP Drug")).toBeTruthy());
      expect(getByTestId("expandable-row")).toHaveClass("bx--expandable-row");
      fireEvent.click(getByLabelText("Collapse current row"));
      expect(getByTestId("expandable-row")).not.toHaveClass(
        "bx--expandable-row"
      );
    });

    it("allows a user to expand a collapsed VDP again", async () => {
      const { getByTestId, getByLabelText, getByText } = renderTreatments([
        variableDoseStopDrugOrder,
      ]);
      await waitFor(() => expect(getByText("VDP Drug")).toBeTruthy());
      fireEvent.click(getByLabelText("Collapse current row"));
      expect(getByTestId("expandable-row")).not.toHaveClass(
        "bx--expandable-row"
      );
      fireEvent.click(getByLabelText("Expand current row"));
      expect(getByTestId("expandable-row")).toHaveClass("bx--expandable-row");
    });

    it("preserves manual collapse and defaults new VDPs to expanded on data refresh", async () => {
      const { rerender, getByLabelText, getByText } = renderTreatments([
        variableDoseStopDrugOrder,
      ]);
      await waitFor(() => expect(getByText("VDP Drug")).toBeTruthy());
      fireEvent.click(getByLabelText("Collapse current row"));

      rerender(
        <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
          <SliderContext.Provider value={mockProviderValue}>
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: {
                  emergencyMedications: [],
                  ipdDrugOrders: [variableDoseStopDrugOrder, secondVdpOrder],
                },
              }}
            >
              withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
            </AllMedicationsContext.Provider>
          </SliderContext.Provider>
        </IPDContext.Provider>
      );

      await waitFor(() => expect(getByText("VDP Drug 2")).toBeTruthy());
      const collapsedRow = getByText("VDP Drug").closest("tr");
      const expandedRow = getByText("VDP Drug 2").closest("tr");
      expect(collapsedRow).not.toHaveClass("bx--expandable-row");
      expect(expandedRow).toHaveClass("bx--expandable-row");
    });
  });
});

it("should render an Edit Drug Chart link disabled for IPD treatments read mode", async () => {
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
  const updatedAllMedications = {
    ...mockAllMedicationsProviderValue,
    data: {
      emergencyMedications: [],
      ipdDrugOrders: treatments,
    },
  };
  const { getByText } = render(
    <IPDContext.Provider
      value={{
        config: mockConfig,
        isReadMode: true,
        currentUser: mockUserWithAllRequiredPrivileges,
      }}
    >
      <SliderContext.Provider value={mockProviderValue}>
        <AllMedicationsContext.Provider value={updatedAllMedications}>
          withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    </IPDContext.Provider>
  );
  const editDrugChartLink = await waitFor(() => getByText("Edit Drug Chart"));
  await waitFor(() => {
    expect(editDrugChartLink).toBeTruthy();
    expect(editDrugChartLink.className).toContain("bx--link--disabled");
  });
});

it("should render Add to Tasks link as disabled when PRN drug order autoExpireDate has passed", async () => {
  const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const treatments = [
    {
      drugOrder: {
        uuid: "prn-expired-1",
        effectiveStartDate: 1704785404,
        dateStopped: null,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        autoExpireDate: pastDate,
        drug: {
          name: "PRN Drug",
        },
        dosingInstructions: {
          dose: 2,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          asNeeded: true,
          administrationInstructions:
            '{"instructions":"As needed","additionalInstructions":""}',
        },
        duration: 1,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      provider: {
        name: "Dr. Jane Doe",
      },
    },
  ];
  const updatedAllMedications = {
    ...mockAllMedicationsProviderValue,
    data: {
      emergencyMedications: [],
      ipdDrugOrders: treatments,
    },
  };
  const { getByText } = render(
    <IPDContext.Provider
      value={{
        config: mockConfig,
        isReadMode: false,
        currentUser: mockUserWithAllRequiredPrivileges,
      }}
    >
      <SliderContext.Provider
        value={{
          ...mockProviderValue,
          visitSummary: { startDateTime: new Date("2024-01-01").getTime() },
        }}
      >
        <AllMedicationsContext.Provider value={updatedAllMedications}>
          withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    </IPDContext.Provider>
  );
  const addToTasksLink = await waitFor(() => getByText("Add to Tasks"));
  expect(addToTasksLink.className).toContain("bx--link--disabled");
});

it("should hide a stopped order whose uuid matches a REVISE discharge order's previousOrderUuid", async () => {
  const treatments = [
    {
      drugOrder: {
        uuid: "original-uuid",
        action: "NEW",
        previousOrderUuid: null,
        effectiveStartDate: 1704785404,
        dateStopped: 1704785404,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        drug: { name: "Stopped Drug" },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions: '{"instructions":"As directed"}',
        },
        duration: 7,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      isDischargeMedication: false,
      provider: { name: "Dr. John Doe" },
    },
    {
      drugOrder: {
        uuid: "revise-uuid",
        action: "REVISE",
        previousOrderUuid: "original-uuid",
        effectiveStartDate: 1704785404,
        dateStopped: null,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        drug: { name: "Stopped Drug" },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions:
            '{"instructions":"As directed","isDischargeMedication":true}',
        },
        duration: 7,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      isDischargeMedication: true,
      provider: { name: "Dr. John Doe" },
    },
  ];

  const updatedAllMedications = {
    ...mockAllMedicationsProviderValue,
    data: { emergencyMedications: [], ipdDrugOrders: treatments },
  };

  const { queryByText } = render(
    <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
      <SliderContext.Provider value={mockProviderValue}>
        <AllMedicationsContext.Provider value={updatedAllMedications}>
          withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    </IPDContext.Provider>
  );

  await waitFor(() => {
    expect(queryByText("Stopped Drug")).toBeFalsy();
  });
});

it("should keep a stopped order whose uuid does NOT match any discharge REVISE previousOrderUuid", async () => {
  const treatments = [
    {
      drugOrder: {
        uuid: "stopped-uuid",
        action: "NEW",
        previousOrderUuid: null,
        effectiveStartDate: 1704785404,
        dateStopped: 1704785404,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        drug: { name: "Retained Stopped Drug" },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions: '{"instructions":"As directed"}',
        },
        duration: 7,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      isDischargeMedication: false,
      drugOrderSchedule: {
        firstDaySlotsStartTime: [],
        dayWiseSlotsStartTime: [],
        remainingDaySlotsStartTime: [],
        slotStartTime: null,
        medicationAdministrationStarted: true,
      },
      provider: { name: "Dr. John Doe" },
    },
  ];

  const updatedAllMedications = {
    ...mockAllMedicationsProviderValue,
    data: { emergencyMedications: [], ipdDrugOrders: treatments },
  };

  const { queryByText } = render(
    <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
      <SliderContext.Provider value={mockProviderValue}>
        <AllMedicationsContext.Provider value={updatedAllMedications}>
          withMedicationIndicators(<Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />)
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    </IPDContext.Provider>
  );

  await waitFor(() => {
    expect(queryByText("Retained Stopped Drug")).toBeTruthy();
  });
});

describe("Medication indicators", () => {
  const FHIR_DOSING_INSTRUCTION_TYPE =
    "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FhirDosingInstructions";

  const buildRegularOrder = () => ({
    drugOrder: {
      uuid: "reg-1",
      effectiveStartDate: 1704785404,
      dateStopped: null,
      dateActivated: 1704785404,
      scheduledDate: 1704785404,
      drug: { name: "Reg Drug" },
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
      allSlotsAttended: false,
      medicationAdministrationStarted: false,
    },
    provider: { name: "Dr. John Doe" },
  });

  const buildPrescribedRegularOrder = () => ({
    ...buildRegularOrder(),
    drugOrderSchedule: null,
  });

  const buildVdpOrder = () => ({
    drugOrder: {
      uuid: "vdp-1",
      effectiveStartDate: Date.now() - 3 * 86400000,
      dateStopped: null,
      dateActivated: Date.now() - 3 * 86400000,
      dosingInstructionType: FHIR_DOSING_INSTRUCTION_TYPE,
      dosingInstructions: {
        dose: null,
        doseUnits: "Tablet(s)",
        route: "Oral",
        frequency: null,
        asNeeded: false,
        administrationInstructions: JSON.stringify([
          {
            sequence: 1,
            text: "Stage 1",
            timing: {
              code: { text: "Once a day" },
              repeat: { duration: 2, durationUnit: "d" },
            },
            doseAndRate: [{ doseQuantity: { value: 1, unit: "Tablet(s)" } }],
          },
          {
            sequence: 2,
            text: "Stage 2",
            timing: {
              code: { text: "Once a day" },
              repeat: { duration: 2, durationUnit: "d" },
            },
            doseAndRate: [{ doseQuantity: { value: 2, unit: "Tablet(s)" } }],
          },
        ]),
      },
      drug: { name: "VDP Drug" },
      duration: 4,
      durationUnits: "Day(s)",
      careSetting: "INPATIENT",
    },
    drugOrderSchedule: {
      stageSchedules: [
        {
          variableDosageSequence: 1,
          isScheduled: true,
          administrationStarted: true,
          pendingSlotsAvailable: false,
          allAttended: true,
        },
        {
          variableDosageSequence: 2,
          isScheduled: false,
          administrationStarted: false,
          pendingSlotsAvailable: true,
          allAttended: false,
        },
      ],
      medicationAdministrationStarted: true,
    },
    provider: { name: "Dr. Jane Smith" },
  });

  const renderWithIndicators = (treatments, setMedicationIndicators) => {
    return render(
      <IPDContext.Provider
        value={{
          config: mockConfig,
          isReadMode: false,
          currentUser: mockUserWithAllRequiredPrivileges,
        }}
      >
        <SliderContext.Provider value={mockProviderValue}>
          <MedicationIndicatorsContext.Provider
            value={{
              regularCount: 0,
              vdpCount: 0,
              setMedicationIndicators,
            }}
          >
            <AllMedicationsContext.Provider
              value={{
                ...mockAllMedicationsProviderValue,
                data: { emergencyMedications: [], ipdDrugOrders: treatments },
              }}
            >
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
            </AllMedicationsContext.Provider>
          </MedicationIndicatorsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
  };

  it("publishes regular and vdp counts for medications with Add to Drug Chart enabled", async () => {
    const setMedicationIndicators = jest.fn();
    renderWithIndicators(
      [buildPrescribedRegularOrder(), buildVdpOrder()],
      setMedicationIndicators
    );
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 1,
        vdpCount: 1,
      });
    });
  });

  it("counts a prescribed regular drug with Add to Drug Chart enabled", async () => {
    const setMedicationIndicators = jest.fn();
    renderWithIndicators(
      [buildPrescribedRegularOrder()],
      setMedicationIndicators
    );
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 1,
        vdpCount: 0,
      });
    });
  });

  it("does not count a regular drug already added to the drug chart", async () => {
    const setMedicationIndicators = jest.fn();
    renderWithIndicators([buildRegularOrder()], setMedicationIndicators);
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 0,
        vdpCount: 0,
      });
    });
  });

  it("does not count a regular drug whose drug chart course is completed", async () => {
    const setMedicationIndicators = jest.fn();
    const completedRegularOrder = {
      ...buildRegularOrder(),
      drugOrderSchedule: {
        ...buildRegularOrder().drugOrderSchedule,
        allSlotsAttended: true,
      },
    };
    renderWithIndicators([completedRegularOrder], setMedicationIndicators);
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 0,
        vdpCount: 0,
      });
    });
  });

  it("counts a VDP drug with a stage available to add to the drug chart", async () => {
    const setMedicationIndicators = jest.fn();
    const vdpOrder = {
      ...buildVdpOrder(),
      drugOrderSchedule: {
        ...buildVdpOrder().drugOrderSchedule,
        stageSchedules: [],
      },
    };
    renderWithIndicators([vdpOrder], setMedicationIndicators);
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 0,
        vdpCount: 1,
      });
    });
  });

  it("does not count a VDP drug when all its stages are already scheduled", async () => {
    const setMedicationIndicators = jest.fn();
    const vdpOrderAdded = {
      ...buildVdpOrder(),
      drugOrderSchedule: {
        ...buildVdpOrder().drugOrderSchedule,
        stageSchedules: [
          {
            variableDosageSequence: 1,
            isScheduled: true,
            administrationStarted: true,
            pendingSlotsAvailable: true,
            allAttended: false,
          },
          {
            variableDosageSequence: 2,
            isScheduled: true,
            administrationStarted: false,
            pendingSlotsAvailable: false,
            allAttended: false,
          },
        ],
      },
    };
    renderWithIndicators([vdpOrderAdded], setMedicationIndicators);
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 0,
        vdpCount: 0,
      });
    });
  });

  it("publishes zero counts when no medication has Add to Drug Chart enabled", async () => {
    const setMedicationIndicators = jest.fn();
    const prnOrder = {
      ...buildRegularOrder(),
      drugOrder: {
        ...buildRegularOrder().drugOrder,
        uuid: "prn-1",
        drug: { name: "PRN Drug" },
        dosingInstructions: {
          ...buildRegularOrder().drugOrder.dosingInstructions,
          asNeeded: true,
        },
      },
    };
    renderWithIndicators([prnOrder], setMedicationIndicators);
    await waitFor(() => {
      expect(setMedicationIndicators).toHaveBeenCalledWith({
        regularCount: 0,
        vdpCount: 0,
      });
    });
  });

  it("should display stopped drug with administration in Medication section", async () => {
    const stoppedWithAdmin = {
      drugOrder: {
        uuid: "stopped-with-admin",
        effectiveStartDate: 1704785404,
        dateStopped: 1704785404,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        drug: { name: "Stopped Admin Drug" },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions: '{"instructions":"As directed"}',
        },
        duration: 7,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      drugOrderSchedule: {
        firstDaySlotsStartTime: [1704798900],
        dayWiseSlotsStartTime: [1704853800],
        remainingDaySlotsStartTime: [1704940200],
        slotStartTime: null,
        medicationAdministrationStarted: true,
      },
      provider: { name: "Dr. John Doe" },
    };
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: [stoppedWithAdmin],
      },
    };
    const { getByText, queryByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            {withMedicationIndicators(
              <Treatments patientId="test-patient" />
            )}
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Stopped Admin Drug")).toBeTruthy();
      expect(getByText("Stopped")).toBeTruthy();
      expect(queryByText("Edit Drug Chart")).not.toBeInTheDocument();
      expect(queryByText("Add to Drug Chart")).not.toBeInTheDocument();
      expect(queryByText("Stop Drug")).not.toBeInTheDocument();
    });
  });

  it("should display stopped drug without administration in Medication section", async () => {
    const stoppedWithoutAdmin = {
      drugOrder: {
        uuid: "stopped-no-admin",
        effectiveStartDate: 1704785404,
        dateStopped: 1704785404,
        dateActivated: 1704785404,
        scheduledDate: 1704785404,
        drug: { name: "Stopped Drug" },
        dosingInstructions: {
          dose: 1,
          doseUnits: "mg",
          route: "Oral",
          frequency: "Once a day",
          administrationInstructions: '{"instructions":"As directed"}',
        },
        duration: 7,
        durationUnits: "Day(s)",
        careSetting: "INPATIENT",
      },
      drugOrderSchedule: null,
      provider: { name: "Dr. John Doe" },
    };
    const updatedAllMedications = {
      ...mockAllMedicationsProviderValue,
      data: {
        emergencyMedications: [],
        ipdDrugOrders: [stoppedWithoutAdmin],
      },
    };
    const { getByText, queryByText } = render(
      <IPDContext.Provider value={{ config: mockConfig, isReadMode: false }}>
        <SliderContext.Provider value={mockProviderValue}>
          <AllMedicationsContext.Provider value={updatedAllMedications}>
            {withMedicationIndicators(
              <Treatments patientId="test-patient" />
            )}
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText("Stopped Drug")).toBeTruthy();
      expect(getByText("Stopped")).toBeTruthy();
      expect(queryByText("Edit Drug Chart")).not.toBeInTheDocument();
      expect(queryByText("Add to Drug Chart")).not.toBeInTheDocument();
      expect(queryByText("Stop Drug")).not.toBeInTheDocument();
    });
  });
});
