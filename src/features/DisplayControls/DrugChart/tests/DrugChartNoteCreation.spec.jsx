import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DrugChartNoteCreation from "../components/DrugChartNoteCreation";
import { IntlProvider } from "react-intl";
const messages = {
  AMENDMENT_REASON: "Reason",
  AMENDMENT_NOTES: "Notes",
  REASON_REQUIRED: "Reason is required",
  NOTE_REQUIRED: "Notes are required",
  SELECT_REASON: "Select a reason",
  ENTER_NOTES: "Enter Notes",
};

// eslint-disable-next-line react/prop-types
const I18nProvider = ({ children }) => (
  <IntlProvider locale="en" messages={messages} defaultLocale="en">
    {children}
  </IntlProvider>
);

jest.mock("../../../i18n/I18nProvider", () => ({ I18nProvider }));

describe("DrugChartNoteCreation", () => {
  const mockOnReasonChange = jest.fn();
  const mockOnNotesChange = jest.fn();

  // Shape matches what fetchAmendmentReasons() returns after mapping the FHIR
  // ValueSet $expand response: [{ uuid: item.code, display: item.display }].
  const defaultProps = {
    amendmentReasons: [
      { uuid: "reason-uuid-1", display: "Incorrect Time" },
      { uuid: "reason-uuid-2", display: "Incorrect Dose" },
    ],
    amendmentReason: "",
    amendmentNotes: "",
    isSaveDisabled: true,
    onReasonChange: mockOnReasonChange,
    onNotesChange: mockOnNotesChange,
  };
  it("renders the select dropdown with options", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    expect(screen.getByTestId("note-reason-select")).toBeInTheDocument();
    expect(screen.getByText("Select a reason")).toBeInTheDocument();
    expect(screen.getByText("Incorrect Time")).toBeInTheDocument();
    expect(screen.getByText("Incorrect Dose")).toBeInTheDocument();
  });

  it("renders no reason options when amendmentReasons is empty", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} amendmentReasons={[]} />
      </I18nProvider>
    );
    expect(screen.getByTestId("note-reason-select")).toBeInTheDocument();
    expect(screen.getByText("Select a reason")).toBeInTheDocument();
    expect(screen.queryByText("Incorrect Time")).not.toBeInTheDocument();
  });

  it("uses reason.uuid as the option value and reason.display as the visible text", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    const option = screen.getByText("Incorrect Time").closest("option");
    expect(option).toHaveValue("reason-uuid-1");
  });

  it("renders the textarea with placeholder", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    expect(screen.getByTestId("new-note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Notes")).toBeInTheDocument();
  });

  it("displays invalid text when reason is not selected and save is disabled", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.blur(screen.getByTestId("note-reason-select"));
    expect(screen.getByText("Reason is required")).toBeInTheDocument();
  });

  it("displays invalid text when notes are empty and save is disabled", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.blur(screen.getByTestId("new-note"));
    expect(screen.getByText("Notes are required")).toBeInTheDocument();
  });

  it("calls onReasonChange when a reason is selected", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.change(screen.getByTestId("note-reason-select"), {
      target: { value: "reason-uuid-1" },
    });
    expect(mockOnReasonChange).toHaveBeenCalledWith(expect.anything());
  });

  it("calls onNotesChange when notes are entered", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.change(screen.getByTestId("new-note"), {
      target: { value: "New note" },
    });
    expect(mockOnNotesChange).toHaveBeenCalledWith(expect.anything());
  });

  it("does not display invalid text when reason and notes are valid", () => {
    render(
      <I18nProvider>
        <DrugChartNoteCreation
          {...defaultProps}
          amendmentReason="reason-uuid-1"
          amendmentNotes="Some notes"
          isSaveDisabled={false}
        />
      </I18nProvider>
    );
    expect(screen.queryByText("Reason is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Notes are required")).not.toBeInTheDocument();
  });
});
