import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  ADMINISTERED_MEDICATIONS_BASE_URL,
} from "../../../../constants";
import moment from "moment";
import data from "../../../../utils/config.json";

const { config: { nursingTasks = {} } = {} } = data;

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
  medicationNursingTasksData,
  filterValue
) => {
  const extractedData = [],
    pendingExtractedData = [],
    completedExtractedData = [],
    stoppedExtractedData = [];
  medicationNursingTasksData.forEach((item) => {
    const { slots } = item;

    slots.forEach((slot) => {
      const { startTime, uuid, order, medicationAdministration } = slot;
      const administeredDateTime =
        slot.status === "COMPLETED"
          ? medicationAdministration.administeredDateTime !== null
            ? medicationAdministration.administeredDateTime
            : ""
          : "";
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
      let administeredTimeInDate = "";
      if (administeredDateTime !== "")
        administeredTimeInDate = new Date(administeredDateTime * 1000);

      const slotInfo = {
        drugName,
        drugRoute,
        duration,
        dosage,
        doseType,
        uuid,
        startTimeInEpochSeconds: startTime,
        dosingInstructions: {
          asNeeded: order?.asNeeded,
          frequency: order.frequency?.display,
        },
        startTime: startTimeInDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        orderId: order.uuid,
        isDisabled: administeredDateTime || order.dateStopped,
      };

      if (order.dateStopped) {
        if (filterValue.id === "stopped" || filterValue.id === "allTasks")
          stoppedExtractedData.push({
            ...slotInfo,
            stopTime: order.dateStopped,
          });
      } else if (
        (filterValue.id === "completed" && slot.status === "COMPLETED") ||
        (filterValue.id === "allTasks" && slot.status === "COMPLETED")
      ) {
        completedExtractedData.push({
          ...slotInfo,
          administeredTimeInEpochSeconds: administeredDateTime,
          administeredTime:
            administeredTimeInDate !== ""
              ? administeredTimeInDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hourCycle: "h23",
                })
              : "",
        });
      } else if (
        (filterValue.id === "pending" && slot.status === "SCHEDULED") ||
        (filterValue.id === "allTasks" && slot.status === "SCHEDULED")
      ) {
        pendingExtractedData.push(slotInfo);
      }
    });
  });

  pendingExtractedData.sort((a, b) => a.startTime.localeCompare(b.startTime));
  completedExtractedData.sort((a, b) =>
    a.administeredTime.localeCompare(b.administeredTime)
  );
  stoppedExtractedData.sort((a, b) => a.startTime.localeCompare(b.startTime));
  extractedData.push(...pendingExtractedData);

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
  if (stoppedExtractedData.length > 0) {
    groupedData.push(...stoppedExtractedData.map((item) => [item]));
  }
  if (completedExtractedData.length > 0) {
    groupedData.push(...completedExtractedData.map((item) => [item]));
  }
  return groupedData;
};

export const saveAdministeredMedication = async (administeredMedication) => {
  try {
    const response = await axios.post(
      ADMINISTERED_MEDICATIONS_BASE_URL,
      administeredMedication
    );
    return response;
  } catch (error) {
    console.error(error);
  }
};

const timeToEpoch = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const specificTime = new Date();
  specificTime.setHours(hours, minutes, 0, 0);
  const epochTimeInSeconds = Math.floor(specificTime.getTime() / 1000);
  return epochTimeInSeconds;
};

export const isTimeWithinAdministeredWindow = (
  taskTime,
  scheduledStartTime
) => {
  const enteredTimeInEpochSeconds = timeToEpoch(taskTime);
  const timeWithinWindowInEpochSeconds =
    timeToEpoch(scheduledStartTime) +
    nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;

  if (enteredTimeInEpochSeconds > timeWithinWindowInEpochSeconds) {
    return false;
  } else return true;
};
