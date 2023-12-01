import axios from "axios";
import { PATIENT_VITALS_URL } from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { formatDateAsString } from "../../../../utils/DateFormatter";

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
  const dateAndTime = formatDate(latestDateAndTime).split(" ");
  setVitalsDate(formatDateAsString(new Date(latestDateAndTime), "DD/MM/YYYY"));
  setVitalsTime(dateAndTime.slice(3).join(" ").toUpperCase());
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
  ];
  const queryParams = conceptValues.map((concept) => `obsConcepts=${concept}`);
  const conceptParams = queryParams.join("&");
  try {
    const response = await axios.get(
      `${PATIENT_VITALS_URL}?patientUuid=${patientUuid}&${conceptParams}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const mapVitalsData = (VitalsList, setVitalsDate, setVitalsTime) => {
  let mappedVitals = {};
  let latestDate = null;
  if (VitalsList.tabularData) {
    const VitalsValues = VitalsList.tabularData;
    latestDate = getLatestDate(VitalsValues);
    if (latestDate !== null) {
      setDateAndTime(latestDate, setVitalsDate, setVitalsTime);
      mappedVitals = {
        Temp: {
          value: VitalsValues[latestDate].Temperature?.value,
          abnormal: VitalsValues[latestDate].Temperature?.abnormal,
        },
        HeartRate: {
          value: parseInt(VitalsValues[latestDate].Pulse?.value, 10),
          abnormal: VitalsValues[latestDate].Pulse?.abnormal,
        },
        SystolicPressure: {
          value: parseInt(
            VitalsValues[latestDate]["Systolic Blood Pressure"]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestDate]["Systolic Blood Pressure"]?.abnormal,
        },
        DiastolicPressure: {
          value: parseInt(
            VitalsValues[latestDate]["Diastolic Blood Pressure"]?.value,
            10
          ),
          abnormal:
            VitalsValues[latestDate]["Diastolic Blood Pressure"]?.abnormal,
        },
        Height: {
          value: parseInt(VitalsValues[latestDate].HEIGHT?.value, 10),
          abnormal: VitalsValues[latestDate].HEIGHT?.abnormal,
        },
        Weight: {
          value: parseInt(VitalsValues[latestDate].WEIGHT?.value, 10),
          abnormal: VitalsValues[latestDate].WEIGHT?.abnormal,
        },
        RespiratoryRate: {
          value: parseInt(
            VitalsValues[latestDate]["Respiratory Rate"]?.value,
            10
          ),
          abnormal: VitalsValues[latestDate]["Respiratory Rate"]?.abnormal,
        },
        SpO2: {
          value: parseInt(VitalsValues[latestDate].SpO2?.value, 10),
          abnormal: VitalsValues[latestDate].SpO2?.abnormal,
        },
        BMI: {
          value: VitalsValues[latestDate].BMI?.value,
          abnormal: VitalsValues[latestDate].BMI?.abnormal,
        },
      };
    }
  }
  return mappedVitals;
};

export const mapVitalsHistory = (vitalsHistoryList) => {
let vitalsHistory = [];
const vitalsValue = vitalsHistoryList.tabularData;
for (const date in vitalsValue){
  const innerMappedVitals = vitalsValue[date];
  const pairedVital = {
    date: date,
    pulse: innerMappedVitals?.Pulse  ? innerMappedVitals?.Pulse?.value : "--",
    pulseAbnormal: innerMappedVitals?.Pulse ? innerMappedVitals?.Pulse.abnormal : "--",
    spO2: innerMappedVitals?.SpO2  ? innerMappedVitals?.SpO2?.value : "--",
    spO2Abnormal: innerMappedVitals?.SpO2 ? innerMappedVitals?.SpO2.abnormal : "--",
    temperature: innerMappedVitals?.Temperature  ? innerMappedVitals?.Temperature?.value : "--",
    temperatureAbnormal: innerMappedVitals?.Temperature ? innerMappedVitals?.Temperature.abnormal : "--",
    respiratoryRate: innerMappedVitals?.["Respiratory Rate"] ? innerMappedVitals?.["Respiratory Rate"].value : "--", 
    respiratoryRateAbnormal: innerMappedVitals?.["Respiratory Rate"] ? innerMappedVitals?.["Respiratory Rate"].abnormal : "--", 
    bp: (innerMappedVitals?.["Systolic Blood Pressure"] ? innerMappedVitals?.["Systolic Blood Pressure"]?.value : "-") + "/" + (innerMappedVitals?.["Diastolic Blood Pressure"] ? innerMappedVitals?.["Diastolic Blood Pressure"]?.value : "-"),
    bpAbnormal: (innerMappedVitals?.["Systolic Blood Pressure"]?.abnormal || innerMappedVitals?.["Diastolic Blood Pressure"]?.abnormal ) ? true : false ,

  }
vitalsHistory.push(pairedVital);
}
 return vitalsHistory;
}

export const mapBiometricsHistory = (vitalsHistoryList) => {
  let biometricsHistory = [];
  const biometricsValue = vitalsHistoryList.tabularData;
  for (const date in biometricsValue){
    const innerMappedbiometrics = biometricsValue[date];
    const pairedBiometrics = {
      date: date,
      height: innerMappedbiometrics?.HEIGHT  ? innerMappedbiometrics?.HEIGHT?.value : "--",
      heightAbnormal: innerMappedbiometrics?.Height ? innerMappedbiometrics?.HEIGHT.abnormal : "--",
     
    }
  biometricsHistory.push(pairedBiometrics);
  }
   return biometricsHistory;
  }
