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
  noteInfo: {
    acknowledgementNotes: [],
    original: {
      uuid: "72841685-f9f7-4171-a55b-1a98ec37f9ea",
      author: {
        uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
        display: "Super Man",
      },
      recordedTime: 1770390923000,
      text: "Initial note",
      amendmentReason: null,
      previousNoteUuid: null,
      acknowledgement: null,
    },
    newNote: null,
    amendedNotes: [
      {
        uuid: "bce99f13-212d-4146-ab03-c9029eabb30f",
        author: {
          uuid: "9b2e6fe0-734c-11ee-98ee-0242ac130009",
          display: "other.nurse - Other Nurse",
        },
        recordedTime: 1770400529000,
        text: "Changed dose to 500mg",
        amendmentReason: "Dose adjustment",
        previousNoteUuid: "cecb1f04-b5fa-4285-8b57-311397f0b90b",
        acknowledgement: null,
      },
      {
        uuid: "cecb1f04-b5fa-4285-8b57-311397f0b90b",
        author: {
          uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
          display: "Super Man",
        },
        recordedTime: 1770400012000,
        text: "Time incorrect",
        amendmentReason: "Incorrect Time",
        previousNoteUuid: "c0f0e8b2-b62f-4fd9-94d6-073a7df56e33",
        acknowledgement: null,
      },
    ],
  },
  notes: [
    {
      "uuid": "cecb1f04-b5fa-4285-8b57-311397f0b90b",
      "author": {
        "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75",
        "display": "Super Man",
      },
      "recordedTime": 1770400012000,
      "text": "Time incorrect",
      "amendmentReason": "Incorrect Time",
      "previousNoteUuid": "c0f0e8b2-b62f-4fd9-94d6-073a7df56e33",
      "acknowledgement": null
    },
    {
      "uuid": "72841685-f9f7-4171-a55b-1a98ec37f9ea",
      "author": {
        "uuid": "c1c26908-3f10-11e4-adec-0800271c1b75",
        "display": "Super Man",
      },
      "recordedTime": 1770390923000,
      "text": "Notes for adding",
      "amendmentReason": null,
      "previousNoteUuid": null,
      "acknowledgement": null
    },
    {
      "uuid": "bce99f13-212d-4146-ab03-c9029eabb30f",
      "author": {
        "uuid": "9b2e6fe0-734c-11ee-98ee-0242ac130009",
        "display": "other.nurse - Other Nurse",
      },
      "recordedTime": 1770400529000,
      "text": "Incorrect unit given",
      "amendmentReason": "Incorrect Unit",
      "previousNoteUuid": "cecb1f04-b5fa-4285-8b57-311397f0b90b",
      "acknowledgement": null
    }
  ],
  performerName: "Nurse Joy",
  approvedTime: "2025-12-16T10:00:00Z",
  amendedTime: "2025-12-16T09:00:00Z",
  scheduledTime: "2025-12-16T08:00:00Z",
  existingNotes: "Initial note",
};
const hostDataWithAck = {
  ...hostData,
  noteInfo: {
    ...hostData.noteInfo,
    acknowledgementNotes: [{
      text: "Reviewed and approved",
      recordedTime: 1770410000000,
      author: {
        display: "Dr. Smith",
      }
    }],
  },
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
    ACKNOWLEDGEMENT_NOTES_HEADER: "Acknowledge Amended Note",
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
      screen.getByText(getHeaderTextMatcher("Acknowledge Amended Note"))
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
      screen.queryByText("Acknowledge Amended Note")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Notes History")).not.toBeInTheDocument();
  });

  it("renders with minimal hostData", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={{ drugName: "", dosageInfo: "", notes: [{}], noteInfo: {acknowledgementNotes:[],amendedNotes:[], } }}
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
    const { container } = renderWithProviders(
      <DrugChartSlider
        hostData={hostData}
        hostApi={mockHostApi}
        sliderType="acknowledgement"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Acknowledge Amended Note"))
    ).toBeInTheDocument();
    expect(container.querySelector(".drug-chart-note-acknowledgement__toggle")).toBeInTheDocument();
    expect(screen.getByText("Acknowledgement Notes")).toBeInTheDocument();
  });

  it("renders history slider with all required props", () => {
    renderWithProviders(
      <DrugChartSlider
        hostData={hostDataWithAck}
        hostApi={mockHostApi}
        sliderType="history"
      />
    );
    expect(
      screen.getByText(getHeaderTextMatcher("Notes History"))
    ).toBeInTheDocument();
    expect(screen.getByText("Initial note")).toBeInTheDocument();
    // Use getAllByText for repeated text
    expect(screen.getAllByText("Dr. Smith").length).toBeGreaterThan(0);
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
