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
        duration: duration ? duration + " " + durationUnits : null,
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
            notes: status === "MISSED" ? "Missed" : notes,
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

export const getDateTime = (date, time) => {
  const [hour, minute] = time.split(":");
  let currentShiftStartTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parseInt(hour),
    parseInt(minute)
  );
  return currentShiftStartTime.getTime();
};

const getShiftHours = (shiftRange) => {
  const [startTime, endTime] = shiftRange.split("-");
  const startMoment = moment(startTime, "HH:mm");
  const endMoment = moment(endTime, "HH:mm");
  let shiftTimeInHours = 0;
  if (endMoment.isAfter(startMoment)) {
    shiftTimeInHours = endMoment.diff(startMoment, "hours", true);
  } else {
    shiftTimeInHours = 24 - startMoment.diff(endMoment, "hours", true);
  }
  return Math.ceil(shiftTimeInHours) - 1;
};

export const getUpdatedShiftArray = (shiftRange = "") => {
  const updatedShiftHoursArray = [];
  const shiftTimeInHours = getShiftHours(shiftRange);
  const [startTime] = shiftRange.split("-");
  let [lowestHour, lowestMinute] = startTime.split(":");
  let j = 0;
  while (j <= shiftTimeInHours) {
    const formattedHour = (lowestHour % 24).toString().padStart(2, "0");
    const formattedMinute = lowestMinute.toString().padStart(2, "0");
    updatedShiftHoursArray.push(`${formattedHour}:${formattedMinute}`);
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

  const currentMoment = moment(date);
  let currentRange = rangeArray[0];
  let shiftIndex = 0;
  rangeArray.forEach((range, index) => {
    const [startTime, endTime] = range.split("-");
    const startMoment = moment(startTime, "HH:mm");
    const endMoment = moment(endTime, "HH:mm");

    /* if the shift is on same date */
    if (endMoment.isAfter(startMoment)) {
      if (currentMoment.isBetween(startMoment, endMoment)) {
        currentRange = range;
        shiftIndex = index;
      }
    } else {
      /* else shift is on different dates */
      if (currentMoment.hour() < 12) {
        if (
          currentMoment.isSameOrBefore(endMoment) &&
          currentMoment.isSameOrBefore(startMoment)
        ) {
          currentRange = range;
          shiftIndex = index;
        }
      } else {
        if (
          currentMoment.isSameOrAfter(startMoment) &&
          currentMoment.isSameOrAfter(endMoment)
        ) {
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
  const [currentStartTime, currentEndTime] = currentShiftRange.split("-");
  const currentStartTimeMoment = moment(
    getDateTime(new Date(startDate), currentStartTime)
  );
  const currentEndTimeMoment = moment(
    getDateTime(new Date(endDate), currentEndTime)
  );

  const nextShiftIndex = (shiftIndex + 1) % rangeArray.length;
  const nextShiftRange = rangeArray[nextShiftIndex];
  const [nextStartTime, nextEndTime] = nextShiftRange.split("-");
  const nextStartDateMoment = moment(
    getDateTime(new Date(startDate), nextStartTime)
  );
  const nextEndDateMoment = moment(getDateTime(new Date(endDate), nextEndTime));

  let nextStartDate =
    nextStartDateMoment.diff(currentStartTimeMoment, "hours", true) < 0
      ? nextStartDateMoment.add(1, "days")
      : nextStartDateMoment;
  let nextEndDate =
    nextEndDateMoment.diff(currentEndTimeMoment, "hours", true) < 0
      ? nextEndDateMoment.add(1, "days")
      : nextEndDateMoment;

  return {
    startDateTime: +nextStartDate,
    endDateTime: +nextEndDate,
    nextShiftIndex,
  };
};

export const getPreviousShiftDetails = (
  rangeArray,
  shiftIndex,
  startDate,
  endDate
) => {
  const previousShiftIndex =
    shiftIndex - 1 < 0 ? rangeArray.length - 1 : shiftIndex - 1;
  const previousShiftRange = rangeArray[previousShiftIndex];
  const [previousStartTime, previousEndTime] = previousShiftRange.split("-");
  const previousStartTimeMoment = moment(
    getDateTime(new Date(startDate), previousStartTime)
  );
  const previousEndTimeMoment = moment(
    getDateTime(new Date(endDate), previousEndTime)
  );

  const currentShiftRange = rangeArray[shiftIndex];
  const [currentStartTime, currentEndTime] = currentShiftRange.split("-");
  const currentStartTimeMoment = moment(
    getDateTime(new Date(startDate), currentStartTime)
  );
  const currentEndTimeMoment = moment(
    getDateTime(new Date(endDate), currentEndTime)
  );

  let previousStartDate =
    previousStartTimeMoment.diff(currentStartTimeMoment, "hours", true) > 0
      ? previousStartTimeMoment.subtract(1, "days")
      : previousStartTimeMoment;
  let previousEndDate =
    previousEndTimeMoment.diff(currentEndTimeMoment, "hours", true) > 0
      ? previousEndTimeMoment.subtract(1, "days")
      : previousEndTimeMoment;

  return {
    startDateTime: +previousStartDate,
    endDateTime: +previousEndDate,
    previousShiftIndex,
  };
};

export const isCurrentShift = (
  shiftDetails,
  shiftConfig,
  startDateTimeChange,
  endDateTimeChange
) => {
  const shiftDetailsObj = currentShiftHoursArray(new Date(), shiftConfig);
  const currentShift = shiftDetailsObj.currentShiftHoursArray;
  const [start, end] =
    shiftDetails.rangeArray[shiftDetails.shiftIndex].split("-");
  const [startHour, startMinute] = start.split(":");
  const [endHour, endMinute] = end.split(":");
  const firstHour = `${startHour}:${startMinute}`;
  const lastHour = `${endHour}:${endMinute}`;
  let startDateTimeCurrent = getDateTime(new Date(), firstHour);
  let endDateTimeCurrent = getDateTime(new Date(), lastHour);

  if (startDateTimeCurrent > endDateTimeCurrent) {
    const d = new Date();
    const currentHour = d.getHours();
    if (currentHour > 12) {
      d.setDate(d.getDate() + 1);
      endDateTimeCurrent = getDateTime(
        d,
        currentShift[currentShift.length - 1].replace(/:\d+$/, `:${endMinute}`)
      );
    } else {
      d.setDate(d.getDate() - 1);
      startDateTimeCurrent = getDateTime(
        d,
        currentShift[0].replace(/:\d+$/, `:${startMinute}`)
      );
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

export const setCurrentShiftTimes = (
  shiftDetails,
  isReadMode,
  visitSummary
) => {
  const currentShift = shiftDetails.currentShiftHoursArray;
  const [start, end] =
    shiftDetails.rangeArray[shiftDetails.shiftIndex].split("-");
  const [startHour, startMinute] = start.split(":");
  const [endHour, endMinute] = end.split(":");
  const firstHour = `${startHour}:${startMinute}`;
  const lastHour = `${endHour}:${endMinute}`;
  let startDateTime = getDateTime(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    firstHour
  );
  let endDateTime = getDateTime(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    lastHour
  );
  /** if shift is going on two different dates */
  if (lastHour < firstHour) {
    const d = isReadMode ? new Date(visitSummary.stopDateTime) : new Date();
    const currentHour = d.getHours();
    if (currentHour > 12) {
      d.setDate(d.getDate() + 1);
      endDateTime = getDateTime(
        d,
        currentShift[currentShift.length - 1].replace(/:\d+$/, `:${endMinute}`)
      );
    } else {
      d.setDate(d.getDate() - 1);
      startDateTime = getDateTime(
        d,
        currentShift[0].replace(/:\d+$/, `:${startMinute}`)
      );
    }
  }
  return [startDateTime, endDateTime];
};
