import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartNoteAmendmentSlider from "../components/DrugChartNoteAmendmentSlider";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import { IntlProvider } from "react-intl";
import { saveMedicationAmendmentNote } from "../utils/DrugChartUtils";

jest.mock("../utils/DrugChartUtils", () => ({
  saveMedicationAmendmentNote: jest.fn(),
}));

jest.mock("../../../i18n/I18nProvider", () => ({
  I18nProvider: ({ children }) => <div>{children}</div>,
}));

const mockHostData = {
  drugName: "Paracetamol",
  dosageInfo: "500 mg - Oral",
  scheduledTime: "22 Nov 2025 | 14:00",
  performerName: "Dr. Smith",
  existingNotes: "Patient took medication after meal",
  notes: [{ text: "Patient took medication after meal" }],
  amendedNotes: null,
  medicationAdministrationNoteUUID: "note-uuid-123",
  slot: {
    medicationAdministration: {
      providers: [{ uuid: "provider-uuid-456" }],
    },
  },
};

const mockHostDataWithAmendedNotes = {
  ...mockHostData,
  amendedNotes: [
    {
      amendedText: "Patient took medication before meal",
      amendedReason: "Incorrect Time",
    },
  ],
};

const mockHostApi = {
  onModalSave: jest.fn(),
  onModalCancel: jest.fn(),
  onModalClose: jest.fn(),
};

const mockConfig = {
  drugChartNoteAmendment: {
    amendmentReasons: [
      "Incorrect Time",
      "Incorrect Dose",
      "Incorrect Unit",
      "Other (Please mention the reason in notes)",
    ],
  },
};

const mockSliderContext = {
  setSliderContentModified: jest.fn(),
};

const renderComponent = (hostData = mockHostData, config = mockConfig) => {
  return render(
    <IntlProvider locale="en">
      <IPDContext.Provider value={{ config, handleAuditEvent: jest.fn() }}>
        <SliderContext.Provider value={mockSliderContext}>
          <DrugChartNoteAmendmentSlider
            hostData={hostData}
            hostApi={mockHostApi}
          />
        </SliderContext.Provider>
      </IPDContext.Provider>
    </IntlProvider>
  );
};

describe("DrugChartNoteAmendmentSlider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the slider with sidebar panel", () => {
      renderComponent();
      expect(screen.getByText("Amendment Note(s)")).toBeInTheDocument();
    });

    it("should display drug name", () => {
      renderComponent();
      expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    });

    it("should display dosage info", () => {
      renderComponent();
      expect(screen.getByText("500 mg - Oral")).toBeInTheDocument();
    });

    it("should render amendment reason dropdown", () => {
      renderComponent();
      expect(screen.getByTestId("amendment-reason-select")).toBeInTheDocument();
    });

    it("should render amendment notes textarea", () => {
      renderComponent();
      expect(screen.getByTestId("amendment-notes")).toBeInTheDocument();
    });

    it("should show original note tile", () => {
      renderComponent();
      expect(
        screen.getByText("Patient took medication after meal")
      ).toBeInTheDocument();
    });

    it("should show amended note tile when amendedNotes exist", () => {
      renderComponent(mockHostDataWithAmendedNotes);
      expect(
        screen.getByText("Patient took medication before meal")
      ).toBeInTheDocument();
      expect(screen.getByText("Amended")).toBeInTheDocument();
    });

    it("should not show amended note tile when amendedNotes is null", () => {
      renderComponent(mockHostData);
      const amendedNoteText = screen.queryByText(
        "Patient took medication before meal"
      );
      expect(amendedNoteText).not.toBeInTheDocument();
    });
  });

  describe("Amendment Reasons", () => {
    it("should render all default amendment reasons in dropdown", () => {
      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      fireEvent.click(select);

      expect(screen.getByText("Incorrect Time")).toBeInTheDocument();
      expect(screen.getByText("Incorrect Dose")).toBeInTheDocument();
      expect(screen.getByText("Incorrect Unit")).toBeInTheDocument();
      expect(
        screen.getByText("Other (Please mention the reason in notes)")
      ).toBeInTheDocument();
    });

    it("should use default reasons when config is not provided", () => {
      const emptyConfig = {};
      renderComponent(mockHostData, emptyConfig);
      const select = screen.getByTestId("amendment-reason-select");
      fireEvent.click(select);

      expect(screen.getByText("Incorrect Time")).toBeInTheDocument();
      expect(screen.getByText("Incorrect Dose")).toBeInTheDocument();
    });

    it("should use custom reasons from config when provided", () => {
      const customConfig = {
        drugChartNoteAmendment: {
          amendmentReasons: ["Custom Reason 1", "Custom Reason 2"],
        },
      };
      renderComponent(mockHostData, customConfig);
      const select = screen.getByTestId("amendment-reason-select");
      fireEvent.click(select);

      expect(screen.getByText("Custom Reason 1")).toBeInTheDocument();
      expect(screen.getByText("Custom Reason 2")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should have save button disabled initially", () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /save/i });

      expect(saveButton).toBeDisabled();
    });

    it("should keep save button disabled when only reason is filled", () => {
      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });

      expect(saveButton).toBeDisabled();
    });

    it("should keep save button disabled when only notes are filled", () => {
      renderComponent();
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(textarea, { target: { value: "Test notes" } });

      expect(saveButton).toBeDisabled();
    });

    it("should enable save button when both reason and notes are filled", () => {
      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, { target: { value: "Test notes" } });

      expect(saveButton).not.toBeDisabled();
    });
  });

  describe("Save Functionality", () => {
    it("should call saveMedicationAmendmentNote with correct data on save", async () => {
      saveMedicationAmendmentNote.mockResolvedValueOnce({});

      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, {
        target: { value: "Corrected administration time" },
      });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveMedicationAmendmentNote).toHaveBeenCalledWith({
          noteUuid: "note-uuid-123",
          amendedReason: "Incorrect Time",
          amendedText: "Corrected administration time",
          amendedByUuid: "provider-uuid-456",
        });
      });
    });

    it("should call hostApi.onModalSave after successful save", async () => {
      saveMedicationAmendmentNote.mockResolvedValueOnce({});

      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, { target: { value: "Test notes" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHostApi.onModalSave).toHaveBeenCalled();
      });
    });

    it("should disable save button while saving", async () => {
      saveMedicationAmendmentNote.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, { target: { value: "Test notes" } });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();

      await waitFor(() => {
        expect(mockHostApi.onModalSave).toHaveBeenCalled();
      });
    });

    it("should handle save errors gracefully", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      saveMedicationAmendmentNote.mockRejectedValueOnce(
        new Error("Save failed")
      );

      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, { target: { value: "Test notes" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error saving amendment:",
          expect.any(Error)
        );
      });

      expect(mockHostApi.onModalSave).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should re-enable save button after save error", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      saveMedicationAmendmentNote.mockRejectedValueOnce(
        new Error("Save failed")
      );

      renderComponent();
      const select = screen.getByTestId("amendment-reason-select");
      const textarea = screen.getByTestId("amendment-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(select, { target: { value: "Incorrect Time" } });
      fireEvent.change(textarea, { target: { value: "Test notes" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      expect(saveButton).not.toBeDisabled();

      consoleErrorSpy.mockRestore();
    });

    it("should not save when form is invalid", async () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(saveButton);

      expect(saveMedicationAmendmentNote).not.toHaveBeenCalled();
      expect(mockHostApi.onModalSave).not.toHaveBeenCalled();
    });
  });
});
