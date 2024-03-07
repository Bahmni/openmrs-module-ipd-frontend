import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  ADMINISTERED_MEDICATIONS_BASE_URL,
  asNeededPlaceholderConceptName,
} from "../../../../constants";
import moment from "moment";

export const fetchMedicationNursingTasks = async (
  patientUuid,
  startTime,
  endTime,
  visitUuid
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}&visitUuid=${visitUuid}`;
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
  filterValue,
  isReadMode
) => {
  const extractedData = [],
    pendingExtractedData = [],
    prnExtractedData = [],
    completedExtractedData = [],
    stoppedExtractedData = [],
    skippedExtractedData = [],
    missedExtractedData = [];
  medicationNursingTasksData.forEach((item) => {
    const { slots } = item;

    slots.forEach((slot) => {
      const { startTime, uuid, order, medicationAdministration, serviceType } =
        slot;
      const administeredDateTime =
        slot.status === "COMPLETED"
          ? medicationAdministration.administeredDateTime !== null
            ? medicationAdministration.administeredDateTime
            : ""
          : "";
      let drugName, drugRoute, duration, dosage, doseType, dosingInstructions;
      if (order) {
        drugName = order.drug.display;
        drugRoute = order.route?.display;
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
        dosingInstructions = {
          asNeeded: order.asNeeded,
          frequency: order.frequency.display,
        };
      }
      if (serviceType == "EmergencyMedicationRequest") {
        drugName = medicationAdministration.drug?.display;
        drugRoute = medicationAdministration.route?.display;
        dosage =
          medicationAdministration.dose +
          medicationAdministration.doseUnits?.display;
        dosingInstructions = { emergency: true };
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
        dosingInstructions: dosingInstructions,
        startTime: startTimeInDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }),
        orderId: order?.uuid,
        isDisabled: isReadMode
          ? true
          : !!administeredDateTime ||
            slot.status === "STOPPED" ||
            slot.status === "NOT_DONE" ||
            slot.status === "MISSED",
        serviceType,
      };

      if (filterValue.id === "prn" && slotInfo.dosingInstructions.asNeeded) {
        prnExtractedData.push(slotInfo);
      }

      if (
        (filterValue.id === "stopped" || filterValue.id === "allTasks") &&
        slot.status === "STOPPED"
      ) {
        stoppedExtractedData.push({
          ...slotInfo,
          stopTime: order?.dateStopped,
        });
      } else if (
        (filterValue.id === "skipped" || filterValue.id === "allTasks") &&
        slot.status === "NOT_DONE"
      ) {
        skippedExtractedData.push({ ...slotInfo, status: "Not Done" });
      } else if (
        (filterValue.id === "completed" || filterValue.id === "allTasks") &&
        slot.status === "COMPLETED"
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
        (filterValue.id === "pending" || filterValue.id === "allTasks") &&
        slot.status === "SCHEDULED" &&
        !slot.medicationAdministration
      ) {
        pendingExtractedData.push(slotInfo);
      } else if (
        (filterValue.id === "missed" || filterValue.id === "allTasks") &&
        slot.status === "MISSED"
      ) {
        missedExtractedData.push({ ...slotInfo, status: "missed" });
      }
    });
  });
  pendingExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  completedExtractedData.sort(
    (a, b) =>
      a.administeredTimeInEpochSeconds - b.administeredTimeInEpochSeconds
  );
  stoppedExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  missedExtractedData.sort(
    (a, b) => a.startTimeInEpochSeconds - b.startTimeInEpochSeconds
  );
  extractedData.push(...pendingExtractedData);

  const groupedData = [];
  let currentStartTime = null;
  let currentGroup = [];

  extractedData.forEach((item) => {
    if (item.serviceType == asNeededPlaceholderConceptName) {
      groupedData.push([item]);
    } else {
      if (item.startTime !== currentStartTime && !item.stopTime) {
        if (currentGroup.length > 0) {
          groupedData.push(currentGroup);
        }
        currentGroup = [item];
        currentStartTime = item.startTime;
      } else {
        currentGroup.push(item);
      }
    }
  });

  if (currentGroup.length > 0) {
    groupedData.push(currentGroup);
  }
  if (filterValue.id !== "pending") {
    groupedData.push(...completedExtractedData.map((item) => [item]));
    groupedData.push(...stoppedExtractedData.map((item) => [item]));
    groupedData.push(...skippedExtractedData.map((item) => [item]));
    groupedData.push(...prnExtractedData.map((item) => [item]));
    groupedData.push(...missedExtractedData.map((item) => [item]));
  }
  return groupedData;
};

export const saveAdministeredMedication = async (administeredMedication) => {
  try {
    return await axios.post(
      ADMINISTERED_MEDICATIONS_BASE_URL,
      administeredMedication
    );
  } catch (error) {
    console.error(error);
  }
};

const timeToEpoch = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const specificTime = new Date();
  specificTime.setHours(hours, minutes, 0, 0);
  return Math.floor(specificTime.getTime() / 1000);
};

export const isTimeWithinAdministeredWindow = (
  taskTime,
  scheduledStartTime,
  nursingTasks
) => {
  const enteredTimeInEpochSeconds = timeToEpoch(taskTime);
  const timeWithinWindowInEpochSeconds =
    timeToEpoch(scheduledStartTime) +
    nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;
  return enteredTimeInEpochSeconds <= timeWithinWindowInEpochSeconds;
};
export const getTimeInSeconds = (days) => days * 86400;
