import axios from "axios";
import { MEDICATIONS_BASE_URL } from "../../../../constants";
import moment from "moment";

export const fetchMedicationNursingTasks = async (patientUuid, forDate) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&forDate=${forDate}`;
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const GetUTCEpochForDate = (viewDate) => moment.utc(viewDate).unix();

export const ExtractMedicationNursingTasksData = (
  medicationNursingTasksData
) => {
  const extractedData = [];
  medicationNursingTasksData.forEach((item) => {
    const { slots } = item;

    slots.forEach((slot) => {
      const { startTime, uuid, order } = slot;
      const drugName = order.drug.display;
      const drugRoute = order.route.display;
      let duration, dosage, doseType;
      if (order.duration) {
        duration = order.duration + " " + order.durationUnits.display;
      }
      if (
        order.doseUnits.display !== "ml" &&
        order.doseUnits.display !== "mg"
      ) {
        dosage = order.dose;
        doseType = order.doseUnits.display;
      } else {
        dosage = order.dose + order.doseUnits.display;
      }
      const startTimeInDate = new Date(startTime * 1000);
      extractedData.push({
        drugName,
        drugRoute,
        duration,
        dosage,
        doseType,
        uuid,
        startTimeInEpochSeconds: startTime,
        stopTime: order.dateStopped,
        startTime: startTimeInDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
      });
    });
  });
  extractedData.sort((a, b) => a.startTime.localeCompare(b.startTime));

  const groupedData = [];
  let currentStartTime = null;
  let currentGroup = [];

  extractedData.forEach((item) => {
    if (item.startTime !== currentStartTime && !item.stopTime) {
      if (currentGroup.length > 0) {
        groupedData.push(currentGroup);
      }
      currentGroup = [item];
      currentStartTime = item.startTime;
    } else {
      currentGroup.push(item);
    }
  });

  if (currentGroup.length > 0) {
    groupedData.push(currentGroup);
  }

  return groupedData;
};
