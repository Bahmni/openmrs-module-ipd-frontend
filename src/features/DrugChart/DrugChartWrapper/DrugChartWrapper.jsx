import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DrugChart from "../DrugChart";
import { useFetchMedications } from "../../../hooks/useFetchMedications";
export const TransformDrugChartData = (drugChartData) => {
  const drugOrderData = [];
  const transformedDrugChartData = drugChartData.map((schedule) => {
    const { slots, order } = schedule;
    const slotData = {};
    const drugOrder = {
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
    slots.forEach((slot) => {
      const { startTime, status } = slot;
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
    });
    drugOrderData.push(drugOrder);
    return slotData;
  });
  return [transformedDrugChartData, drugOrderData];
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
