import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Vitals from "../components/Vitals";
import { getPatientVitals } from "../utils/VitalsUtils";

jest.mock("../utils/VitalsUtils", () => {
  const originalModule = jest.requireActual("../utils/VitalsUtils");
  return {
    ...originalModule,
    getPatientVitals: jest.fn(),
  };
});

describe("Vitals", () => {
  const mockVitalsData = {
    identifiers: [
      {
        identifier: "12345",
      },
    ],
    conceptDetails: [
      {
        name: "WEIGHT",
        fullName: "WEIGHT",
        units: "Kg",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "BMI",
        fullName: "BMI Data",
        units: null,
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "Diastolic Blood Pressure",
        fullName: "Diastolic Blood Pressure",
        units: "mmHg",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "Systolic Blood Pressure",
        fullName: "Systolic Blood Pressure",
        units: "mmHg",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "SpO2",
        fullName: "Arterial Blood Oxygen Saturation (Pulse Oximeter)",
        units: "%",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "Pulse",
        fullName: "Pulse",
        units: "beats/min",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
      {
        name: "Temperature",
        fullName: "Temperature",
        units: "C",
        hiNormal: 37.7,
        lowNormal: 35,
        attributes: {},
      },
      {
        name: "Respiratory Rate",
        fullName: "Respiratory Rate",
        units: null,
        hiNormal: null,
        lowNormal: null,
        attributes: {},
      },
    ],
    tabularData: {
      "2023-11-07T16:02:11+05:30": {
        "Diastolic Blood Pressure": {
          value: "80.0",
          abnormal: false,
        },
        "Systolic Blood Pressure": {
          value: "110.0",
          abnormal: false,
        },
        Pulse: {
          value: "90.0",
          abnormal: false,
        },
        Temperature: {
          value: "36.0",
          abnormal: false,
        },
        "Respiratory Rate": {
          value: "25.0",
          abnormal: false,
        },
        SpO2: {
          value: "93.0",
          abnormal: false,
        },
        BMI: {
          value: "19.53",
          abnormal: false,
        },
        WEIGHT: {
          value: "50.0",
          abnormal: false,
        },
        HEIGHT: {
          value: "160.0",
          abnormal: false,
        },
      },
    },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders without crashing", () => {
    getPatientVitals.mockResolvedValue(mockVitalsData);
    render(<Vitals patientId="123" />);
  });

  it("calls getPatientVitals on mount", () => {
    getPatientVitals.mockResolvedValue(mockVitalsData);
    render(<Vitals patientId="123" />);
    expect(getPatientVitals).toHaveBeenCalledWith("123");
  });

  it("displays loading skeleton while fetching data", () => {
    getPatientVitals.mockResolvedValue(mockVitalsData);
    render(<Vitals patientId="123" />);
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("displays vital details after data is fetched", async () => {
    getPatientVitals.mockResolvedValue(mockVitalsData);
    render(<Vitals patientId="123" />);
    await waitFor(() => {
      expect(screen.getByText(/Temp/i)).toBeTruthy();
      expect(screen.getByText(/BP/i)).toBeTruthy();
      expect(screen.getByText(/Heart rate/i)).toBeTruthy();
      expect(screen.getByText(/R.rate/i)).toBeTruthy();
      expect(screen.getByText(/Weight/i)).toBeTruthy();
      expect(screen.getByText(/Height/i)).toBeTruthy();
      expect(screen.getByText(/SpO2/i)).toBeTruthy();
      expect(screen.getByText(/BMI/i)).toBeTruthy();
      expect(screen.getByText(/36.0/)).toBeTruthy();
      expect(screen.getByText(/110\/80/)).toBeTruthy();
      expect(screen.getByText(/25/)).toBeTruthy();
      expect(screen.getByText(/93/)).toBeTruthy();
      expect(screen.getByText(/19.53/)).toBeTruthy();
      expect(screen.getByText(/50/)).toBeTruthy();
      expect(screen.getByText(/160/)).toBeTruthy();
    });
  });

  it("displays text when vitals is not present", async () => {
    getPatientVitals.mockResolvedValue({
      identifiers: [
        {
          identifier: "12345",
        },
      ],
      conceptDetails: [
        {
          name: "WEIGHT",
          fullName: "WEIGHT",
          units: "Kg",
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "BMI",
          fullName: "BMI Data",
          units: null,
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "Diastolic Blood Pressure",
          fullName: "Diastolic Blood Pressure",
          units: "mmHg",
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "Systolic Blood Pressure",
          fullName: "Systolic Blood Pressure",
          units: "mmHg",
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "SpO2",
          fullName: "Arterial Blood Oxygen Saturation (Pulse Oximeter)",
          units: "%",
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "Pulse",
          fullName: "Pulse",
          units: "beats/min",
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
        {
          name: "Temperature",
          fullName: "Temperature",
          units: "C",
          hiNormal: 37.7,
          lowNormal: 35,
          attributes: {},
        },
        {
          name: "Respiratory Rate",
          fullName: "Respiratory Rate",
          units: null,
          hiNormal: null,
          lowNormal: null,
          attributes: {},
        },
      ],
      tabularData: {},
    });
    render(<Vitals patientId="123" />);
    await waitFor(() =>
      expect(
        screen.getByText("No Vitals available for this patient")
      ).toBeTruthy()
    );
  });
});
