import axios from "axios";
import React from "react";
import {
  MEDICATIONS_BASE_URL,
  ADMINISTERED_MEDICATIONS_BASE_URL,
  asNeededPlaceholderConceptName,
} from "../../../../constants";
import {
  currentShiftHoursArray,
  getDateTime,
} from "../../DrugChart/utils/DrugChartUtils";
import { FormattedMessage } from "react-intl";
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
    completedExtractedData = [],
    stoppedExtractedData = [],
    skippedExtractedData = [];
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
            slot.status === "NOT_DONE",
        serviceType,
      };

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

export const isCurrentShift = (
  shiftConfig,
  startDateTimeChange,
  endDateTimeChange
) => {
  const shiftDetailsObj = currentShiftHoursArray(new Date(), shiftConfig);
  const currentShift = shiftDetailsObj.currentShiftHoursArray;
  let startDateTimeCurrent = getDateTime(new Date(), currentShift[0]);
  let endDateTimeCurrent = getDateTime(
    new Date(),
    currentShift[currentShift.length - 1] + 1
  );

  if (startDateTimeCurrent > endDateTimeCurrent) {
    const d = new Date();
    const currentHour = d.getHours();
    if (currentHour > 12) {
      d.setDate(d.getDate() + 1);
      endDateTimeCurrent = getDateTime(
        d,
        currentShift[currentShift.length - 1] + 1
      );
    } else {
      d.setDate(d.getDate() - 1);
      startDateTimeCurrent = getDateTime(d, currentShift[0]);
    }
  }
  return (
    startDateTimeCurrent == startDateTimeChange &&
    endDateTimeCurrent == endDateTimeChange
  );
};

export const NotCurrentShiftMessage = (
  <FormattedMessage
    id={"NOT_CURRENT_SHIFT_MESSAGE"}
    defaultMessage={"You're not viewing the current shift"}
  />
);
