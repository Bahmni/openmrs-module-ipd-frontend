import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import DrugChartNoteAcknowledgement from "../components/DrugChartNoteAcknowledgement";
import "@testing-library/jest-dom";
import { IntlProvider } from "react-intl";

jest.mock("../utils/DrugChartUtils", () => ({
  canAcknowledgeAmendment: () => true,
}));

const messages = {
  ACKNOWLEDGEMENT_NOTES: "Acknowledgement Notes",
  ACKNOWLEDGEMENT_NOTE_REQUIRED: "Acknowledgement notes are required",
  ENTER_NOTES: "Enter Notes",
};

// eslint-disable-next-line react/prop-types
const I18nProvider = ({ children }) => (
  <IntlProvider locale="en" messages={messages} defaultLocale="en">
    {children}
  </IntlProvider>
);

jest.mock("../../../i18n/I18nProvider", () => ({ I18nProvider }));

describe("DrugChartNoteAcknowledgement (presentational)", () => {
  const defaultProps = {
    privileges: ["ACKNOWLEDGE_AMENDMENT"],
    acknowledgementNotes: "",
    isAcknowledged: false,
    isSaveDisabled: false,
    onNotesChange: jest.fn(),
    onToggleChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders acknowledgement toggle and notes textarea", () => {
    render(
      <I18nProvider>
        <DrugChartNoteAcknowledgement {...defaultProps} />
      </I18nProvider>
    );
    expect(screen.getByLabelText(/Acknowledgement Notes/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("calls onNotesChange when textarea changes", () => {
    render(
      <I18nProvider>
        <DrugChartNoteAcknowledgement {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.change(screen.getByLabelText(/Acknowledgement Notes/i), {
      target: { value: "Some notes" },
    });
    expect(defaultProps.onNotesChange).toHaveBeenCalled();
  });

  it("calls onToggleChange when toggle is clicked", () => {
    render(
      <I18nProvider>
        <DrugChartNoteAcknowledgement {...defaultProps} />
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(defaultProps.onToggleChange).toHaveBeenCalled();
  });

  it("shows error when notes are empty and isSaveDisabled is true", () => {
    render(
      <I18nProvider>
        <DrugChartNoteAcknowledgement {...defaultProps} isSaveDisabled={true} />
      </I18nProvider>
    );
    expect(
      screen.getByText(/Acknowledgement notes are required/i)
    ).toBeInTheDocument();
  });
});
