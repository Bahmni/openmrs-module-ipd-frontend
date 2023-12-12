import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import React from "react";
import Vitals from "../components/Vitals";
import { getPatientVitals,getPatientVitalsHistory } from "../utils/VitalsUtils";

jest.mock("../utils/VitalsUtils", () => {
  const originalModule = jest.requireActual("../utils/VitalsUtils");
  return {
    ...originalModule,
    getPatientVitals: jest.fn(),
    getPatientVitalsHistory: jest.fn()
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
   const mockVitalsHistoryData = {
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
      {
        name: "MUAC",
        fullName: "Mid-upper arm circumference",
        units: "Cm",
        hiNormal: null,
        lowNormal: null,
        attributes: {},
    }
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
        MUAC: {
          value: "26.0",
          abnormal: false
      }
      },
      "2023-12-11T19:32:32+05:30": {
        Pulse: {
            value: "100.0",
            abnormal: false
        },
        "Diastolic Blood Pressure": {
            value: "84.0",
            abnormal: false
        },
        "Systolic Blood Pressure": {
           value: "115.0",
            abnormal: false
        },
        "Respiratory Rate": {
            value: "20.0",
            abnormal: false
        },
        SpO2: {
            value: "94.0",
            abnormal: false
        },
        Temperature: {
            value: "37.0",
            abnormal: false
        },
        BMI: {
            value: "19.0",
            abnormal: false
        },
        HEIGHT: {
            value: "165.0",
            abnormal: false
        },
        WEIGHT: {
            value: "50.0",
            abnormal: false
        },
        MUAC: {
            value: "27.0",
            abnormal: false
        }
    },
    }
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays vital and biometrics history after data is fetched", async () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    const {container} = render(<Vitals patientId="123" />);
      
    await waitFor(() => {
          expect(screen.getByText(/Vitals History/i)).toBeTruthy();
       });
    const vitalsHistory = screen.getByText(/Vitals History/i);  
    act(() => {
        fireEvent.click(vitalsHistory);
      });  
    await waitFor(() => {
      expect(screen.getByText("Pulse (beats/min)")).toBeTruthy();
      expect(screen.getByText(/Nutritional Values/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
       });
  });

  it("should display vital details after data is fetched", async () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    const {container} = render(<Vitals patientId="123" />);
    await waitFor(() => {
        expect(screen.getByText(/Temp/i)).toBeTruthy();
        expect(container).toMatchSnapshot();

    });
  });

  it("should display text when vitals is not present", async () => {
    getPatientVitalsHistory.mockResolvedValueOnce(mockVitalsHistoryData);
    getPatientVitals.mockResolvedValueOnce({
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

  it("renders without crashing", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(<Vitals patientId="123" />);
  });

  it("calls getPatientVitals on mount", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(<Vitals patientId="123" />);
    expect(getPatientVitals).toHaveBeenCalledWith("123");
  });

  it("displays loading skeleton while fetching data", () => {
    getPatientVitals.mockResolvedValueOnce(mockVitalsData);
    render(<Vitals patientId="123" />);
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

});


