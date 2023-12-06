import axios from "axios";
import { MEDICATIONS_BASE_URL } from "../../../../constants";
import data from "../../../../utils/config.json";

const { config: { drugChart = {} } = {} } = data;

export const fetchMedications = async (patientUuid, forDate) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&forDate=${forDate}`;
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const isLateTask = (startTime) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    drugChart.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTime < currentTime - lateTaskStatusWindowInSeconds;
};
