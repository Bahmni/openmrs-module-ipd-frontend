import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DrugChartNoteAmendment from "../components/DrugChartNoteAmendment";
import "@testing-library/jest-dom";
import { IntlProvider } from "react-intl";

const messages = {
  AMENDMENT_REASON: "Amendment Reason",
  AMENDMENT_NOTES: "Amendment Notes",
  "Amendment Reason is required": "Amendment Reason is required",
  "Amendment notes are required": "Amendment notes are required",
};

// eslint-disable-next-line react/prop-types
const I18nProvider = ({ children }) => (
  <IntlProvider locale="en" messages={messages} defaultLocale="en">
    {children}
  </IntlProvider>
);

jest.mock("../../../i18n/I18nProvider", () => ({ I18nProvider }));

describe("DrugChartNoteAmendment (presentational)", () => {
  const defaultProps = {
    amendmentReasons: ["Correction", "Update", "Other"],
    amendmentReason: "",
    amendmentNotes: "",
    isSaveDisabled: false,
    onReasonChange: jest.fn(),
    onNotesChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders amendment reason select and notes textarea", () => {
    render(<DrugChartNoteAmendment {...defaultProps} />);
    expect(screen.getByLabelText(/Amendment Reason/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amendment Notes/i)).toBeInTheDocument();
  });

  it("calls onReasonChange when select changes", () => {
    render(<DrugChartNoteAmendment {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Amendment Reason/i), {
      target: { value: "Correction" },
    });
    expect(defaultProps.onReasonChange).toHaveBeenCalled();
  });

  it("calls onNotesChange when textarea changes", () => {
    render(<DrugChartNoteAmendment {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Amendment Notes/i), {
      target: { value: "Some notes" },
    });
    expect(defaultProps.onNotesChange).toHaveBeenCalled();
  });

  it("shows error when reason is empty and isSaveDisabled is true", () => {
    render(<DrugChartNoteAmendment {...defaultProps} isSaveDisabled={true} />);
    expect(
      screen.getByText(/Amendment Reason is required/i)
    ).toBeInTheDocument();
  });

  it("shows error when notes are empty and isSaveDisabled is true", () => {
    render(<DrugChartNoteAmendment {...defaultProps} isSaveDisabled={true} />);
    expect(
      screen.getByText(/Amendment notes are required/i)
    ).toBeInTheDocument();
  });
});
