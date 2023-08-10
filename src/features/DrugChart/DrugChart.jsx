import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import moment from "moment";
import Calendar from "../Calendar/Calendar";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import "./DrugChart.scss";
import DrugList from "../DrugList/DrugList";
import DrugChartLegend from "../DrugChartLegend/DrugChartLegend";
import { fetchMedications } from "../../utils/DrugChartUtils";
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
export default function DrugChart(props) {
  const { patientId, viewDate } = props;
  console.log("DrugChart: patientId: ", patientId);
  console.log("DrugChart: viewDate: ", viewDate);
  const forDate = GetUTCEpochForDate(viewDate);
  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const { registerPane, unregisterPane } = useScrollSync({
    vertical: true,
  });
  useEffect(() => {
    if (leftPane.current) {
      registerPane(leftPane.current);
    }
    if (rightPane.current) {
      registerPane(rightPane.current);
    }
    return () => {
      if (leftPane.current) {
        unregisterPane(leftPane.current);
      }
      if (rightPane.current) {
        unregisterPane(rightPane.current);
      }
    };
  }, [leftPane, rightPane, registerPane, unregisterPane]);
  useEffect(() => {
    fetchMedication();
  }, []);
  const [drugchartdataNew, setDrugChartDataNew] = useState([[], []]);
  const [isLoading, setLoading] = useState(true);
  const fetchMedication = async () => {
    const response = await fetchMedications(patientId, forDate);
    if (response.status === 200) {
      setDrugChartDataNew(TransformDrugChartData(response.data));
      setLoading(false);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="drug-chart-dashboard">
      <div className="drug-chart">
        <div className="drug-chart-left-panel" ref={leftPane}>
          <div className="header" />
          <DrugList drugDetails={drugchartdataNew[1]} />
        </div>
        <div className="drug-chart-content" ref={rightPane}>
          <CalendarHeader />
          <Calendar calendarData={drugchartdataNew[0]} />
        </div>
      </div>
      <DrugChartLegend />
    </div>
  );
}
DrugChart.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
