import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import DraftOverlay from "./DraftOverlay";

const mockFormDraftsWithData = [
  {
    patientName: "John Doe",
    patientUuid: "patient-uuid-1",
    identifier: "IQ000001",
    timestamp: "2024-01-15T10:30:00.000Z",
  },
  {
    patientName: "Jane Smith",
    patientUuid: "patient-uuid-2",
    identifier: "IQ000002",
    timestamp: "2024-01-15T11:00:00.000Z",
  },
];

const renderWithIntl = (ui) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>
  );

describe("DraftOverlay", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe("when there are no drafts", () => {
    it("should render the empty state", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} />
      );
      expect(getByText("No drafts yet")).toBeTruthy();
      expect(getByText("You don't have any saved drafts")).toBeTruthy();
    });

    it("should render the overlay title with count zero", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} />
      );
      expect(getByText("Observation Drafts (0)")).toBeTruthy();
    });
  });

  describe("when there are drafts", () => {
    it("should render all draft rows", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} />
      );
      expect(getByText("John Doe")).toBeTruthy();
      expect(getByText("Jane Smith")).toBeTruthy();
      expect(getByText("IQ000001")).toBeTruthy();
      expect(getByText("IQ000002")).toBeTruthy();
    });

    it("should render the overlay title with correct count", () => {
      const { getByText } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} />
      );
      expect(getByText("Observation Drafts (2)")).toBeTruthy();
    });

    it("should render a divider between rows but not after the last row", () => {
      const { container } = renderWithIntl(
        <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} />
      );
      const dividers = container.querySelectorAll(".ipd-draft-overlay__divider");
      expect(dividers).toHaveLength(mockFormDraftsWithData.length - 1);
    });
  });

  describe("close button", () => {
    it("should call onClose when the close button is clicked", () => {
      const { getByLabelText } = renderWithIntl(
        <DraftOverlay formDrafts={[]} onClose={mockOnClose} />
      );
      fireEvent.click(getByLabelText("Close drafts overlay"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("should match snapshot with empty state", () => {
    const { container } = renderWithIntl(
      <DraftOverlay formDrafts={[]} onClose={mockOnClose} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot with draft rows", () => {
    const { container } = renderWithIntl(
      <DraftOverlay formDrafts={mockFormDraftsWithData} onClose={mockOnClose} />
    );
    expect(container).toMatchSnapshot();
  });
});
