import axios from "axios";
import React from "react";
import { PATIENT_VITALS_URL, timeFormatFor12Hr } from "../../../../constants";
import { defaultDateTimeFormat } from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { FormattedMessage } from "react-intl";

export const vitalsHeaders = {
  temperature: <FormattedMessage id={"Temperature"} defaultMessage={"Temp"} />,
  bloodPressure: (
    <FormattedMessage id={"BLOOD_PRESSURE"} defaultMessage={"BP"} />
  ),
  pulse: <FormattedMessage id={"PULSE"} defaultMessage={"Pulse"} />,
  respiratoryRate: (
    <FormattedMessage id={"RESPIRATORY_RATE"} defaultMessage={"R.rate"} />
  ),
  weight: <FormattedMessage id={"WEIGHT"} defaultMessage={"Weight"} />,
  height: <FormattedMessage id={"HEIGHT"} defaultMessage={"Height"} />,
  spO2: <FormattedMessage id={"SPO2"} defaultMessage={"SpO2"} />,
  BMI: <FormattedMessage id={"BMI"} defaultMessage={"BMI"} />,
};

const getLatestDate = (tabularData) => {
  let latestDate = null;
  for (const dateKey in tabularData) {
    if (latestDate === null || dateKey > latestDate) {
      latestDate = dateKey;
    }
  }
  return latestDate;
};
const setDateAndTime = (latestDateAndTime, setVitalsDate, setVitalsTime) => {
  const date = formatDate(latestDateAndTime);
  const time = formatDate(latestDateAndTime, timeFormatFor12Hr);
  setVitalsDate(date);
  setVitalsTime(time);
};

export const getPatientVitals = async (patientUuid) => {
  const conceptValues = [
    "Arterial+Blood+Oxygen+Saturation+(Pulse+Oximeter)",
    "Weight",
    "BMI",
    "Respiratory+Rate",
    "Systolic+blood+pressure",
    "Diastolic+blood+pressure",
    "Temperature",
    "Pulse",
    "Height",
  ];
  const queryParams = conceptValues.map((concept) => `obsConcepts=${concept}`);
  const conceptParams = queryParams.join("&");
  try {
    const response = await axios.get(
      `${PATIENT_VITALS_URL}?patientUuid=${patientUuid}&latestCount=1&${conceptParams}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getPatientVitalsHistory = async (patientUuid) => {
  const conceptValues = [
    "Arterial+Blood+Oxygen+Saturation+(Pulse+Oximeter)",
    "Weight",
    "BMI",
    "Respiratory+Rate",
    "Systolic+blood+pressure",
    "Diastolic+blood+pressure",
    "Temperature",
    "Pulse",
    "Height",
    "Mid-upper+arm+circumference",
  ];
  const queryParams = conceptValues.map((concept) => `obsConcepts=${concept}`);
  const conceptParams = queryParams.join("&");
  try {
    const response = await axios.get(
      `${PATIENT_VITALS_URL}?patientUuid=${patientUuid}&groupBy=obstime&${conceptParams}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const mapVitalsData = (
  VitalsList,
  vitalsHistoryList,
  setVitalsDate,
  setVitalsTime
) => {
  let mappedVitals = {};
  let latestVisitDate = null;
  let latestEntryDate = null;
  if (VitalsList.tabularData) {
    const VitalsValues = VitalsList.tabularData;
    latestVisitDate = getLatestDate(VitalsValues);
    latestEntryDate = getLatestDate(vitalsHistoryList.tabularData);

    if (latestVisitDate !== null) {
      setDateAndTime(latestEntryDate, setVitalsDate, setVitalsTime);
      mappedVitals = {
        Temp: {
          value: VitalsValues[latestVisitDate].Temperature?.value,
          abnormal: VitalsValues[latestVisitDate].Temperature?.abnormal,
        },
        HeartRate: {
          value: parseInt(VitalsValues[latestVisitDate].Pulse?.value, 10),
          abnormal: VitalsValues[latestVisitDate].Pulse?.abnormal,
        },
        SystolicPressure: {
          value: parseInt(
            VitalsValues[latestVisitDate]["Systolic Blood Pressure"]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate]["Systolic Blood Pressure"]?.abnormal,
        },
        DiastolicPressure: {
          value: parseInt(
            VitalsValues[latestVisitDate]["Diastolic Blood Pressure"]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate]["Diastolic Blood Pressure"]?.abnormal,
        },
        Height: {
          value: parseInt(VitalsValues[latestVisitDate].HEIGHT?.value, 10),
          abnormal: VitalsValues[latestVisitDate].HEIGHT?.abnormal,
        },
        Weight: {
          value: parseInt(VitalsValues[latestVisitDate].WEIGHT?.value, 10),
          abnormal: VitalsValues[latestVisitDate].WEIGHT?.abnormal,
        },
        RespiratoryRate: {
          value: parseInt(
            VitalsValues[latestVisitDate]["Respiratory Rate"]?.value,
            10
          ),
          abnormal: VitalsValues[latestVisitDate]["Respiratory Rate"]?.abnormal,
        },
        SpO2: {
          value: parseInt(VitalsValues[latestVisitDate].SpO2?.value, 10),
          abnormal: VitalsValues[latestVisitDate].SpO2?.abnormal,
        },
        BMI: {
          value: VitalsValues[latestVisitDate].BMI?.value,
          abnormal: VitalsValues[latestVisitDate].BMI?.abnormal,
        },
      };
    }
  }
  return mappedVitals;
};

export const mapVitalsHistory = (vitalsHistoryList) => {
  let vitalsHistory = [];
  const vitalsValue = vitalsHistoryList.tabularData;
  for (const date in vitalsValue) {
    const innerMappedVitals = vitalsValue[date];
    const pairedVital = {
      id: date,
      date: formatDate(date, defaultDateTimeFormat),
      pulse: {
        value: innerMappedVitals?.Pulse
          ? innerMappedVitals?.Pulse?.value
          : "--",
        abnormal: innerMappedVitals?.Pulse
          ? innerMappedVitals?.Pulse.abnormal
          : false,
      },
      spO2: {
        value: innerMappedVitals?.SpO2 ? innerMappedVitals?.SpO2?.value : "--",
        abnormal: innerMappedVitals?.SpO2
          ? innerMappedVitals?.SpO2.abnormal
          : false,
      },

      temperature: {
        value: innerMappedVitals?.Temperature
          ? innerMappedVitals?.Temperature?.value
          : "--",
        abnormal: innerMappedVitals?.Temperature
          ? innerMappedVitals?.Temperature.abnormal
          : false,
      },
      respiratoryRate: {
        value: innerMappedVitals?.["Respiratory Rate"]
          ? innerMappedVitals?.["Respiratory Rate"].value
          : "--",
        abnormal: innerMappedVitals?.["Respiratory Rate"]
          ? innerMappedVitals?.["Respiratory Rate"].abnormal
          : false,
      },
      bp: {
        value:
          (innerMappedVitals?.["Systolic Blood Pressure"]
            ? parseInt(
                innerMappedVitals?.["Systolic Blood Pressure"]?.value,
                10
              )
            : "-") +
          "/" +
          (innerMappedVitals?.["Diastolic Blood Pressure"]
            ? parseInt(
                innerMappedVitals?.["Diastolic Blood Pressure"]?.value,
                10
              )
            : "-"),
        abnormal:
          innerMappedVitals?.["Systolic Blood Pressure"]?.abnormal ||
          innerMappedVitals?.["Diastolic Blood Pressure"]?.abnormal
            ? true
            : false,
      },
    };
    if (
      innerMappedVitals?.Pulse ||
      innerMappedVitals?.SpO2 ||
      innerMappedVitals?.Temperature ||
      innerMappedVitals?.["Respiratory Rate"] ||
      innerMappedVitals?.["Systolic Blood Pressure"] ||
      innerMappedVitals?.["Diastolic Blood Pressure"]
    ) {
      vitalsHistory.push(pairedVital);
    }
  }
  return vitalsHistory;
};

export const mapBiometricsHistory = (vitalsHistoryList) => {
  let biometricsHistory = [];
  const biometricsValue = vitalsHistoryList.tabularData;
  for (const date in biometricsValue) {
    const innerMappedbiometrics = biometricsValue[date];
    const pairedBiometrics = {
      id: date,
      date: formatDate(date, defaultDateTimeFormat),
      height: {
        value: innerMappedbiometrics?.HEIGHT
          ? innerMappedbiometrics?.HEIGHT?.value
          : "--",
        abnormal: innerMappedbiometrics?.Height
          ? innerMappedbiometrics?.HEIGHT.abnormal
          : false,
      },
      weight: {
        value: innerMappedbiometrics?.WEIGHT
          ? innerMappedbiometrics?.WEIGHT?.value
          : "--",
        abnormal: innerMappedbiometrics?.WEIGHT
          ? innerMappedbiometrics?.WEIGHT.abnormal
          : false,
      },
      bmi: {
        value: innerMappedbiometrics?.BMI
          ? innerMappedbiometrics?.BMI?.value
          : "--",
        abnormal: innerMappedbiometrics?.BMI
          ? innerMappedbiometrics?.BMI.abnormal
          : false,
      },
      muac: {
        value: innerMappedbiometrics?.MUAC
          ? innerMappedbiometrics?.MUAC?.value
          : "--",
        abnormal: innerMappedbiometrics?.MUAC
          ? innerMappedbiometrics?.MUAC.abnormal
          : false,
      },
    };
    if (
      innerMappedbiometrics?.BMI ||
      innerMappedbiometrics?.HEIGHT ||
      innerMappedbiometrics?.WEIGHT ||
      innerMappedbiometrics?.MUAC
    ) {
      biometricsHistory.push(pairedBiometrics);
    }
  }
  return biometricsHistory;
};

export const vitalsHistoryHeaders = [
  {
    id: "1",
    header: "Date and Time",
    key: "date",
    isSortable: false,
  },
  {
    id: "2",
    header: "Pulse (beats/min)",
    key: "pulse",
    isSortable: false,
  },
  {
    id: "3",
    header: "SPO2 (%)",
    key: "spO2",
    isSortable: false,
  },
  {
    id: "4",
    header: "R.rate (breaths/min)",
    key: "respiratoryRate",
    isSortable: false,
  },
  {
    id: "5",
    header: "Temp (DEG C)",
    key: "temperature",
    isSortable: false,
  },
  {
    id: "6",
    header: "BP (mmHg)",
    key: "bp",
    isSortable: false,
  },
];

export const biometricsHistoryHeaders = [
  {
    id: "1",
    header: "Date and Time",
    key: "date",
    isSortable: false,
  },
  {
    id: "2",
    header: "Height (cm)",
    key: "height",
    isSortable: false,
  },
  {
    id: "3",
    header: "Weight (kg)",
    key: "weight",
    isSortable: false,
  },
  {
    id: "4",
    header: "BMI (kg/m2)",
    key: "bmi",
    isSortable: false,
  },
  {
    id: "5",
    header: "MUAC (cm)",
    key: "muac",
    isSortable: false,
  },
];
export const abnormalHeader = [
  "temperature",
  "spO2",
  "bmi",
  "pulse",
  "bp",
  "weight",
  "height",
  "muac",
  "respiratoryRate",
];
