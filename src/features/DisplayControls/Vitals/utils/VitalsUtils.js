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

export const getPatientVitals = async (patientUuid, conceptValues) => {
  const queryParams = Object.values(conceptValues).map(
    (concept) => `obsConcepts=${concept}`
  );
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
export const getPatientVitalsHistory = async (patientUuid, conceptValues) => {
  const queryParams = Object.values(conceptValues).map(
    (concept) => `obsConcepts=${concept}`
  );
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
  setVitalsTime,
  conceptDetails
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
          value:
            VitalsValues[latestVisitDate][conceptDetails.temperature.name]
              ?.value,
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.temperature.name]
              ?.abnormal,
          unit: conceptDetails.temperature.unit,
        },
        HeartRate: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.pulse.name]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.pulse.name]?.abnormal,
          unit: conceptDetails.pulse.unit,
        },
        SystolicPressure: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.systolicPressure.name]
              ?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.systolicPressure.name]
              ?.abnormal,
          unit: conceptDetails.systolicPressure.unit,
        },
        DiastolicPressure: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.diastolicPressure.name]
              ?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.diastolicPressure.name]
              ?.abnormal,
          unit: conceptDetails.diastolicPressure.unit,
        },
        Height: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.height.name]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.height.name]?.abnormal,
          unit: conceptDetails.height.unit,
        },
        Weight: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.weight.name]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.weight.name]?.abnormal,
          unit: conceptDetails.weight.unit,
        },
        RespiratoryRate: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.respiratoryRate.name]
              ?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.respiratoryRate.name]
              ?.abnormal,
          unit: conceptDetails.respiratoryRate.unit,
        },
        SpO2: {
          value: parseInt(
            VitalsValues[latestVisitDate][conceptDetails.spO2.name]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.spO2.name]?.abnormal,
          unit: conceptDetails.spO2.unit,
        },
        BMI: {
          value: VitalsValues[latestVisitDate][conceptDetails.bmi.name]?.value,
          abnormal:
            VitalsValues[latestVisitDate][conceptDetails.bmi.name]?.abnormal,
          unit: conceptDetails.bmi.unit,
        },
      };
    }
  }
  return mappedVitals;
};

export const mapVitalsHistory = (vitalsHistoryList, conceptDetails) => {
  let vitalsHistory = [];
  const vitalsValue = vitalsHistoryList.tabularData;
  for (const date in vitalsValue) {
    const innerMappedVitals = vitalsValue[date];
    const pairedVital = {
      id: date,
      date: formatDate(date, defaultDateTimeFormat),
      pulse: {
        value: innerMappedVitals[conceptDetails.pulse.name]
          ? innerMappedVitals[conceptDetails.pulse.name]?.value
          : "--",
        abnormal: innerMappedVitals[conceptDetails.pulse.name]
          ? innerMappedVitals[conceptDetails.pulse.name].abnormal
          : false,
      },
      spO2: {
        value: innerMappedVitals[conceptDetails.spO2.name]
          ? innerMappedVitals[conceptDetails.spO2.name]?.value
          : "--",
        abnormal: innerMappedVitals[conceptDetails.spO2.name]
          ? innerMappedVitals[conceptDetails.spO2.name].abnormal
          : false,
      },

      temperature: {
        value: innerMappedVitals[conceptDetails.temperature.name]
          ? innerMappedVitals[conceptDetails.temperature.name]?.value
          : "--",
        abnormal: innerMappedVitals[conceptDetails.temperature.name]
          ? innerMappedVitals[conceptDetails.temperature.name].abnormal
          : false,
      },
      respiratoryRate: {
        value: innerMappedVitals[conceptDetails.respiratoryRate.name]
          ? innerMappedVitals[conceptDetails.respiratoryRate.name].value
          : "--",
        abnormal: innerMappedVitals[conceptDetails.respiratoryRate.name]
          ? innerMappedVitals[conceptDetails.respiratoryRate.name].abnormal
          : false,
      },
      bp: {
        value:
          (innerMappedVitals[conceptDetails.systolicPressure.name]
            ? parseInt(
                innerMappedVitals[conceptDetails.systolicPressure.name]?.value,
                10
              )
            : "-") +
          "/" +
          (innerMappedVitals[conceptDetails.diastolicPressure.name]
            ? parseInt(
                innerMappedVitals[conceptDetails.diastolicPressure.name]?.value,
                10
              )
            : "-"),
        abnormal:
          innerMappedVitals[conceptDetails.systolicPressure.name]?.abnormal ||
          innerMappedVitals[conceptDetails.diastolicPressure.name]?.abnormal
            ? true
            : false,
      },
    };
    if (
      innerMappedVitals[conceptDetails.pulse.name] ||
      innerMappedVitals[conceptDetails.spO2.name] ||
      innerMappedVitals[conceptDetails.temperature.name] ||
      innerMappedVitals[conceptDetails.respiratoryRate.name] ||
      innerMappedVitals[conceptDetails.systolicPressure.name] ||
      innerMappedVitals[conceptDetails.diastolicPressure.name]
    ) {
      vitalsHistory.push(pairedVital);
    }
  }
  return vitalsHistory;
};

export const mapBiometricsHistory = (vitalsHistoryList, conceptDetails) => {
  let biometricsHistory = [];
  const biometricsValue = vitalsHistoryList.tabularData;
  for (const date in biometricsValue) {
    const innerMappedbiometrics = biometricsValue[date];
    const pairedBiometrics = {
      id: date,
      date: formatDate(date, defaultDateTimeFormat),
      height: {
        value: innerMappedbiometrics[conceptDetails.height.name]
          ? innerMappedbiometrics[conceptDetails.height.name]?.value
          : "--",
        abnormal: innerMappedbiometrics[conceptDetails.height.name]
          ? innerMappedbiometrics[conceptDetails.height.name].abnormal
          : false,
      },
      weight: {
        value: innerMappedbiometrics[conceptDetails.weight.name]
          ? innerMappedbiometrics[conceptDetails.weight.name]?.value
          : "--",
        abnormal: innerMappedbiometrics[conceptDetails.weight.name]
          ? innerMappedbiometrics[conceptDetails.weight.name].abnormal
          : false,
      },
      bmi: {
        value: innerMappedbiometrics[conceptDetails.bmi.name]
          ? innerMappedbiometrics[conceptDetails.bmi.name]?.value
          : "--",
        abnormal: innerMappedbiometrics[conceptDetails.bmi.name]
          ? innerMappedbiometrics[conceptDetails.bmi.name].abnormal
          : false,
      },
      muac: {
        value: innerMappedbiometrics[conceptDetails.muac.name]
          ? innerMappedbiometrics[conceptDetails.muac.name]?.value
          : "--",
        abnormal: innerMappedbiometrics[conceptDetails.muac.name]
          ? innerMappedbiometrics[conceptDetails.muac.name].abnormal
          : false,
      },
    };
    if (
      innerMappedbiometrics[conceptDetails.bmi.name] ||
      innerMappedbiometrics[conceptDetails.height.name] ||
      innerMappedbiometrics[conceptDetails.weight.name] ||
      innerMappedbiometrics[conceptDetails.muac.name]
    ) {
      biometricsHistory.push(pairedBiometrics);
    }
  }
  return biometricsHistory;
};

export const getVitalsHistoryHeaders = (conceptDetails) => [
  {
    id: "1",
    header: (
      <FormattedMessage
        id={"DATE_TIME_HEADER"}
        defaultMessage={`Date and Time`}
      />
    ),
    key: "date",
    isSortable: false,
  },
  {
    id: "2",
    header: (
      <FormattedMessage
        id={"PULSE_HEADER"}
        defaultMessage={`Pulse ({unit})`}
        values={{ unit: conceptDetails.pulse.unit }}
      />
    ),
    key: "pulse",
    isSortable: false,
  },
  {
    id: "3",
    header: (
      <FormattedMessage
        id={"SPO2_HEADER"}
        defaultMessage={`SPO2 ({unit})`}
        values={{ unit: conceptDetails.spO2.unit }}
      />
    ),
    key: "spO2",
    isSortable: false,
  },
  {
    id: "4",
    header: (
      <FormattedMessage
        id={"VRESPIRATORY_RATE_HEADER"}
        defaultMessage={`R.rate ({unit})`}
        values={{ unit: conceptDetails.respiratoryRate.unit }}
      />
    ),
    key: "respiratoryRate",
    isSortable: false,
  },
  {
    id: "5",
    header: (
      <FormattedMessage
        id={"TEMPERATURE_HEADER"}
        defaultMessage={`Temp ({unit})`}
        values={{ unit: conceptDetails.temperature.unit }}
      />
    ),
    key: "temperature",
    isSortable: false,
  },
  {
    id: "6",
    header: (
      <FormattedMessage
        id={"BLOOD_PRESSURE_HEADER"}
        defaultMessage={`BP ({unit})`}
        values={{ unit: conceptDetails.systolicPressure.unit }}
      />
    ),
    key: "bp",
    isSortable: false,
  },
];

export const getBiometricsHistoryHeaders = (conceptDetails) => [
  {
    id: "1",
    header: (
      <FormattedMessage
        id={"DATE_TIME_HEADER"}
        defaultMessage={`Date and Time`}
      />
    ),
    key: "date",
    isSortable: false,
  },
  {
    id: "2",
    header: (
      <FormattedMessage
        id={"HEIGHT_HEADER"}
        defaultMessage={`Height ({unit})`}
        values={{ unit: conceptDetails.height.unit }}
      />
    ),
    key: "height",
    isSortable: false,
  },
  {
    id: "3",
    header: (
      <FormattedMessage
        id={"WEIGHT_HEADER"}
        defaultMessage={`Weight ({unit})`}
        values={{ unit: conceptDetails.weight.unit }}
      />
    ),
    key: "weight",
    isSortable: false,
  },
  {
    id: "4",
    header: (
      <FormattedMessage
        id={"BMI_HEADER"}
        defaultMessage={`BMI ({unit})`}
        values={{ unit: conceptDetails.bmi.unit }}
      />
    ),
    key: "bmi",
    isSortable: false,
  },
  {
    id: "5",
    header: (
      <FormattedMessage
        id={"MUAC_HEADER"}
        defaultMessage={`MUAC ({unit})`}
        values={{ unit: conceptDetails.muac.unit }}
      />
    ),
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
