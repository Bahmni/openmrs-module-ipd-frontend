import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { CareViewContext } from "../../../context/CareViewContext";
import { mockConfig } from "../../../utils/CommonUtils";
import "@testing-library/jest-dom/extend-expect";
import { PatientDetailsCell } from "../components/PatientDetailsCell";
import {
  mockParticipantData,
  mockPatientsList,
} from "./CareViewPatientsSummaryMock";

const mockHandleRefreshPatientList = jest.fn();

const mockContext = {
  careViewConfig: { timeframeLimitInHours: 2 },
  ipdConfig: mockConfig,
  provider: {
    uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
  },
  handleRefreshPatientList: mockHandleRefreshPatientList,
};

const mockBookmarkPatient = jest.fn();
const mockGetCurrentShiftTimes = jest.fn();

jest.mock("../../CareViewPatients/utils/CareViewPatientsUtils", () => ({
  bookmarkPatient: (payload) => mockBookmarkPatient(payload),
}));

jest.mock("../../../utils/DateTimeUtils", () => ({
  getCurrentShiftTimes: () => mockGetCurrentShiftTimes(),
}));

describe("PatientDetailsCell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCurrentShiftTimes.mockReturnValue({
      startDateTime: 1710662400,
      endDateTime: 1710702000,
    });
    mockBookmarkPatient.mockResolvedValue(mockParticipantData);
  });

  it("should render patientDetailsCell component", () => {
    const { container } = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[0].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[0].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[0].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1672575400,
            endHourEpoch: 1710511200,
          }}
        />
      </CareViewContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders patient details correctly", async () => {
    const { queryByText } = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[0].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[0].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[0].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1672575400,
            endHourEpoch: 1710511200,
          }}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(queryByText("PT51140")).toBeTruthy();
      expect(
        queryByText("AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu")
      ).toBeTruthy();
      expect(queryByText("A-6")).toBeTruthy();
      expect(queryByText("14")).toBeTruthy();
    });
  });

  it("should show nurse name only if a nurse bookmarks a patient within the current shift", async () => {
    const container = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[0].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[0].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[0].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1710509100,
            endHourEpoch: 1710511200,
          }}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
      expect(container.queryByTestId("bookmark-filled-icon")).toBeTruthy();
      expect(container.queryByText("Nurse:")).toBeTruthy();
      expect(container.queryByText("Super Man")).toBeTruthy();
    });
  });

  it("should not show nurse name if the current time crossed the shift endTime", async () => {
    const container = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[0].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[0].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[0].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1710509500,
            endHourEpoch: 1710609500,
          }}
        />
      </CareViewContext.Provider>
    );

    await waitFor(() => {
      expect(container).toMatchSnapshot();
      expect(container.queryByTestId("bookmark-add-icon")).toBeTruthy();
      expect(container.queryByText("Nurse:")).toBeFalsy();
      expect(container.queryByText("Super Man")).toBeFalsy();
    });
  });

  it("should call bookmark api with correct payload on click of bookmark add icon", async () => {
    const container = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[1].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[1].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[1].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1710509100,
            endHourEpoch: 1710509100,
          }}
        />
      </CareViewContext.Provider>
    );

    fireEvent.click(container.queryByTestId("bookmark-add-icon"));

    await waitFor(() => {
      expect(container.queryByTestId("bookmark-filled-icon")).toBeTruthy();
      expect(mockBookmarkPatient).toHaveBeenCalledTimes(1);
      expect(mockBookmarkPatient).toHaveBeenCalledWith({
        careTeamParticipantsRequest: [
          {
            endTime: 1710702000,
            providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            startTime: 1710662400,
          },
        ],
        patientUuid: "7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7",
      });
    });
  });

  it("should call bookmark api with un bookmark payload on click of bookmark filled icon", async () => {
    const container = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[0].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[0].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[0].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1710509100,
            endHourEpoch: 1710511200,
          }}
        />
      </CareViewContext.Provider>
    );

    fireEvent.click(container.queryByTestId("bookmark-filled-icon"));

    await waitFor(() => {
      expect(container.queryByTestId("bookmark-filled-icon")).not.toHaveClass(
        "bookmark-disabled"
      );
      expect(mockBookmarkPatient).toHaveBeenCalledTimes(1);
      expect(mockBookmarkPatient).toHaveBeenCalledWith({
        careTeamParticipantsRequest: [
          {
            uuid: "fc4d7a50-da94-4266-980e-eced24a64533",
            voided: true,
          },
        ],
        patientUuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798",
      });
    });
  });

  it("should disable bookmark filled icon when the patient is already bookmarked by another nurse", async () => {
    const container = render(
      <CareViewContext.Provider value={mockContext}>
        <PatientDetailsCell
          patientDetails={mockPatientsList.admittedPatients[2].patientDetails}
          bedDetails={mockPatientsList.admittedPatients[2].bedDetails}
          careTeamDetails={mockPatientsList.admittedPatients[2].careTeam}
          newTreatments={1}
          visitDetails={{ uuid: "sderf908-3f10-11e4-adec-0800271c1b72" }}
          navHourEpoch={{
            startHourEpoch: 1710509100,
            endHourEpoch: 1710511200,
          }}
        />
      </CareViewContext.Provider>
    );

    fireEvent.click(container.queryByTestId("bookmark-filled-icon"));

    await waitFor(() => {
      expect(container.queryByTestId("bookmark-filled-icon")).toBeTruthy();
      expect(container.queryByTestId("bookmark-filled-icon")).toHaveClass(
        "bookmark-disabled"
      );
    });
  });
});
