import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DrugChartSlider from "../components/DrugChartSlider";
import "@testing-library/jest-dom";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";

const hostData = {
  drugName: "Paracetamol",
  dosageInfo: "500mg twice daily",
  medicationAdministrationNoteUUID: "note-uuid-1",
  amendedNotes: [
    {
      amendedText: "Changed dose to 500mg",
      amendedReason: "Dose adjustment",
      approvalNotes: "Reviewed and approved",
      approvalStatus: "APPROVED",
      approvedBy: { display: "Dr. Smith" },
    },
  ],
  performerName: "Nurse Joy",
  approvedTime: "2025-12-16T10:00:00Z",
  amendedTime: "2025-12-16T09:00:00Z",
  scheduledTime: "2025-12-16T08:00:00Z",
  existingNotes: "Initial note",
};

const mockHostApi = {
  onModalClose: jest.fn(),
  onModalSave: jest.fn(),
  onModalCancel: jest.fn(),
};

jest.mock("../../../i18n/I18nProvider", () => {
  // eslint-disable-next-line no-undef
  const React = require("react");
  // eslint-disable-next-line no-undef
  const { IntlProvider } = require("react-intl");
  const messages = {
    AMENDMENT_NOTES_HEADER: "Amendment Note(s)",
    ACKNOWLEDGEMENT_NOTES_HEADER: "Acknowledge Amend Note",
    NOTES_HISTORY_SLIDER_TITLE: "Notes History",
  };
  return {
    // eslint-disable-next-line react/prop-types
    I18nProvider: ({ children }) => (
      <IntlProvider locale="en" messages={messages} defaultLocale="en">
        {children}
      </IntlProvider>
    ),
  };
});

describe("DrugChartSlider", () => {
  const ipdContextValue = {
    config: {
      drugChartNoteAmendment: { amendmentReasons: ["Dose adjustment"] },
    },
    provider: { uuid: "provider-uuid-1" },
    privileges: ["ACKNOWLEDGE_AMENDMENT"],
  };
  const sliderContextValue = { setSliderContentModified: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Remove MockI18nProvider and use only context providers in renderWithProviders
  function renderWithProviders(ui) {
    return render(
      <IPDContext.Provider value={ipdContextValue}>
        <SliderContext.Provider value={sliderContextValue}>
          {ui}
        </SliderContext.Provider>
      </IPDContext.Provider>
    );
  }

  function getHeaderTextMatcher(expected) {
    return (content, node) => {
      const hasText = (node) => node.textContent === expected;
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children || []).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    };
  }

  it("renders amendment slider with correct title and content", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="amendment"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Amendment Note(s)"))
    ).toBeInTheDocument();
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    expect(screen.getByText("500mg twice daily")).toBeInTheDocument();
  });

  it("renders acknowledgement slider with correct title", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="acknowledgement"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Acknowledge Amend Note"))
    ).toBeInTheDocument();
  });

  it("renders history slider with correct title", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="history"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Notes History"))
    ).toBeInTheDocument();
  });

  it("calls hostApi.onModalClose when closeSideBar is triggered", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="amendment"
      />
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockHostApi.onModalClose).toHaveBeenCalled();
  });

  it("does not render a title for unknown sliderType", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="unknown"
      />
    );
    expect(screen.queryByText("Amendment Note(s)")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Acknowledge Amend Note")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Notes History")).not.toBeInTheDocument();
  });

  it("renders with minimal hostData", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={{ drugName: "", dosageInfo: "" }}
        hostApi={mockHostApi}
        sliderType="amendment"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Amendment Note(s)"))
    ).toBeInTheDocument();
  });

  it("renders amendment slider with all required props", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="amendment"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Amendment Note(s)"))
    ).toBeInTheDocument();
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    expect(screen.getByText("500mg twice daily")).toBeInTheDocument();
    // Use getAllByText for repeated text
    expect(screen.getAllByText("Dose adjustment").length).toBeGreaterThan(0);
    expect(screen.getByText("Changed dose to 500mg")).toBeInTheDocument();
    expect(screen.getByText("Initial note")).toBeInTheDocument();
  });

  it("renders acknowledgement slider with all required props", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="acknowledgement"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Acknowledge Amend Note"))
    ).toBeInTheDocument();
    expect(screen.getByText("Reviewed and approved")).toBeInTheDocument();
    expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
  });

  it("renders history slider with all required props", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="history"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Notes History"))
    ).toBeInTheDocument();
    expect(screen.getByText("Initial note")).toBeInTheDocument();
    // Use getAllByText for repeated text
    expect(screen.getAllByText("Nurse Joy").length).toBeGreaterThan(0);
  });

  it("calls hostApi.onModalClose when closeSideBar is triggered with all props", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="amendment"
      />
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockHostApi.onModalClose).toHaveBeenCalled();
  });
});
