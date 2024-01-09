import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DrugChart from "../DrugChart";
import { useFetchMedications } from "../../../hooks/useFetchMedications";
export const TransformDrugChartData = (drugChartData) => {
  const drugOrderData = [];
  const slotDataByOrder = [];

  drugChartData.map((schedule) => {
    const { slots } = schedule;

    slots.forEach((slot) => {
      const slotData = {};
      const { startTime, status, order, medicationAdministration, serviceType } = slot;

      let drugOrder;
      if (order) {
        drugOrder = {
          uuid: order.uuid,
          drugName: order.drug.display,
          drugRoute: order.route.display,
          administrationInfo: [],
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
      }
      if (serviceType == "EmergencyMedicationRequest") {
        drugOrder = {
          uuid: medicationAdministration.drug?.uuid,
          drugName: medicationAdministration.drug?.display,
          drugRoute: medicationAdministration.route?.display,
          dosage: medicationAdministration.dose + medicationAdministration.doseUnits?.display,
          dosingInstructions: { emergency: true }
        }
      }

      const startDateTimeObj = new Date(startTime * 1000);
      let adminInfo, administeredTime;
      if (slot.admin) {
        const { administeredBy, administeredAt } = slot.admin;
        administeredTime = moment(new Date(administeredAt)).format("HH:mm");
        adminInfo = administeredBy + " [" + administeredTime + "]";
      } else {
        adminInfo = "";
      }
      const startHour = startDateTimeObj.getHours();
      const startMinutes = startDateTimeObj.getMinutes();
      slotData[startHour] = {
        minutes: startMinutes,
        status: status,
        administrationInfo: adminInfo,
      };
      if (status === "Administered" || status === "Administered-Late") {
        drugOrder.administrationInfo.push({
          kind: status,
          time: administeredTime,
        });
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
  return <DrugChart drugChartData={transformedDrugChartData} />;
}
DrugChartWrapper.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
