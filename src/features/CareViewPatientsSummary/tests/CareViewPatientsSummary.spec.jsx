import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { CareViewPatientsSummary } from "../components/CareViewPatientsSummary";
import { mockPatientsList } from "./CareViewPatientsSummaryMock";
import { CareViewContext } from "../../../context/CareViewContext";
import MockDate from "mockdate";
import { mockConfig } from "../../../utils/CommonUtils";
import {
  mockColumnData,
  mockSlotsData,
} from "../../CareViewSummary/tests/CareViewSummaryMock";
import "@testing-library/jest-dom/extend-expect";
import { IntlProvider } from "react-intl";

const mockContext = {
  careViewConfig: {
    timeframeLimitInHours: 2,
    enableNurseAcknowledgement: true,
  },
  ipdConfig: mockConfig,
};
const mockNavHourEpoch = {
  startHourEpoch: 1704110400,
  endHourEpoch: 1704117600,
};

const mockFilterValue = {
  id: "allTasks",
};
const mockGetSlotsForPatients = jest.fn();
const mockGetTasksForPatients = jest.fn();
const mockGetColumnData = jest.fn();
const mockCurrentShiftHoursArray = jest.fn();
const mockSetCurrentShiftTimes = jest.fn();
const mockGetPreviousShiftDetails = jest.fn();
const mockFetchBatchObservations = jest.fn();
const mockMapObservationsToInstructions = jest.fn();
const mockFetchAcknowledgedObsUuids = jest.fn();
jest.mock("../../CareViewSummary/utils/CareViewSummary", () => {
  return {
    getSlotsForPatients: () => mockGetSlotsForPatients(),
    getTasksForPatients: () => mockGetTasksForPatients(),
    getColumnData: () => mockGetColumnData(),
    getPreviousShiftDetails: () => mockGetPreviousShiftDetails(),
  };
});
jest.mock(
  "../../DisplayControls/CareInstructions/utils/CareInstructionsUtils",
  () => {
    return {
      fetchBatchObservations: (...args) => mockFetchBatchObservations(...args),
      mapObservationsToInstructions: (...args) =>
        mockMapObservationsToInstructions(...args),
      fetchAcknowledgedObservationUuids: (...args) =>
        mockFetchAcknowledgedObsUuids(...args),
      filterPreviousShiftInstructions: (instructions, shiftStartTime) => {
        return instructions.filter((instr) => instr.encounterDateTime < shiftStartTime);
      },
    };
  }
);

jest.mock("../../DisplayControls/DrugChart/utils/DrugChartUtils", () => {
  return {
    currentShiftHoursArray: () => mockCurrentShiftHoursArray(),
    setCurrentShiftTimes: (...args) => mockSetCurrentShiftTimes(...args),
  };
});

describe("CareViewPatientsSummary", () => {
  afterEach(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockDate.set("2023-01-01T12:00:00");
    mockGetSlotsForPatients.mockReturnValue(mockSlotsData);
    mockGetTasksForPatients.mockReturnValue([]);
    mockGetColumnData.mockReturnValue(mockColumnData);
    mockCurrentShiftHoursArray.mockReturnValue({
      currentShiftHoursArray: [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
      rangeArray: ["06:00-18:00", "18:00-06:00"],
      shiftIndex: 0,
    });
    mockSetCurrentShiftTimes.mockReturnValue([
      "1713234600000",
      "1713274200000",
    ]);
    mockGetPreviousShiftDetails.mockReturnValue({
      endDateTime: "1713234600000",
      previousShiftIndex: 1,
      startDateTime: "1713187800000",
    });
    mockFetchBatchObservations.mockResolvedValue([]);
    mockMapObservationsToInstructions.mockReturnValue([]);
    mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
  });

  it("should match snapshot", () => {
    const { container } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should fetch slot details on initial render", () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    expect(mockGetSlotsForPatients).toHaveBeenCalled();
  });

  it("renders table headers correctly", async () => {
    const { queryByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByTestId("slot-details-header-0")).toBeTruthy();
      expect(queryByTestId("time-frame-0")).toHaveTextContent("12:00");
      expect(queryByTestId("time-frame-1")).toHaveTextContent("13:00");
      expect(queryByTestId("time-frame-2")).toBeNull();
    });
  });

  it("renders patient details correctly", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("PT51140")).toBeTruthy();
      expect(
        queryByText("AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu")
      ).toBeTruthy();
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("13 Years, 6 Months, 19 Days")).toBeTruthy();
    });
  });

  it("renders slot details correctly", async () => {
    const { queryAllByText, queryAllByTestId } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(
        queryAllByText("Amoxicillin/Clavulanic Acid 1000 mg Tablet")
      ).toBeTruthy();
      expect(queryAllByTestId("drug-details")[0]).toHaveTextContent(
        "2Tablet(s) | Oral"
      );
    });
  });

  it("should new medications notification be present under patient details", async () => {
    render(
      <IntlProvider locale="en">
        <CareViewContext.Provider value={mockContext}>
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );
    const careViewPatientDetails = screen.getAllByText(/New Medication/i);
    expect(careViewPatientDetails.length).toBe(1);
  });

  it("should filter patients when NEW filter is selected", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "NEW" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      // PT49722 has newTreatments: 1 — should be visible
      expect(queryByText("C-1")).toBeTruthy();
      // PT51140 has newTreatments: 0 — should be hidden
      expect(queryByText("A-6")).toBeFalsy();
    });
  });

  it("should show all patients when ALL filter is selected", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "ALL" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("C-1")).toBeTruthy();
    });
  });

  it("should filter patients when PENDING filter is selected", async () => {
    // First getTasksForPatients call is fetchPreviousShiftTasks — PT51140 (A-6) has a pending task
    // Second call is fetchTasks (current shift) — returns empty
    mockGetTasksForPatients
      .mockReturnValueOnce([
        {
          patientUuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798", // PT51140, bed A-6
          tasks: [
            {
              taskType: { display: "nursing_activity_system" },
              status: "REQUESTED",
              name: "Blood Pressure",
              uuid: "task-uuid-pending-1",
            },
          ],
        },
        {
          patientUuid: "7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7", // PT49722, bed C-1
          tasks: [],
        },
      ])
      .mockReturnValueOnce([]);

    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{ ...mockContext, taskFilterType: "PENDING" }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      // PT51140 has a pending nursing task — should be visible
      expect(queryByText("A-6")).toBeTruthy();
      // PT49722 has no pending tasks — should be hidden
      expect(queryByText("C-1")).toBeFalsy();
    });
  });

  it("should show all patients when enableNurseAcknowledgement is false regardless of filter", async () => {
    const { queryByText } = render(
      <IntlProvider locale="en">
        <CareViewContext.Provider
          value={{
            ...mockContext,
            careViewConfig: {
              timeframeLimitInHours: 2,
              enableNurseAcknowledgement: false,
            },
            taskFilterType: "NEW",
          }}
        >
          <CareViewPatientsSummary
            patientsSummary={mockPatientsList.admittedPatients}
            navHourEpoch={mockNavHourEpoch}
            filterValue={mockFilterValue}
          />
        </CareViewContext.Provider>
      </IntlProvider>
    );

    await waitFor(() => {
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("C-1")).toBeTruthy();
    });
  });

  describe("fetchCareInstructions", () => {
    const ciFormConcepts = [
      {
        formName: "CI Form",
        concepts: ["Instruction Concept A", "Instruction Concept B"],
      },
    ];

    const mockContextWithCI = {
      ...mockContext,
      ipdConfig: {
        ...mockConfig,
        sections: [
          ...mockConfig.sections,
          {
            title: "Care Instructions",
            componentKey: "CI",
            config: { formConcepts: ciFormConcepts },
          },
        ],
      },
    };

    it("should fetch care instructions counts and store them keyed by visitUuid", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const visitUuid2 = "626b822d-741e-4a86-95ff-636eea753c2c";
      const visitUuid3 = "627b822d-741e-4a96-45ff-626eea753c4c";
      const mockObservations1 = [{ encounterUuid: "enc-1" }];
      const mockObservations2 = [
        { encounterUuid: "enc-2" },
        { encounterUuid: "enc-3" },
      ];

      mockFetchBatchObservations.mockResolvedValue([
        { visitUuid: visitUuid1, observations: mockObservations1 },
        { visitUuid: visitUuid2, observations: mockObservations2 },
      ]);

      mockMapObservationsToInstructions
        .mockReturnValueOnce([{ instruction: "Do X" }])
        .mockReturnValueOnce([
          { instruction: "Do Y" },
          { instruction: "Do Z" },
        ]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchBatchObservations).toHaveBeenCalledWith(
          [visitUuid1, visitUuid2, visitUuid3],
          ["Instruction Concept A", "Instruction Concept B"]
        );
        expect(mockMapObservationsToInstructions).toHaveBeenCalledWith(
          mockObservations1,
          ciFormConcepts
        );
        expect(mockMapObservationsToInstructions).toHaveBeenCalledWith(
          mockObservations2,
          ciFormConcepts
        );
      });
    });

    it("should not call fetchBatchObservations when CI section has no formConcepts", async () => {
      const contextWithEmptyCI = {
        ...mockContext,
        ipdConfig: {
          ...mockConfig,
          sections: [
            ...mockConfig.sections,
            {
              title: "Care Instructions",
              componentKey: "CI",
              config: { formConcepts: [] },
            },
          ],
        },
      };

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={contextWithEmptyCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchBatchObservations).not.toHaveBeenCalled();
      });
    });

    it("should not call fetchBatchObservations when there is no CI section in ipdConfig", async () => {
      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContext}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchBatchObservations).not.toHaveBeenCalled();
      });
    });

    it("should handle empty batch response gracefully", async () => {
      mockFetchBatchObservations.mockResolvedValue([]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchBatchObservations).toHaveBeenCalled();
        expect(mockMapObservationsToInstructions).not.toHaveBeenCalled();
      });
    });

    it("should display only not-acknowledged care instruction count", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const obsUuid1 = "obs-uuid-1";
      const obsUuid2 = "obs-uuid-2";

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [{ uuid: obsUuid1 }, { uuid: obsUuid2 }],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        { observationUuid: obsUuid1, instruction: "Do X" },
        { observationUuid: obsUuid2, instruction: "Do Y" },
      ]);

      // obsUuid1 is acknowledged, obsUuid2 is not
      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set([obsUuid1]));

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchAcknowledgedObsUuids).toHaveBeenCalledWith([
          obsUuid1,
          obsUuid2,
        ]);
        // only the 1 not-acknowledged instruction should show the notification
        const notifications = screen.queryAllByTestId(
          "new-care-instructions-notification"
        );
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toHaveTextContent("1");
      });
    });

    it("should not show care instructions notification when all are acknowledged", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const obsUuid1 = "obs-uuid-1";

      mockFetchBatchObservations.mockResolvedValue([
        { visitUuid: visitUuid1, observations: [{ uuid: obsUuid1 }] },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        { observationUuid: obsUuid1, instruction: "Do X" },
      ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set([obsUuid1]));

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchAcknowledgedObsUuids).toHaveBeenCalledWith([obsUuid1]);
        expect(
          screen.queryByTestId("new-care-instructions-notification")
        ).toBeNull();
      });
    });

    it("should not call fetchAcknowledgedObservationUuids when all instructions have no observationUuid", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";

      mockFetchBatchObservations.mockResolvedValue([
        { visitUuid: visitUuid1, observations: [{}] },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        { instruction: "No UUID instruction" },
      ]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchAcknowledgedObsUuids).not.toHaveBeenCalled();
      });
    });

    it("should isolate acknowledgement filtering per patient — Patient A's ack should not affect Patient B's count", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const visitUuid2 = "626b822d-741e-4a86-95ff-636eea753c2c";
      const obsUuid1 = "obs-uuid-p1-1";
      const obsUuid2 = "obs-uuid-p1-2";
      const obsUuid3 = "obs-uuid-p2-1";

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [{ uuid: obsUuid1 }, { uuid: obsUuid2 }],
        },
        {
          visitUuid: visitUuid2,
          observations: [{ uuid: obsUuid3 }],
        },
      ]);

      mockMapObservationsToInstructions
        .mockReturnValueOnce([
          { observationUuid: obsUuid1, instruction: "P1 instruction A" },
          { observationUuid: obsUuid2, instruction: "P1 instruction B" },
        ])
        .mockReturnValueOnce([
          { observationUuid: obsUuid3, instruction: "P2 instruction A" },
        ]);

      // Patient 1: obsUuid1 acknowledged, obsUuid2 not → count 1
      // Patient 2: none acknowledged → count 1
      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set([obsUuid1]));

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchAcknowledgedObsUuids).toHaveBeenCalledWith([
          obsUuid1,
          obsUuid2,
          obsUuid3,
        ]);
        const notifications = screen.queryAllByTestId(
          "new-care-instructions-notification"
        );
        expect(notifications.length).toBe(2);
        notifications.forEach((n) => expect(n).toHaveTextContent("1"));
      });
    });

    it("should show all instructions when fetchAcknowledgedObservationUuids fails", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const obsUuid1 = "obs-uuid-1";
      const obsUuid2 = "obs-uuid-2";

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [{ uuid: obsUuid1 }, { uuid: obsUuid2 }],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        { observationUuid: obsUuid1, instruction: "Do X" },
        { observationUuid: obsUuid2, instruction: "Do Y" },
      ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        const notifications = screen.queryAllByTestId(
          "new-care-instructions-notification"
        );
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toHaveTextContent("2");
      });
    });

    it("should not call fetchAcknowledgedObservationUuids when enableNurseAcknowledgement is false", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [{ uuid: "obs-uuid-1" }],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        { observationUuid: "obs-uuid-1", instruction: "Do X" },
      ]);

      const contextWithAckDisabled = {
        ...mockContextWithCI,
        careViewConfig: {
          ...mockContextWithCI.careViewConfig,
          enableNurseAcknowledgement: false,
        },
      };

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={contextWithAckDisabled}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockFetchAcknowledgedObsUuids).not.toHaveBeenCalled();
      });
    });

    it("should calculate and store previous shift care instructions separately", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const currentShiftStartTime = 1713234600000;
      const previousShiftTime = 1713187800000; // before current shift

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [
            { uuid: "obs-prev", encounterDateTime: previousShiftTime },
            { uuid: "obs-curr", encounterDateTime: 1713270000000 },
          ],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        {
          observationUuid: "obs-prev",
          instruction: "NPO",
          encounterDateTime: previousShiftTime,
        },
        {
          observationUuid: "obs-curr",
          instruction: "Monitor",
          encounterDateTime: 1713270000000,
        },
      ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
      mockSetCurrentShiftTimes.mockReturnValue([currentShiftStartTime, 1713274200000]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(mockSetCurrentShiftTimes).toHaveBeenCalled();
      });
    });

    it("should not show previous shift care instructions notification when all instructions are from current shift", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const currentShiftStartTime = 1713234600000;

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [
            { uuid: "obs-curr-1", encounterDateTime: 1713270000000 },
            { uuid: "obs-curr-2", encounterDateTime: 1713280000000 },
          ],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        {
          observationUuid: "obs-curr-1",
          instruction: "Monitor",
          encounterDateTime: 1713270000000,
        },
        {
          observationUuid: "obs-curr-2",
          instruction: "Check vitals",
          encounterDateTime: 1713280000000,
        },
      ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
      mockSetCurrentShiftTimes.mockReturnValue([currentShiftStartTime, 1713274200000]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("previous-shift-care-instructions-notification")
        ).toBeNull();
      });
    });

    it("should show previous shift care instructions notification when count > 0", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const currentShiftStartTime = 1713234600000;
      const previousShiftTime = 1713187800000;

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [
            { uuid: "obs-prev-1", encounterDateTime: previousShiftTime },
            { uuid: "obs-prev-2", encounterDateTime: previousShiftTime + 3600000 },
            { uuid: "obs-curr", encounterDateTime: 1713270000000 },
          ],
        },
      ]);

      mockMapObservationsToInstructions.mockReturnValue([
        {
          observationUuid: "obs-prev-1",
          instruction: "NPO",
          encounterDateTime: previousShiftTime,
        },
        {
          observationUuid: "obs-prev-2",
          instruction: "Bed rest",
          encounterDateTime: previousShiftTime + 3600000,
        },
        {
          observationUuid: "obs-curr",
          instruction: "Monitor",
          encounterDateTime: 1713270000000,
        },
      ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
      mockSetCurrentShiftTimes.mockReturnValue([currentShiftStartTime, 1713274200000]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        const notification = screen.queryByTestId(
          "previous-shift-care-instructions-notification"
        );
        expect(notification).toBeTruthy();
        expect(notification).toHaveTextContent(/(Includes 2 from Previous Shift)/);
      });
    });

    it("should handle multiple patients with different previous shift instruction counts", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const visitUuid2 = "626b822d-741e-4a86-95ff-636eea753c2c";
      const currentShiftStartTime = 1713234600000;
      const previousShiftTime = 1713187800000;

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [
            { uuid: "obs-p1-prev", encounterDateTime: previousShiftTime },
          ],
        },
        {
          visitUuid: visitUuid2,
          observations: [
            { uuid: "obs-p2-prev-1", encounterDateTime: previousShiftTime },
            { uuid: "obs-p2-prev-2", encounterDateTime: previousShiftTime + 3600000 },
            { uuid: "obs-p2-prev-3", encounterDateTime: previousShiftTime + 7200000 },
          ],
        },
      ]);

      mockMapObservationsToInstructions
        .mockReturnValueOnce([
          {
            observationUuid: "obs-p1-prev",
            instruction: "NPO",
            encounterDateTime: previousShiftTime,
          },
        ])
        .mockReturnValueOnce([
          {
            observationUuid: "obs-p2-prev-1",
            instruction: "NPO",
            encounterDateTime: previousShiftTime,
          },
          {
            observationUuid: "obs-p2-prev-2",
            instruction: "Bed rest",
            encounterDateTime: previousShiftTime + 3600000,
          },
          {
            observationUuid: "obs-p2-prev-3",
            instruction: "Monitor",
            encounterDateTime: previousShiftTime + 7200000,
          },
        ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
      mockSetCurrentShiftTimes.mockReturnValue([currentShiftStartTime, 1713274200000]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        const notifications = screen.queryAllByTestId(
          "previous-shift-care-instructions-notification"
        );
        expect(notifications.length).toBe(2);
      });
    });

    it("should isolate previous shift filtering per patient — Patient A's previous shift should not affect Patient B", async () => {
      const visitUuid1 = "626b822d-741e-4a86-95ff-626eea753c4c";
      const visitUuid2 = "626b822d-741e-4a86-95ff-636eea753c2c";
      const currentShiftStartTime = 1713234600000;
      const previousShiftTime = 1713187800000;

      mockFetchBatchObservations.mockResolvedValue([
        {
          visitUuid: visitUuid1,
          observations: [
            { uuid: "obs-p1-prev", encounterDateTime: previousShiftTime },
          ],
        },
        {
          visitUuid: visitUuid2,
          observations: [
            { uuid: "obs-p2-curr", encounterDateTime: 1713270000000 },
          ],
        },
      ]);

      mockMapObservationsToInstructions
        .mockReturnValueOnce([
          {
            observationUuid: "obs-p1-prev",
            instruction: "NPO",
            encounterDateTime: previousShiftTime,
          },
        ])
        .mockReturnValueOnce([
          {
            observationUuid: "obs-p2-curr",
            instruction: "Monitor",
            encounterDateTime: 1713270000000,
          },
        ]);

      mockFetchAcknowledgedObsUuids.mockResolvedValue(new Set());
      mockSetCurrentShiftTimes.mockReturnValue([currentShiftStartTime, 1713274200000]);

      render(
        <IntlProvider locale="en">
          <CareViewContext.Provider value={mockContextWithCI}>
            <CareViewPatientsSummary
              patientsSummary={mockPatientsList.admittedPatients}
              navHourEpoch={mockNavHourEpoch}
              filterValue={mockFilterValue}
            />
          </CareViewContext.Provider>
        </IntlProvider>
      );

      await waitFor(() => {
        const notifications = screen.queryAllByTestId(
          "previous-shift-care-instructions-notification"
        );
        // Only Patient A should have the notification
        expect(notifications.length).toBe(1);
      });
    });
  });
});
