import axios from "axios";
import { MEDICATIONS_BASE_URL, performerFunction } from "../../../../constants";
import data from "../../../../utils/config.json";
import _ from "lodash";

const { config: { drugChart = {} } = {} } = data;

export const fetchMedications = async (
  patientUuid,
  startDateTime,
  endDateTime
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startDateTime}&endTime=${endDateTime}&view=drugChart`;
  try {
    return await axios.get(FETCH_MEDICATIONS_URL);
  } catch (error) {
    console.error(error);
  }
};

export const transformDrugOrders = (orders) => {
  const { ipdDrugOrders, emergencyMedications } = orders;
  const medicationData = {};
  ipdDrugOrders.forEach((order) => {
    if (
      order.drugOrder?.careSetting === "INPATIENT" &&
      order.drugOrderSchedule
    ) {
      const { dosingInstructions, drug, duration, durationUnits } =
        order.drugOrder;
      let dosage = "",
        doseUnits;
      if (
        dosingInstructions.doseUnits?.toLowerCase() === "ml" ||
        dosingInstructions.doseUnits?.toLowerCase() === "mg"
      ) {
        dosage = dosingInstructions.dose + dosingInstructions.doseUnits;
      } else {
        dosage = dosingInstructions.dose;
        doseUnits = dosingInstructions.doseUnits;
      }
      medicationData[order.drugOrder.uuid] = {
        name: drug.name,
        dosingInstructions: {
          route: dosingInstructions.route,
          dosage,
          doseUnits,
          asNeeded: dosingInstructions.asNeeded,
          instructions: JSON.parse(
            dosingInstructions.administrationInstructions
          ),
        },
        duration: duration + " " + durationUnits,
        slots: [],
        dateStopped: order.drugOrder.dateStopped,
        firstSlotStartTime:
          order.drugOrderSchedule.slotStartTime ||
          (order.drugOrderSchedule.firstDaySlotsStartTime &&
            order.drugOrderSchedule.firstDaySlotsStartTime[0]) ||
          order.drugOrderSchedule.dayWiseSlotsStartTime[0],
        notes: order.notes && order.notes[0].text,
      };
    }
  });
  emergencyMedications.forEach((medication) => {
    const { drug, notes, uuid, route } = medication;
    let dosage = "",
      doseUnits;
    if (
      medication.doseUnits?.toLowerCase() === "ml" ||
      medication.doseUnits?.toLowerCase() === "mg"
    ) {
      dosage = medication.dose + medication.doseUnits;
    } else {
      dosage = medication.dose;
      doseUnits = medication.doseUnits;
    }
    medicationData[uuid] = {
      uuid: drug.uuid,
      name: drug.display,
      dosingInstructions: {
        dosage,
        doseUnits,
        route,
      },
      notes: notes[0].text,
    };
  });
  console.log("medicationData -> ", medicationData);
  return medicationData;
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
const sortByStartTime = (a, b) => a.startTime - b.startTime;

export const SortDrugChartData = (drugChartData) => {
  drugChartData.forEach((item) => {
    item.slots.sort(sortByStartTime);
  });
  return drugChartData;
};

export const getDateFormatString = () =>
  drugChart.enable24HourTime ? "DD/MM/YYYY | HH:mm" : "DD/MM/YYYY | hh:mm A";

export const getHourFormatString = () =>
  drugChart.enable24HourTime ? "HH:mm" : "hh:mm";

export const resetDrugOrdersSlots = (drugOrders) => {
  Object.keys(drugOrders).forEach((order) => {
    drugOrders[order].slots = [];
  });
  return drugOrders;
};

export const mapDrugOrdersAndSlots = (drugChartData, drugOrders) => {
  console.log("drugChartData -> ", drugChartData);
  console.log("drugOrders -> ", drugOrders);

  const orders = resetDrugOrdersSlots(drugOrders);

  if (drugChartData && drugChartData.length > 0 && !_.isEmpty(orders)) {
    let slots;
    if (drugChartData[0]) {
      slots = drugChartData[0].slots;
    }
    slots?.forEach((slot) => {
      const { startTime, status, order, medicationAdministration } = slot;
      let administrationStatus = "Pending";
      if (medicationAdministration) {
        const { administeredDateTime } = medicationAdministration;
        if (status === "COMPLETED") {
          if (isAdministeredLateTask(startTime, administeredDateTime)) {
            administrationStatus = "Administered-Late";
          } else {
            administrationStatus = "Administered";
          }
        }
      } else {
        if (isLateTask(startTime)) {
          administrationStatus = "Late";
        }
      }
      let performerName = "",
        notes = "";
      if (medicationAdministration) {
        const { providers, notes: administeredNotes } =
          medicationAdministration;
        let performer = providers.find(
          (provider) => provider.function === performerFunction
        );
        performer = performer ? performer.provider : null;
        performerName = performer
          ? performer.display.includes(" - ")
            ? performer.display.split(" - ")[1]
            : performer.display
          : "";
        notes =
          administeredNotes && administeredNotes.length > 0 && performer
            ? administeredNotes?.find(
                (note) => note.author.uuid === performer.uuid
              ).text
            : "";
      }
      orders[order.uuid].slots.push({
        ...slot,
        administrationSummary: {
          performerName,
          notes,
          status: administrationStatus,
        },
      });
    });
    const mappedOrders = Object.keys(orders).map((orderUuid) => {
      return {
        uuid: orderUuid,
        ...orders[orderUuid],
      };
    });
    mappedOrders.sort((a, b) => a.firstSlotStartTime - b.firstSlotStartTime);
    console.log("mappedOrders -> ", mappedOrders);
    return mappedOrders;
  } else {
    return [];
  }
};
export const ifMedicationNotesPresent = (medicationNotes, side) =>
  (side === "Administered-Late" ||
    side === "Administered" ||
    side === "Not-Administered") &&
  Boolean(medicationNotes);

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
    let [firstHour, lastHour] = range.split("-");
    firstHour = +firstHour;
    lastHour = +lastHour;

    /** if the shift is on same date */
    if (lastHour > firstHour) {
      if (currentHour >= firstHour && currentHour <= lastHour) {
        currentRange = range;
      }
    } else {
      /** else shift is on different dates */
      if (currentHour < 12) {
        if (currentHour <= lastHour && currentHour <= firstHour) {
          currentRange = range;
        }
      } else {
        if (currentHour >= firstHour && currentHour >= lastHour) {
          currentRange = range;
        }
      }
    }
  });

  const currentShiftHoursArray = [];
  const currentRangeArray = currentRange.split("-");
  let lowestHour = parseInt(currentRangeArray[0]);
  let j = 0;
  while (j < shiftTimeInHours) {
    currentShiftHoursArray.push(lowestHour % 24);
    lowestHour++;
    j++;
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
