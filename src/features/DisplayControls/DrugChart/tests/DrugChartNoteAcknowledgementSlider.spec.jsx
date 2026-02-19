import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DrugChartNoteAcknowledgementSlider from "../components/DrugChartNoteAcknowledgementSlider";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import { IntlProvider } from "react-intl";
import { saveMedicationAcknowledgementNote } from "../utils/DrugChartUtils";

jest.mock("../utils/DrugChartUtils", () => ({
  saveMedicationAcknowledgementNote: jest.fn(),
  canAcknowledgeAmendment: jest.fn(() => true),
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
  amendedNotes: [
    {
      amendedText: "Patient took medication before meal",
      amendedReason: "Incorrect Time",
    },
  ],
  medicationAdministrationNoteUUID: "note-uuid-123",
};

const mockHostApi = {
  onModalSave: jest.fn(),
  onModalCancel: jest.fn(),
  onModalClose: jest.fn(),
};

const mockSliderContext = {
  setSliderContentModified: jest.fn(),
};

const mockProvider = {
  uuid: "provider-uuid-456",
};

const renderComponent = (hostData = mockHostData) => {
  return render(
    <IntlProvider locale="en">
      <IPDContext.Provider value={{ provider: mockProvider, handleAuditEvent: jest.fn() }}>
        <SliderContext.Provider value={mockSliderContext}>
          <DrugChartNoteAcknowledgementSlider
            hostData={hostData}
            hostApi={mockHostApi}
          />
        </SliderContext.Provider>
      </IPDContext.Provider>
    </IntlProvider>
  );
};

describe("DrugChartNoteAcknowledgementSlider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("../utils/DrugChartUtils").canAcknowledgeAmendment.mockImplementation(() => true);
  });

  describe("Rendering", () => {
    it("should render the slider with sidebar panel", () => {
      renderComponent();
      expect(screen.getByText("Acknowledge Amend Note")).toBeInTheDocument();
    });

    it("should display drug name", () => {
      renderComponent();
      expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    });

    it("should display dosage info", () => {
      renderComponent();
      expect(screen.getByText("500 mg - Oral")).toBeInTheDocument();
    });

    it("should render acknowledge toggle when canAcknowledgeAmendment returns true", () => {
      require("../utils/DrugChartUtils").canAcknowledgeAmendment.mockImplementation(() => true);
      renderComponent();
      expect(screen.getByTestId("acknowledge-toggle")).toBeInTheDocument();
    });

    it("should NOT render acknowledge toggle when canAcknowledgeAmendment returns false", () => {
      require("../utils/DrugChartUtils").canAcknowledgeAmendment.mockImplementation(() => false);
      renderComponent();
      expect(screen.queryByTestId("acknowledge-toggle")).not.toBeInTheDocument();
    });

    it("should render acknowledgement notes textarea", () => {
      renderComponent();
      expect(screen.getByTestId("acknowledgement-notes")).toBeInTheDocument();
    });

    it("should show amended note tile", () => {
      renderComponent();
      expect(
        screen.getByText("Patient took medication before meal")
      ).toBeInTheDocument();
      expect(screen.getByText("Amended")).toBeInTheDocument();
    });

    it("should show original note tile", () => {
      renderComponent();
      expect(
        screen.getByText("Patient took medication after meal")
      ).toBeInTheDocument();
      expect(screen.getByText("Original")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should have save button disabled initially", () => {
      renderComponent();
      const saveButton = screen.getByRole("button", { name: /save/i });

      expect(saveButton).toBeDisabled();
    });

    it("should keep save button disabled when only acknowledgement notes are filled", () => {
      renderComponent();
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.change(textarea, { target: { value: "Acknowledged" } });

      expect(saveButton).toBeDisabled();
    });

    it("should keep save button disabled when only toggle is checked", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);

      expect(saveButton).toBeDisabled();
    });

    it("should enable save button when both toggle and notes are filled", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged and verified" } });

      expect(saveButton).not.toBeDisabled();
    });

    it("should show invalid text when notes are empty and save is attempted", async () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);

      expect(saveButton).toBeDisabled();
      expect(
        screen.queryByText("Acknowledgement notes are required")
      ).not.toBeInTheDocument();
    });

    it("should disable save button when notes are cleared after being filled", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Test notes" } });

      expect(saveButton).not.toBeDisabled();

      fireEvent.change(textarea, { target: { value: "" } });

      expect(saveButton).toBeDisabled();
    });
  });

  describe("Toggle Functionality", () => {
    it("should handle toggle change", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");

      fireEvent.click(toggle);

      expect(mockSliderContext.setSliderContentModified).toHaveBeenCalled();
    });

    it("should update slider content modified state on toggle change", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");

      fireEvent.click(toggle);

      expect(mockSliderContext.setSliderContentModified).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  describe("Notes Input", () => {
    it("should handle notes input change", () => {
      renderComponent();
      const textarea = screen.getByTestId("acknowledgement-notes");

      fireEvent.change(textarea, { target: { value: "Reviewed and approved" } });

      expect(textarea).toHaveValue("Reviewed and approved");
    });

    it("should update slider content modified state on notes change", () => {
      renderComponent();
      const textarea = screen.getByTestId("acknowledgement-notes");

      fireEvent.change(textarea, { target: { value: "Test notes" } });

      expect(mockSliderContext.setSliderContentModified).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it("should trim whitespace in notes validation", () => {
      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "   " } });

      expect(saveButton).toBeDisabled();
    });
  });

  describe("Save Functionality", () => {
    it("should call saveMedicationAcknowledgementNote with correct data on save", async () => {
      saveMedicationAcknowledgementNote.mockResolvedValueOnce({});

      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged and verified" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveMedicationAcknowledgementNote).toHaveBeenCalledWith({
          noteUuid: "note-uuid-123",
          acknowledgementNotes: "Acknowledged and verified",
          acknowledgedByUuid: "provider-uuid-456",
        });
      });
    });

    it("should call hostApi.onModalSave after successful save", async () => {
      saveMedicationAcknowledgementNote.mockResolvedValueOnce({});

      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockHostApi.onModalSave).toHaveBeenCalled();
      });
    });

    it("should disable save button while saving", async () => {
      saveMedicationAcknowledgementNote.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged" } });
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
      saveMedicationAcknowledgementNote.mockRejectedValueOnce(
        new Error("Save failed")
      );

      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged" } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error saving acknowledgement:",
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
      saveMedicationAcknowledgementNote.mockRejectedValueOnce(
        new Error("Save failed")
      );

      renderComponent();
      const toggle = screen.getByTestId("acknowledge-toggle");
      const textarea = screen.getByTestId("acknowledgement-notes");
      const saveButton = screen.getByRole("button", { name: /save/i });

      fireEvent.click(toggle);
      fireEvent.change(textarea, { target: { value: "Acknowledged" } });
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

      expect(saveMedicationAcknowledgementNote).not.toHaveBeenCalled();
      expect(mockHostApi.onModalSave).not.toHaveBeenCalled();
    });
  });
});
