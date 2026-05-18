import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import DraftOverlay from "./DraftOverlay";

const mockFormDraftsWithData = [
  {
    draftUuid: "draft-uuid-1",
    patientName: "John Doe",
    patientUuid: "patient-uuid-1",
    patientIdentifier: "IQ000001",
    encounterUuid: "encounter-uuid-1",
    formUuid: "form-uuid-1",
    formName: "Form One",
    timestamp: 1705313400000,
  },
  {
    draftUuid: "draft-uuid-2",
    patientName: "Jane Smith",
    patientUuid: "patient-uuid-2",
    patientIdentifier: "IQ000002",
    encounterUuid: null,
    formUuid: null,
    formName: null,
    timestamp: 1705315200000,
  },
];

const mockOnClose = jest.fn();
const mockOnSelect = jest.fn();

const renderWithIntl = (ui) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>
  );

describe("DraftOverlay", () => {
  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSelect.mockClear();
  });

  describe("when there are no drafts", () => {
    it("should render the empty state", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      expect(getByText("No drafts yet")).toBeTruthy();
      expect(getByText("You don't have any saved drafts")).toBeTruthy();
    });

    it("should render the overlay title with count zero", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      expect(getByText("Observation Drafts (0)")).toBeTruthy();
    });
  });

  describe("when there are drafts", () => {
    it("should render all draft rows", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      expect(getByText("John Doe")).toBeTruthy();
      expect(getByText("Jane Smith")).toBeTruthy();
      expect(getByText("IQ000001")).toBeTruthy();
      expect(getByText("IQ000002")).toBeTruthy();
    });

    it("should render the overlay title with correct count", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      expect(getByText("Observation Drafts (2)")).toBeTruthy();
    });

    it("should render a divider between rows but not after the last row", () => {
      const { container } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      const dividers = container.querySelectorAll(".ipd-draft-overlay__divider");
      expect(dividers).toHaveLength(mockFormDraftsWithData.length - 1);
    });

    it("should render rows as buttons", () => {
      const { container } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      const rowButtons = container.querySelectorAll(".ipd-draft-overlay__row-button");
      expect(rowButtons).toHaveLength(mockFormDraftsWithData.length);
      rowButtons.forEach((btn) => expect(btn.tagName).toBe("BUTTON"));
    });

    it("should call onSelect with the correct draft when a row is clicked", () => {
      const { container } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      const firstRowButton = container.querySelectorAll(".ipd-draft-overlay__row-button")[0];
      fireEvent.click(firstRowButton);
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
      expect(mockOnSelect).toHaveBeenCalledWith(mockFormDraftsWithData[0]);
    });

    it("should call onSelect with correct draft for second row click", () => {
      const { container } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      const secondRowButton = container.querySelectorAll(".ipd-draft-overlay__row-button")[1];
      fireEvent.click(secondRowButton);
      expect(mockOnSelect).toHaveBeenCalledWith(mockFormDraftsWithData[1]);
    });
  });

  describe("close button", () => {
    it("should call onClose when the close button is clicked", () => {
      const { getByLabelText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} onSelect={mockOnSelect} />
      );
      fireEvent.click(getByLabelText("Close drafts overlay"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should match snapshot with empty state", () => {
    const { container } = renderWithIntl(
      <DraftOverlay formDrafts={[]} onClose={mockOnClose} onSelect={mockOnSelect} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with draft rows", () => {
    const { container } = renderWithIntl(
      <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} onSelect={mockOnSelect} />
    );
    expect(container).toMatchSnapshot();
  });
});
