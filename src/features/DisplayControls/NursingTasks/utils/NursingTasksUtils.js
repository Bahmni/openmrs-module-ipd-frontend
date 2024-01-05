import axios from "axios";
import {
  MEDICATIONS_BASE_URL,
  ADMINISTERED_MEDICATIONS_BASE_URL,
} from "../../../../constants";
import moment from "moment";
import data from "../../../../utils/config.json";

const { config: { nursingTasks = {} } = {} } = data;
const { config: { drugChart = {} } = {} } = data;

export const fetchMedicationNursingTasks = async (
  patientUuid,
  startTime,
  endTime
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}`;
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
    stoppedExtractedData = [],
    skippedExtractedData = [];
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
        isDisabled:
          !!administeredDateTime ||
          order.dateStopped ||
          slot.medicationAdministration?.status === "Not Done",
      };

      if (order.dateStopped) {
        if (filterValue.id === "stopped" || filterValue.id === "allTasks")
          stoppedExtractedData.push({
            ...slotInfo,
            stopTime: order.dateStopped,
          });
      } else if (
        (filterValue.id === "skipped" || filterValue.id === "allTasks") &&
        slot.medicationAdministration?.status === "Not Done"
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
  scheduledStartTime
) => {
  const enteredTimeInEpochSeconds = timeToEpoch(taskTime);
  const timeWithinWindowInEpochSeconds =
    timeToEpoch(scheduledStartTime) +
    nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;

  return enteredTimeInEpochSeconds <= timeWithinWindowInEpochSeconds;
};

export const currentShiftHoursArray = () => {
  const shiftTimeInHours = drugChart.shiftHours;
  let startTime = drugChart.startTime;
  const rangeArray = [];

  let i = 0;
  while (i < 24 / shiftTimeInHours) {
    rangeArray.push(
      `${startTime}-${(startTime + (shiftTimeInHours - 1)) % 24}`
    );
    startTime = (startTime + shiftTimeInHours) % 24;
    i++;
  }

  // finding the current hour range
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  let currentRange = rangeArray[0];
  rangeArray.forEach((range) => {
    const rangeLimits = range.split("-");
    if (currentHour >= rangeLimits[0] && currentHour <= rangeLimits[1]) {
      currentRange = range;
    }
  });

  const currentShiftHoursArray = [];
  const currentRangeArray = currentRange.split("-");
  const lowestHour = parseInt(currentRangeArray[0]);
  const highestHour = parseInt(currentRangeArray[1]);

  for (let i = lowestHour; i <= highestHour; i++) {
    currentShiftHoursArray.push(i);
  }
  return currentShiftHoursArray;
};

export const getDateTime = (date, hour) => {
  let currentShiftStartTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return currentShiftStartTime.setHours(hour);
};

export const getNextShiftDetails = (
  shiftTimeArray = [],
  shiftTimeInHours = 12,
  date
) => {
  const shiftLastHour = shiftTimeArray[shiftTimeArray.length - 1];
  const currentDate = date;

  let currentShiftStartTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const startDateTime = currentShiftStartTime.setHours(shiftLastHour + 1);

  currentShiftStartTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const endDateTime = currentShiftStartTime.setHours(
    shiftLastHour + 1 + shiftTimeInHours
  );

  date = currentShiftStartTime;

  return { startDateTime, endDateTime, nextDate: date };
};

export const getPreviousShiftDetails = (
  shiftTimeArray = [],
  shiftTimeInHours = 12,
  date
) => {
  const shiftFirstHour = shiftTimeArray[0];
  const currentDate = date;

  let currentShiftStartTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const endDateTime = currentShiftStartTime.setHours(shiftFirstHour);

  currentShiftStartTime = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const startDateTime = currentShiftStartTime.setHours(
    shiftFirstHour - shiftTimeInHours
  );

  date = currentShiftStartTime;

  return { startDateTime, endDateTime, nextDate: date };
};
