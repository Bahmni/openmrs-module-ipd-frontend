import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { IntlProvider } from "react-intl";
import PatientMovementModal from "../components/PatientMovementModal";
import {
  byFullySpecifiedNameForDispoistionMockData,
  byFullySpecifiedNameForAdtNotesMockData,
  visitSummaryToAdmitMockData,
  visitSummaryToDischargeOrTransferMockData,
  visitSummaryToUndoDischargeMockData,
  vistAndEncounterTypesMockData,
  patientResponseData,
} from "./PatientMovementModalMockData";
import { IPDContext } from "../../../../context/IPDContext";

// Mock i18n messages for testing
const messages = {
  ADMIT_PATIENT: "Admit Patient",
  DISCHARGE_PATIENT: "Discharge Patient",
  TRANSFER_PATIENT: "Transfer Patient",
  UNDO_DISCHARGE: "Undo Discharge",
  PATIENT_MOVEMENT: "Patient Movement",
  SAVE: "Save",
  CANCEL: "Cancel",
  CHOOSE_AN_OPTION: "Choose an option",
  ENTER_ADT_NOTES: "Enter ADT Notes"
};

const TestWrapper = ({ children }) => (
  <IntlProvider locale="en" messages={messages}>
    {children}
  </IntlProvider>
);

const mockSearchConceptsByFSN = jest.fn();
const mockFetchVisitSummary = jest.fn();
const mockFetchVisitEncounterOrderTypes = jest.fn();
const updatePatientMovementModalMock = jest.fn();

const patientMock = { uuid: "patientMockUuid" };
const visitMock = "visitMockUuid";
const locationMock = "locationMockUuid";
const providerMock = "providerMockUuid";

// Mock modules
jest.mock("../../../../utils/CommonUtils", () => {
  const originalCommonModule = jest.requireActual("../../../../utils/CommonUtils");
  return {
    ...originalCommonModule,
    searchConceptsByFSN: () => mockSearchConceptsByFSN(),
    fetchVisitSummary: () => mockFetchVisitSummary(),
    fetchVisitEncounterOrderTypes: () => mockFetchVisitEncounterOrderTypes(),
    getADTDashboardUrl: jest.fn(() => "mock-url"),
  };
});

describe("PatientMovementModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchConceptsByFSN.mockResolvedValue(byFullySpecifiedNameForDispoistionMockData);
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToAdmitMockData);
    mockFetchVisitEncounterOrderTypes.mockResolvedValue(vistAndEncounterTypesMockData);
    
    // Mock concept search for ADT notes
    mockSearchConceptsByFSN.mockImplementation((by, fsn, type) => {
      if (fsn === "ADT Notes") {
        return Promise.resolve(byFullySpecifiedNameForAdtNotesMockData);
      }
      return Promise.resolve(byFullySpecifiedNameForDispoistionMockData);
    });
  });

  const renderComponent = () => {
    return render(
      <TestWrapper>
        <IPDContext.Provider
          value={{
            patient: patientMock,
            visit: visitMock,
            location: locationMock,
            provider: providerMock,
          }}
        >
          <PatientMovementModal updatePatientMovementModal={updatePatientMovementModalMock} />
        </IPDContext.Provider>
      </TestWrapper>
    );
  };

  describe("Component Rendering", () => {
    it("should render modal header correctly", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeInTheDocument();
      });

      expect(screen.getByText("Save")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("should show dropdown after data loads", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Choose an option/i })).toBeInTheDocument();
      });
    });

    it("should render ADT notes field", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter ADT Notes")).toBeInTheDocument();
      });
    });

    it("should have save button disabled initially", async () => {
      renderComponent();

      await waitFor(() => {
        const saveButton = screen.getByText("Save");
        expect(saveButton).toHaveAttribute("disabled");
      });
    });
  });

  describe("Modal Interaction", () => {
    it("should close modal when close button is clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const closeButton = screen.getByLabelText("close");
        fireEvent.click(closeButton);
        expect(updatePatientMovementModalMock).toHaveBeenCalledWith(false);
      });
    });

    it("should close modal when cancel button is clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(updatePatientMovementModalMock).toHaveBeenCalledWith(false);
      });
    });

    it("should update ADT notes when user types", async () => {
      renderComponent();

      await waitFor(() => {
        const notesField = screen.getByPlaceholderText("Enter ADT Notes");
        fireEvent.change(notesField, { target: { value: "Test notes" } });
        expect(notesField.value).toBe("Test notes");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper accessibility attributes", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Choose an option/i })).toBeInTheDocument();
      });
    });
  });

  describe("Different Visit States", () => {
    it("should handle discharge/transfer state", async () => {
      mockFetchVisitSummary.mockResolvedValue(visitSummaryToDischargeOrTransferMockData);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Choose an option/i })).toBeInTheDocument();
      });
    });

    it("should handle undo discharge state", async () => {
      mockFetchVisitSummary.mockResolvedValue(visitSummaryToUndoDischargeMockData);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Choose an option/i })).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors gracefully", async () => {
      mockFetchVisitSummary.mockRejectedValue(new Error("Network error"));
      
      renderComponent();
      
      // Component should still render the modal structure
      await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeInTheDocument();
      });
    });
  });
});
