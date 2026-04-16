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

const mockObservationsApiResponse = [
  {
    encounterDateTime: 1713955252000,
    encounterUuid: "encounter-uuid-1",
    formFieldPath: "Doctor Patient Progress Notes.1/5-0",
    concept: { name: "Instruction for the Ward" },
    value: "Patient should rest",
    providers: [{ name: "Dr. Smith", uuid: "provider-uuid-1" }],
    groupMembers: [],
  },
  {
    encounterDateTime: 1713941600000,
    encounterUuid: "encounter-uuid-2",
    formFieldPath: "Patient Progress Notes and Orders.2/11-0",
    concept: { name: "Physician Orders Comments (ET only)" },
    value: "Monitor blood pressure",
    providers: [{ name: "Dr. Jones", uuid: "provider-uuid-2" }],
    groupMembers: [],
  },
];

const mockIPDContextWithData = {
  visit: "visit-uuid-1",
  config: { enable24HourTime: false },
};

const mockIPDContextEmpty = {
  visit: "visit-uuid-1",
  config: { enable24HourTime: false },
};

const mockIPDContextNoVisit = {
  visit: null,
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
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue(mockObservationsApiResponse);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render empty state when visit is not available", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([]);
    const { getAllByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextNoVisit
    );
    await waitFor(() => {
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should render empty state when no observations are returned", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([]);
    const { getAllByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextEmpty
    );
    await waitFor(() => {
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should render Not Acknowledged and Acknowledged tabs", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([]);
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
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([]);
    const { getByText, getAllByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextEmpty
    );
    await waitFor(() => {
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
    });
    fireEvent.click(getByText("Acknowledged"));
    await waitFor(() => {
      // The Acknowledged tab also shows the empty state message since it's not yet implemented
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
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
    const { getAllByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: [] }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should render empty provider name when providers array is empty", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([
        {
          encounterDateTime: 1713955252000,
          encounterUuid: "encounter-uuid-1",
          formFieldPath: "Doctor Patient Progress Notes.1/5-0",
          concept: { name: "Instruction for the Ward" },
          value: "Patient should rest",
          providers: [],
          groupMembers: [],
        },
      ]);
    const { getByText, getAllByRole } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
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

  it("should call fetchCareInstructionsObs with visit uuid and all concept names", async () => {
    const fetchSpy = jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([]);
    renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith("visit-uuid-1", [
        "Instruction for the Ward",
        "Physician Orders Comments (ET only)",
      ]);
    });
  });

  it("should render loading skeleton while data is being fetched", async () => {
    let resolveObs;
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockReturnValue(
        new Promise((resolve) => {
          resolveObs = resolve;
        })
      );
    const { getByTestId } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    expect(getByTestId("care-instructions-loading")).toBeInTheDocument();
    resolveObs([]);
  });

  it("should render empty state when API call fails", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockRejectedValue(new Error("Network error"));
    const { getAllByText } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      const elements = getAllByText(
        "No care instructions are available for the patient"
      );
      expect(elements.length).toBeGreaterThan(0);
      expect(elements[0]).toBeInTheDocument();
    });
  });

  it("should render separate rows when same form is filled in different encounters (AC #4)", async () => {
    jest
      .spyOn(CareInstructionsUtils, "fetchCareInstructionsObs")
      .mockResolvedValue([
        {
          encounterDateTime: 1713955252000,
          encounterUuid: "encounter-uuid-1",
          formFieldPath: "Doctor Patient Progress Notes.1/5-0",
          concept: { name: "Instruction for the Ward" },
          value: "First instruction",
          providers: [{ name: "Dr. Smith" }],
          groupMembers: [],
        },
        {
          encounterDateTime: 1713941600000,
          encounterUuid: "encounter-uuid-3",
          formFieldPath: "Doctor Patient Progress Notes.1/5-0",
          concept: { name: "Instruction for the Ward" },
          value: "Second instruction",
          providers: [{ name: "Dr. Smith" }],
          groupMembers: [],
        },
      ]);
    const { getByText, getAllByRole } = renderWithProviders(
      <CareInstructions config={{ formConcepts: mockFormConcepts }} />,
      mockIPDContextWithData
    );
    await waitFor(() => {
      expect(getByText("First instruction")).toBeInTheDocument();
      expect(getByText("Second instruction")).toBeInTheDocument();
      const rows = getAllByRole("row");
      // header + 2 data rows
      expect(rows).toHaveLength(3);
    });
  });
});

describe("mapObservationsToInstructions", () => {
  it("should map observations with valid formFieldPath to instructions", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: "Rest in bed",
        providers: [{ name: "Dr. Smith", uuid: "provider-uuid-1" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(1);
    expect(result[0].form).toBe("Doctor Patient Progress Notes");
    expect(result[0].instructionType).toBe("Instruction for the Ward");
    expect(result[0].instruction).toBe("Rest in bed");
    expect(result[0].providerName).toBe("Dr. Smith");
    expect(result[0].encounterUuid).toBe("encounter-uuid-1");
    expect(result[0].action).toBe("");
  });

  it("should filter out observations with null formFieldPath", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: null,
        concept: { name: "Instruction for the Ward" },
        value: "Rest in bed",
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(0);
  });

  it("should filter out observations from forms not in config", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Unknown Form.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: "Rest in bed",
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(0);
  });

  it("should filter out observations with concepts not configured for their form", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Physician Orders Comments (ET only)" },
        value: "Some value",
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(0);
  });

  it("should return empty array when observations is empty", () => {
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      [],
      mockFormConcepts
    );
    expect(result).toHaveLength(0);
  });

  it("should return empty array when formConcepts is empty", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: "Some value",
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      []
    );
    expect(result).toHaveLength(0);
  });

  it("should extract display name when obs value is a coded object", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: { uuid: "some-uuid", display: "Yes", name: "Yes" },
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      [
        {
          formName: "Doctor Patient Progress Notes",
          concepts: ["Instruction for the Ward"],
        },
      ]
    );
    expect(result).toHaveLength(1);
    expect(result[0].instruction).toBe("Yes");
  });

  it("should return empty string for instruction when obs value is null", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: null,
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(1);
    expect(result[0].instruction).toBe("");
  });

  it("should return empty array when observations is null", () => {
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      null,
      mockFormConcepts
    );
    expect(result).toHaveLength(0);
  });

  it("should handle empty provider name when providers array is empty", () => {
    const observations = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: "Rest in bed",
        providers: [],
      },
    ];
    const result = CareInstructionsUtils.mapObservationsToInstructions(
      observations,
      mockFormConcepts
    );
    expect(result).toHaveLength(1);
    expect(result[0].providerName).toBe("");
  });
});

describe("serializeParams", () => {
  it("should serialize array values as repeated params without brackets", () => {
    const result = CareInstructionsUtils.serializeParams({
      visitUuid: "visit-uuid-1",
      concept: ["Physician Orders Comments", "Instruction for the Ward"],
    });
    expect(result).toBe(
      "visitUuid=visit-uuid-1&concept=Physician%20Orders%20Comments&concept=Instruction%20for%20the%20Ward"
    );
  });

  it("should serialize single string values", () => {
    const result = CareInstructionsUtils.serializeParams({
      visitUuid: "visit-uuid-1",
    });
    expect(result).toBe("visitUuid=visit-uuid-1");
  });
});

describe("fetchCareInstructionsObs", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("should call the observations URL with visitUuid and concept params and return response data", async () => {
    const mockResponse = [
      {
        encounterDateTime: 1713955252000,
        encounterUuid: "encounter-uuid-1",
        formFieldPath: "Doctor Patient Progress Notes.1/5-0",
        concept: { name: "Instruction for the Ward" },
        value: "Test value",
        providers: [{ name: "Dr. Smith" }],
      },
    ];
    mockAxios.onGet(new RegExp(".*observations.*")).reply(200, mockResponse);

    const result = await CareInstructionsUtils.fetchCareInstructionsObs(
      "visit-uuid-1",
      ["Instruction for the Ward"]
    );

    expect(result).toEqual(mockResponse);
    expect(mockAxios.history.get[0].params).toEqual({
      visitUuid: "visit-uuid-1",
      concept: ["Instruction for the Ward"],
    });
    expect(mockAxios.history.get[0].params).not.toHaveProperty("patientUuid");
    expect(mockAxios.history.get[0].withCredentials).toBe(true);
  });

  it("should return empty array when the API call fails", async () => {
    mockAxios.onGet(new RegExp(".*")).reply(500);

    const result = await CareInstructionsUtils.fetchCareInstructionsObs(
      "visit-uuid-1",
      ["Instruction for the Ward"]
    );

    expect(result).toEqual([]);
  });
});

describe("fetchBatchObservations", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("should POST to the batch URL and return grouped observations for multiple visits", async () => {
    const mockResponse = [
      {
        visitUuid: "visit-uuid-1",
        observations: [
          {
            encounterUuid: "encounter-uuid-1",
            concept: { name: "Instruction for the Ward" },
            value: "Rest in bed",
          },
        ],
      },
      {
        visitUuid: "visit-uuid-2",
        observations: [
          {
            encounterUuid: "encounter-uuid-2",
            concept: { name: "Instruction for the Ward" },
            value: "Monitor vitals",
          },
        ],
      },
    ];
    mockAxios
      .onPost(new RegExp(".*observations/batch.*"))
      .reply(200, mockResponse);

    const result = await CareInstructionsUtils.fetchBatchObservations(
      ["visit-uuid-1", "visit-uuid-2"],
      ["Instruction for the Ward"]
    );

    expect(result).toEqual(mockResponse);
    expect(result).toHaveLength(2);
    expect(result[0].visitUuid).toBe("visit-uuid-1");
    expect(result[1].visitUuid).toBe("visit-uuid-2");

    const requestBody = JSON.parse(mockAxios.history.post[0].data);
    expect(requestBody).toEqual({
      visitUuids: ["visit-uuid-1", "visit-uuid-2"],
      concept: ["Instruction for the Ward"],
    });
    expect(mockAxios.history.post[0].withCredentials).toBe(true);
  });

  it("should return empty array when the API call fails", async () => {
    mockAxios.onPost(new RegExp(".*observations/batch.*")).reply(500);

    const result = await CareInstructionsUtils.fetchBatchObservations(
      ["visit-uuid-1"],
      ["Instruction for the Ward"]
    );

    expect(result).toEqual([]);
  });
});
