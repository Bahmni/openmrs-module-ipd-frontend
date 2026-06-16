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
import { IPDContext } from "../../../../context/IPDContext";
import { mockConfig } from "../../../../utils/CommonUtils";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import {
  mockUserWithAllRequiredPrivileges,
  mockUserWithoutAnyPrivilege,
} from "../../../../utils/mockUserData";

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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
              <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
            <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
          </AllMedicationsContext.Provider>
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
    await waitFor(() => {
      expect(getByText(/drug 1/i)).toBeTruthy();
    });
    expect(getByText(/Completed/i)).toBeTruthy();
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
          <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
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
          <Treatments patientId="3ae1ee52-e9b2-4934-876d-30711c0e3e2f" />
        </AllMedicationsContext.Provider>
      </SliderContext.Provider>
    </IPDContext.Provider>
  );
  const addToTasksLink = await waitFor(() => getByText("Add to Tasks"));
  expect(addToTasksLink.className).toContain("bx--link--disabled");
});
