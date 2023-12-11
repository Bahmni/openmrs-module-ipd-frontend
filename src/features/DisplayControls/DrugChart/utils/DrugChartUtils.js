import axios from "axios";
import moment from "moment";
import { MEDICATIONS_BASE_URL } from "../../../../constants";
import data from "../../../../utils/config.json";
import { AdminMedicationData } from "../components/AdminMedicationData";

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

const isLateTask = (startTime) => {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const lateTaskStatusWindowInSeconds =
    drugChart.timeInMinutesFromNowToShowPastTaskAsLate * 60;

  return startTime < currentTime - lateTaskStatusWindowInSeconds;
};

const isAdministeredLateTask = (startTime, effectiveStartDate) => {
  const lateTaskStatusWindowInSeconds =
    drugChart.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;

  return effectiveStartDate - startTime > lateTaskStatusWindowInSeconds;
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
  console.log("drugChartData", drugChartData);

  AdminMedicationData.map((schedule) => {
    const { slots } = schedule;

    const administeredTimeInfo = [];

    slots.forEach((slot) => {
      const slotData = {};
      const { startTime, status, order, medicationAdministration } = slot;
      let medicationStatus = "Pending";
      let adminInfo = "",
        administeredTime;

      const isCompleted = checkIfSlotIsAdministered(status);

      if (isCompleted) {
        const isLate = isAdministeredLateTask(
          startTime,
          medicationAdministration.administeredDateTime
        );
        medicationStatus = isLate ? "Administered-Late" : "Administered";
        if (medicationAdministration) {
          const { administeredDateTime, provider } = medicationAdministration;
          const administeredDateTimeObject = new Date(
            administeredDateTime * 1000
          );
          administeredTime = moment(administeredDateTimeObject).format("HH:mm");
          adminInfo = provider.display + " [" + administeredTime + "]";
        } else {
          adminInfo = "";
        }
      }

      const drugOrder = {
        uuid: order.uuid,
        drugName: order.drug.display,
        drugRoute: order.route.display,
        administrationInfo: administeredTimeInfo,
        dosingInstructions: order.dosingInstructions,
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

      const startDateTimeObj = new Date(startTime * 1000);

      const setLateStatus = isLateTask(startTime);
      const startHour = startDateTimeObj.getHours();
      const startMinutes = startDateTimeObj.getMinutes();
      slotData[startHour] = {
        minutes: startMinutes,
        status: !isCompleted && setLateStatus ? "Late" : medicationStatus,
        administrationInfo: adminInfo,
      };
      if (
        medicationStatus === "Administered" ||
        medicationStatus === "Administered-Late"
      ) {
        const adminData = {
          kind: medicationStatus,
          time: administeredTime,
        };
        drugOrder.administrationInfo.push(adminData);
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
