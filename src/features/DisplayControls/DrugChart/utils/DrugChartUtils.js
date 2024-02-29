import axios from "axios";
import moment from "moment";
import React from "react";
import {
  MEDICATIONS_BASE_URL,
  performerFunction,
  asNeededPlaceholderConceptName,
} from "../../../../constants";
import _ from "lodash";
import { FormattedMessage } from "react-intl";
import { getAdministrationStatus } from "../../../../utils/CommonUtils";

export const fetchMedications = async (
  patientUuid,
  startDateTime,
  endDateTime,
  visitUuid
) => {
  const FETCH_MEDICATIONS_URL = `${MEDICATIONS_BASE_URL}?patientUuid=${patientUuid}&startTime=${startDateTime}&endTime=${endDateTime}&view=drugChart&visitUuid=${visitUuid}`;
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
      const {
        dosingInstructions,
        drug,
        duration,
        durationUnits,
        drugNonCoded,
        orderReasonText,
      } = order.drugOrder;
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
        name: drug?.name || drugNonCoded,
        dosingInstructions: {
          route: dosingInstructions.route,
          dosage,
          doseUnits,
          asNeeded: dosingInstructions.asNeeded,
          frequency: dosingInstructions.frequency,
          instructions: JSON.parse(
            dosingInstructions.administrationInstructions
          ),
        },
        duration: duration + " " + durationUnits,
        slots: [],
        dateStopped: order.drugOrder.dateStopped,
        orderReasonText: orderReasonText,
        firstSlotStartTime:
          order.drugOrderSchedule.slotStartTime ||
          (order.drugOrderSchedule.firstDaySlotsStartTime &&
            order.drugOrderSchedule.firstDaySlotsStartTime[0]) ||
          order.drugOrderSchedule.dayWiseSlotsStartTime[0],
        notes: order.drugOrderSchedule?.notes,
      };
    }
  });
  emergencyMedications.forEach((medication) => {
    const { drug, uuid, route, administeredDateTime } = medication;
    const administeredDateTimeInSeconds = administeredDateTime
      ? administeredDateTime / 1000
      : null;
    let dosage = "",
      doseUnits;
    if (
      medication.doseUnits?.display?.toLowerCase() === "ml" ||
      medication.doseUnits?.display?.toLowerCase() === "mg"
    ) {
      dosage = medication.dose + medication.doseUnits.display;
    } else {
      dosage = medication.dose;
      doseUnits = medication.doseUnits?.display;
    }
    medicationData[uuid] = {
      uuid: drug.uuid,
      name: drug.display,
      dosingInstructions: {
        dosage,
        doseUnits,
        route: route?.display,
        emergency: true,
      },
      firstSlotStartTime: administeredDateTimeInSeconds,
    };
  });
  return medicationData;
};

export const isLateTask = (startTime, drugChart) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    drugChart.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTime < currentTime - lateTaskStatusWindowInSeconds;
};

export const isAdministeredLateTask = (
  startTime,
  effectiveStartDate,
  drugChart
) => {
  const lateTaskStatusWindowInMilliSeconds =
    drugChart.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate *
    60 *
    1000;

  return (
    effectiveStartDate - startTime * 1000 > lateTaskStatusWindowInMilliSeconds
  );
};

export const resetDrugOrdersSlots = (drugOrders) => {
  Object.keys(drugOrders).forEach((order) => {
    drugOrders[order].slots = [];
  });
  return drugOrders;
};

export const mapDrugOrdersAndSlots = (drugChartData, drugOrders, drugChart) => {
  const orders = resetDrugOrdersSlots(drugOrders);

  if (drugChartData && drugChartData.length > 0 && !_.isEmpty(orders)) {
    let slots;
    if (drugChartData[0]) {
      slots = drugChartData[0].slots;
    }
    slots?.forEach((slot) => {
      const {
        startTime,
        status,
        order,
        medicationAdministration,
        serviceType,
      } = slot;
      const uuid = order?.uuid || medicationAdministration?.uuid;
      if (orders[uuid] && serviceType != asNeededPlaceholderConceptName) {
        let administrationStatus = getAdministrationStatus(
          medicationAdministration,
          status,
          startTime,
          drugChart,
          slot
        );
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
        orders[uuid].slots.push({
          ...slot,
          administrationSummary: {
            performerName,
            notes,
            status: administrationStatus,
          },
        });
      }
    });
    const mappedOrders = Object.keys(orders).map((orderUuid) => {
      return {
        uuid: orderUuid,
        ...orders[orderUuid],
      };
    });
    mappedOrders.sort((a, b) => a.firstSlotStartTime - b.firstSlotStartTime);
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

export const getDateTime = (date, hour) => {
  let currentShiftStartTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return currentShiftStartTime.setHours(hour);
};

const getShiftHours = (shiftRange) => {
  const [startTime, endTime] = shiftRange.split("-");
  let [firstHour] = startTime.split(":");
  let [lastHour] = endTime.split(":");
  firstHour = +firstHour;
  lastHour = +lastHour;
  let shiftTimeInHours = 0;
  if (lastHour > firstHour) {
    shiftTimeInHours = lastHour - firstHour;
  } else {
    shiftTimeInHours = 24 - (firstHour - lastHour);
  }
  return shiftTimeInHours;
};

export const getUpdatedShiftArray = (shiftRange = "") => {
  const updatedShiftHoursArray = [];
  const shiftTimeInHours = getShiftHours(shiftRange);
  const [startTime] = shiftRange.split("-");
  let [lowestHour] = startTime.split(":");
  let j = 0;
  while (j < shiftTimeInHours) {
    updatedShiftHoursArray.push(lowestHour % 24);
    lowestHour++;
    j++;
  }
  return updatedShiftHoursArray;
};

export const currentShiftHoursArray = (date, shiftDetails = {}) => {
  const rangeArray = [];
  Object.values(shiftDetails).forEach((shift) => {
    rangeArray.push(`${shift.shiftStartTime}-${shift.shiftEndTime}`);
  });

  // finding the current hour range
  const currentDate = date;
  const currentHour = currentDate.getHours();
  let currentRange = rangeArray[0];
  let shiftIndex = 0;
  rangeArray.forEach((range, index) => {
    const [startTime, endTime] = range.split("-");
    let [firstHour] = startTime.split(":");
    let [lastHour] = endTime.split(":");
    firstHour = +firstHour;
    lastHour = +lastHour;

    /* if the shift is on same date */
    if (lastHour > firstHour) {
      if (currentHour >= firstHour && currentHour <= lastHour) {
        currentRange = range;
        shiftIndex = index;
      }
    } else {
      /* else shift is on different dates */
      if (currentHour < 12) {
        if (currentHour <= lastHour && currentHour <= firstHour) {
          currentRange = range;
          shiftIndex = index;
        }
      } else {
        if (currentHour >= firstHour && currentHour >= lastHour) {
          currentRange = range;
          shiftIndex = index;
        }
      }
    }
  });

  const currentShiftHoursArray = getUpdatedShiftArray(currentRange);
  return { rangeArray, currentShiftHoursArray, shiftIndex };
};

export const getNextShiftDetails = (
  rangeArray,
  shiftIndex,
  startDate,
  endDate
) => {
  const currentShiftRange = rangeArray[shiftIndex];
  const currentshiftInHours = getShiftHours(currentShiftRange);
  const nextStartDate = moment(startDate).add(currentshiftInHours, "h");

  const nextShiftIndex = (shiftIndex + 1) % rangeArray.length;
  const nextShiftRange = rangeArray[nextShiftIndex];
  const nextShiftInHours = getShiftHours(nextShiftRange);
  const nextEndDate = moment(endDate).add(nextShiftInHours, "h");

  return {
    startDateTime: +nextStartDate,
    endDateTime: +nextEndDate,
    nextShiftIndex,
  };
};

export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const getPreviousShiftDetails = (
  rangeArray,
  shiftIndex,
  startDate,
  endDate
) => {
  const currentShiftRange = rangeArray[shiftIndex];
  const currentshiftInHours = getShiftHours(currentShiftRange);
  const nextEndDate = moment(endDate).subtract(currentshiftInHours, "h");

  const previousShiftIndex =
    shiftIndex - 1 < 0 ? rangeArray.length - 1 : shiftIndex - 1;
  const previousShiftRange = rangeArray[previousShiftIndex];
  const previousShiftInHours = getShiftHours(previousShiftRange);
  const nextStartDate = moment(startDate).subtract(previousShiftInHours, "h");

  return {
    startDateTime: +nextStartDate,
    endDateTime: +nextEndDate,
    previousShiftIndex,
  };
};

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
