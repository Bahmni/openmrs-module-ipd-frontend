import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DrugChartNoteCreation from "../components/DrugChartNoteCreation";
import { IntlProvider } from "react-intl";
const messages = {
  AMENDMENT_REASON: "Reason",
  AMENDMENT_NOTES: "Notes",
  "Reason is required": "Reason is required",
  "notes are required": "notes are required",
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

  const defaultProps = {
    amendmentReasons: ["Reason 1", "Reason 2"],
    amendmentReason: "",
    amendmentNotes: "",
    isSaveDisabled: true,
    onReasonChange: mockOnReasonChange,
    onNotesChange: mockOnNotesChange,
  };

  it("renders the select dropdown with options", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    expect(screen.getByTestId("note-reason-select")).toBeInTheDocument();
    expect(screen.getByText("Select a reason")).toBeInTheDocument();
    expect(screen.getByText("Reason 1")).toBeInTheDocument();
    expect(screen.getByText("Reason 2")).toBeInTheDocument();
  });

  it("renders the textarea with placeholder", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    expect(screen.getByTestId("new-note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Notes")).toBeInTheDocument();
  });

  it("displays invalid text when reason is not selected and save is disabled", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    fireEvent.blur(screen.getByTestId("note-reason-select"));
    expect(screen.getByText("Reason is required")).toBeInTheDocument();
  });

  it("displays invalid text when notes are empty and save is disabled", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    fireEvent.blur(screen.getByTestId("new-note"));
    expect(screen.getByText("Notes are required")).toBeInTheDocument();
  });

  it("calls onReasonChange when a reason is selected", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    fireEvent.change(screen.getByTestId("note-reason-select"), {
      target: { value: "Reason 1" },
    });
    expect(mockOnReasonChange).toHaveBeenCalledWith(expect.anything());
  });

  it("calls onNotesChange when notes are entered", () => {
    render(<DrugChartNoteCreation {...defaultProps} />);
    fireEvent.change(screen.getByTestId("new-note"), {
      target: { value: "New note" },
    });
    expect(mockOnNotesChange).toHaveBeenCalledWith(expect.anything());
  });

  it("does not display invalid text when reason and notes are valid", () => {
    render(
      <DrugChartNoteCreation
        {...defaultProps}
        amendmentReason="Reason 1"
        amendmentNotes="Some notes"
        isSaveDisabled={false}
      />
    );
    expect(screen.queryByText("Reason is required")).not.toBeInTheDocument();
    expect(screen.queryByText("Notes are required")).not.toBeInTheDocument();
  });
});
