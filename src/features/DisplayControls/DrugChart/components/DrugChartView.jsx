import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DrugChart from "./DrugChart";
import { useFetchMedications } from "../hooks/useFetchMedications";
import { isLateTask, isAdministeredLateTask } from "../utils/DrugChartUtils";
import { FormattedMessage } from "react-intl";
import { AdminMedicationData } from "./AdminMedicationData";

export const checkIfSlotIsAdministered = (status) => {
  return status === "COMPLETED";
};

const NoMedicationTaskMessage = (
  <FormattedMessage
    id={"NO_MEDICATION_TASKS_MESSAGE"}
    defaultMessage={"No Medication has been scheduled for the patient yet"}
  />
);

export const TransformDrugChartData = (drugChartData) => {
  const drugOrderData = [];
  const slotDataByOrder = [];
  console.log("drugChartData", drugChartData);

  AdminMedicationData.map((schedule) => {
    const { slots } = schedule;

    slots.forEach((slot) => {
      const slotData = {};
      const { startTime, status, order, medicationAdministration } = slot;
      let medicationStatus = "Pending";
      let adminInfo, administeredTime;

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
        administrationInfo: [],
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
        console.log("inside if", medicationStatus, administeredTime);
        const adminData = {
          kind: medicationStatus,
          time: administeredTime,
        };
        drugOrder.administrationInfo.push(adminData);
        console.log("drugOrder after push", drugOrder);
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
  console.log("drugOrderData", drugOrderData);
  return [slotDataByOrder, drugOrderData];
};
export const GetUTCEpochForDate = (viewDate) => {
  const utcTimeEpoch = moment.utc(viewDate).unix();
  return utcTimeEpoch;
};
export default function DrugChartWrapper(props) {
  const { patientId, viewDate } = props;
  const forDate = GetUTCEpochForDate(viewDate);

  const { drugChartData, isLoading } = useFetchMedications(patientId, forDate);
  const transformedDrugChartData = TransformDrugChartData(drugChartData);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (drugChartData && drugChartData.length === 0) {
    return <div className="no-nursing-tasks">{NoMedicationTaskMessage}</div>;
  }
  return <DrugChart drugChartData={transformedDrugChartData} />;
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
