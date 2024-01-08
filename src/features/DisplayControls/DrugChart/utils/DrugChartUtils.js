import axios from "axios";
import moment from "moment";
import { MEDICATIONS_BASE_URL } from "../../../../constants";
import data from "../../../../utils/config.json";

const { config: { drugChart = {} } = {} } = data;

export const fetchMedications = async (
  patientUuid,
  startDateTime,
  endDateTime
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startDateTime}&endTime=${endDateTime}`;
  try {
    const response = await axios.get(FETCH_MEDICATIONS_URL);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const isLateTask = (startTime) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    drugChart.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTime < currentTime - lateTaskStatusWindowInSeconds;
};

const isAdministeredLateTask = (startTime, effectiveStartDate) => {
  const lateTaskStatusWindowInMilliSeconds =
    drugChart.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate *
    60 *
    1000;

  return (
    effectiveStartDate - startTime * 1000 > lateTaskStatusWindowInMilliSeconds
  );
};

const checkIfSlotIsAdministered = (status) => {
  return status === "COMPLETED";
};

export const getUTCEpochForDate = (viewDate) => {
  const utcTimeEpoch = moment.utc(viewDate).unix();
  return utcTimeEpoch;
};

export const TransformDrugChartData = (drugChartData) => {
  const drugOrderData = [];
  const slotDataByOrder = [];

  drugChartData.map((schedule) => {
    const { slots } = schedule;

    slots.forEach((slot) => {
      let administeredStartHour, administeredStartMinutes, medicationNotes;
      const slotData = {};
      const { startTime, status, order, medicationAdministration } = slot;
      let medicationStatus = "Pending";
      let adminInfo = "",
        administeredTime,
        startActualTime;

      const isCompleted = checkIfSlotIsAdministered(status);

      if (isCompleted) {
        const isLate = isAdministeredLateTask(
          startTime,
          medicationAdministration.administeredDateTime
        );
        medicationStatus = isLate ? "Administered-Late" : "Administered";
        if (medicationAdministration) {
          const { administeredDateTime, providers, notes } =
            medicationAdministration;
          const administeredDateTimeObject = new Date(administeredDateTime);
          administeredTime = moment(administeredDateTimeObject).format("HH:mm");
          adminInfo =
            providers[0].provider.display + " [" + administeredTime + "]";
          administeredStartHour = administeredDateTimeObject.getHours();
          administeredStartMinutes = administeredDateTimeObject.getMinutes();
          medicationNotes = notes && notes.length > 0 ? notes[0].text : "";
        } else {
          adminInfo = "";
        }
      }
      const startDateTimeObj = new Date(startTime * 1000);
      startActualTime = moment(startDateTimeObj).format("HH:mm");

      const drugOrder = {
        uuid: order.uuid,
        drugName: order.drug.display,
        drugRoute: order.route.display,
        administrationInfo: [],
        dosingInstructions: order.dosingInstructions,
        dosingTagInfo: {
          asNeeded: order.asNeeded,
          frequency: order.frequency.display,
        },
      };

      if (order.duration) {
        drugOrder.duration = order.duration + " " + order.durationUnits.display;
      }
      if (order.doseUnits.display !== "ml") {
        drugOrder.dosage = order.dose;
        drugOrder.doseType = order.doseUnits.display;
      } else {
        drugOrder.dosage = order.dose + order.doseUnits.display;
      }
      if (order.duration) {
        drugOrder.duration = order.duration + " " + order.durationUnits.display;
      }

      const setLateStatus = isLateTask(startTime);
      const startHour = startDateTimeObj.getHours();
      const startMinutes = startDateTimeObj.getMinutes();
      if (isCompleted) {
        slotData[administeredStartHour] = {
          minutes: administeredStartMinutes,
          status: !isCompleted && setLateStatus ? "Late" : medicationStatus,
          administrationInfo: adminInfo,
          notes: medicationNotes,
        };
      } else {
        slotData[startHour] = {
          minutes: startMinutes,
          status: !isCompleted && setLateStatus ? "Late" : medicationStatus,
          administrationInfo: adminInfo,
          notes: medicationNotes,
        };
      }
      if (
        medicationStatus === "Administered" ||
        medicationStatus === "Administered-Late"
      ) {
        const adminData = {
          kind: medicationStatus,
          time: startActualTime,
          timeAdministered: administeredTime,
        };
        if (
          drugOrderData.some(
            (existingOrder) =>
              existingOrder.drugName === drugOrder.drugName &&
              existingOrder.uuid === drugOrder.uuid
          )
        ) {
          const index = drugOrderData.findIndex(
            (existingOrder) =>
              existingOrder.drugName === drugOrder.drugName &&
              existingOrder.uuid === drugOrder.uuid
          );
          drugOrderData[index].administrationInfo.push(adminData);
        } else {
          drugOrder.administrationInfo.push(adminData);
        }
      }
      if (
        !drugOrderData.some(
          (existingOrder) =>
            existingOrder.drugName === drugOrder.drugName &&
            existingOrder.uuid === drugOrder.uuid
        )
      ) {
        drugOrderData.push(drugOrder);
        slotDataByOrder.push(slotData);
      } else {
        const index = drugOrderData.findIndex(
          (existingOrder) =>
            existingOrder.drugName === drugOrder.drugName &&
            existingOrder.uuid === drugOrder.uuid
        );
        slotDataByOrder[index] = {
          ...slotDataByOrder[index],
          ...slotData,
        };
      }
    });
  });
  return [slotDataByOrder, drugOrderData];
};

export const ifMedicationNotesPresent = (medicationNotes, side) => {
  let notesIcon;
  if (!medicationNotes) {
    notesIcon = false;
  } else {
    notesIcon = true;
  }
  return (
    (side === "Administered-Late" ||
      side === "Administered" ||
      side === "Not-Administered") &&
    notesIcon
  );
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

  // reset the currentShiftStartTime value
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

  // reset the currentShiftStartTime value
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
