import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

window.HTMLElement.prototype.scrollIntoView = jest.fn();
import { IntlProvider } from "react-intl";
import { IPDContext } from "../../../../context/IPDContext";
import CareInstructions from "../components/CareInstructions";
import * as CareInstructionsUtils from "../utils/CareInstructionsUtils.jsx";

const mockFormConcepts = [
  {
    formName: "Doctor Patient Progress Notes",
    concepts: ["Instruction for the Ward"],
  },
  {
    formName: "Patient Progress Notes and Orders",
    concepts: ["Physician Orders Comments (ET only)"],
  },
];

const mockAllFormsFilledInCurrentVisit = [
  {
    formType: "v2",
    formName: "Doctor Patient Progress Notes",
    formVersion: 1,
    visitUuid: "visit-uuid-1",
    visitStartDateTime: 1713875236000,
    encounterUuid: "encounter-uuid-1",
    encounterDateTime: 1713955252000,
    providers: [{ providerName: "Dr. Smith", uuid: "provider-uuid-1" }],
  },
  {
    formType: "v2",
    formName: "Patient Progress Notes and Orders",
    formVersion: 1,
    visitUuid: "visit-uuid-1",
    visitStartDateTime: 1713875236000,
    encounterUuid: "encounter-uuid-2",
    encounterDateTime: 1713941600000,
    providers: [{ providerName: "Dr. Jones", uuid: "provider-uuid-2" }],
  },
];

const mockEncounterObsResponse1 = {
  observations: [
    {
      concept: { name: "Instruction for the Ward" },
      value: "Patient should rest",
      groupMembers: [],
    },
  ],
};

const mockEncounterObsResponse2 = {
  observations: [
    {
      concept: { name: "Physician Orders Comments (ET only)" },
      value: "Monitor blood pressure",
      groupMembers: [],
    },
  ],
};

const mockIPDContextWithData = {
  allFormsFilledInCurrentVisit: mockAllFormsFilledInCurrentVisit,
  isAllFormsFilledInCurrentVisitLoading: false,
  config: { enable24HourTime: false },
};

const mockIPDContextEmpty = {
  allFormsFilledInCurrentVisit: [],
  isAllFormsFilledInCurrentVisitLoading: false,
  config: { enable24HourTime: false },
};

const mockIPDContextLoading = {
  allFormsFilledInCurrentVisit: [],
  isAllFormsFilledInCurrentVisitLoading: true,
  config: { enable24HourTime: false },
};

const renderWithProviders = (component, ipdContextValue) => {
  return render(
    <IPDContext.Provider value={ipdContextValue}>
      <IntlProvider locale={"en"}>{component}</IntlProvider>
    </IPDContext.Provider>
  );
};

describe("CareInstructions", () => {
  beforeEach(() => {
    jest
      .spyOn(CareInstructionsUtils, "fetchEncounterObs")
      .mockImplementation((encounterUuid) => {
        if (encounterUuid === "encounter-uuid-1") {
          return Promise.resolve(mockEncounterObsResponse1);
        }
        if (encounterUuid === "encounter-uuid-2") {
          return Promise.resolve(mockEncounterObsResponse2);
        }
        return Promise.resolve(null);
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render loading skeleton when data is loading", () => {
    const { getByTestId } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextLoading
    );
    expect(getByTestId("care-instructions-loading")).toBeInTheDocument();
  });

  it("should render empty state when no matching forms exist", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextEmpty
    );
    await waitFor(() => {
      expect(
        getByText("No care instructions are available for the patient")
      ).toBeInTheDocument();
    });
  });

  it("should render Not Acknowledged and Acknowledged tabs", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextEmpty
    );
    await waitFor(() => {
      expect(getByText("Not Acknowledged")).toBeInTheDocument();
      expect(getByText("Acknowledged")).toBeInTheDocument();
    });
  });

  it("should render table with instructions when data exists", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(getByText("Patient should rest")).toBeInTheDocument();
      expect(getByText("Instruction for the Ward")).toBeInTheDocument();
      expect(getByText("Dr. Smith")).toBeInTheDocument();
    });
  });

  it("should render all table headers", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(getByText("Date and Time")).toBeInTheDocument();
      expect(getByText("Form")).toBeInTheDocument();
      expect(getByText("Instruction Type")).toBeInTheDocument();
      expect(getByText("Instruction")).toBeInTheDocument();
      expect(getByText("Provider Name")).toBeInTheDocument();
      expect(getByText("Action")).toBeInTheDocument();
    });
  });

  it("should show Acknowledged tab content when Acknowledged tab is clicked", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextEmpty
    );
    await waitFor(() => {
      expect(
        getByText("No care instructions are available for the patient")
      ).toBeInTheDocument();
    });
    fireEvent.click(getByText("Acknowledged"));
    await waitFor(() => {
      expect(getByText("No records available")).toBeInTheDocument();
    });
  });

  it("should render instructions from both forms", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(getByText("Patient should rest")).toBeInTheDocument();
      expect(getByText("Monitor blood pressure")).toBeInTheDocument();
      expect(getByText("Dr. Smith")).toBeInTheDocument();
      expect(getByText("Dr. Jones")).toBeInTheDocument();
    });
  });

  it("should render empty state when config has no formConcepts", async () => {
    const { getByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: [] }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(
        getByText("No care instructions are available for the patient")
      ).toBeInTheDocument();
    });
  });

  it("should render empty provider name when providers array is empty", async () => {
    const contextWithEmptyProviders = {
      ...mockIPDContextWithData,
      allFormsFilledInCurrentVisit: [
        {
          ...mockAllFormsFilledInCurrentVisit[0],
          encounterUuid: "encounter-uuid-1",
          providers: [],
        },
      ],
    };
    const { getByText, getAllByRole } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      contextWithEmptyProviders
    );
    await waitFor(() => {
      expect(getByText("Patient should rest")).toBeInTheDocument();
    });
    const rows = getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("should sort instructions newest first by encounterDateTime", async () => {
    const { getAllByRole } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      const rows = getAllByRole("row");
      // rows[0] = header row, rows[1] = first data row (newest), rows[2] = second data row
      expect(rows[1].textContent).toContain("Patient should rest");
      expect(rows[2].textContent).toContain("Monitor blood pressure");
    });
  });
});

describe("extractInstructionsFromObs", () => {
  it("should extract matching concept values from flat observations list", () => {
    const observations = [
      {
        concept: { name: "Instruction for the Ward" },
        value: "Rest in bed",
        groupMembers: [],
      },
      {
        concept: { name: "Some Other Concept" },
        value: "Other value",
        groupMembers: [],
      },
    ];
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      observations,
      ["Instruction for the Ward"]
    );
    expect(result).toHaveLength(1);
    expect(result[0].conceptName).toBe("Instruction for the Ward");
    expect(result[0].value).toBe("Rest in bed");
  });

  it("should recursively search groupMembers for matching concepts", () => {
    const observations = [
      {
        concept: { name: "Group Concept" },
        value: null,
        groupMembers: [
          {
            concept: { name: "Instruction for the Ward" },
            value: "Nested instruction",
            groupMembers: [],
          },
        ],
      },
    ];
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      observations,
      ["Instruction for the Ward"]
    );
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("Nested instruction");
  });

  it("should return empty array when observations is empty", () => {
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      [],
      ["Instruction for the Ward"]
    );
    expect(result).toHaveLength(0);
  });

  it("should return empty array when configuredConcepts is empty", () => {
    const observations = [
      {
        concept: { name: "Instruction for the Ward" },
        value: "Some value",
        groupMembers: [],
      },
    ];
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      observations,
      []
    );
    expect(result).toHaveLength(0);
  });

  it("should extract display name when obs value is a coded object", () => {
    const observations = [
      {
        concept: { name: "Planned Return to Operating Room" },
        value: { uuid: "some-uuid", display: "Yes", name: "Yes" },
        groupMembers: [],
      },
    ];
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      observations,
      ["Planned Return to Operating Room"]
    );
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("Yes");
  });

  it("should return empty array when no concepts match", () => {
    const observations = [
      {
        concept: { name: "Unrelated Concept" },
        value: "Some value",
        groupMembers: [],
      },
    ];
    const result = CareInstructionsUtils.extractInstructionsFromObs(
      observations,
      ["Instruction for the Ward"]
    );
    expect(result).toHaveLength(0);
  });
});

describe("fetchEncounterObs", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("should call the correct URL with withCredentials and return response data", async () => {
    const encounterUuid = "test-encounter-uuid";
    const mockResponse = {
      observations: [{ concept: { name: "Test" }, value: "Value" }],
    };
    mockAxios
      .onGet(new RegExp(`.*${encounterUuid}.*`))
      .reply(200, mockResponse);

    const result = await CareInstructionsUtils.fetchEncounterObs(encounterUuid);

    expect(result).toEqual(mockResponse);
    expect(mockAxios.history.get[0].url).toContain(encounterUuid);
    expect(mockAxios.history.get[0].withCredentials).toBe(true);
  });

  it("should return null when the API call fails", async () => {
    mockAxios.onGet(new RegExp(".*")).reply(500);

    const result = await CareInstructionsUtils.fetchEncounterObs("any-uuid");

    expect(result).toBeNull();
  });
});
