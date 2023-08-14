import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import Calendar from "../Calendar/Calendar";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import "./DrugChart.scss";
import DrugList from "../DrugList/DrugList";
import DrugChartLegend from "../DrugChartLegend/DrugChartLegend";
export default function DrugChart(props) {
  const { drugChartData } = props;
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
  return (
    <div className="drug-chart-dashboard">
      <div className="drug-chart">
        <div
          className="drug-chart-left-panel"
          data-testid="left-panel"
          ref={leftPane}
        >
          <div className="header" />
          <DrugList drugDetails={drugChartData[1]} />
        </div>
        <div
          className="drug-chart-content"
          data-testid="right-panel"
          ref={rightPane}
        >
          <CalendarHeader />
          <Calendar calendarData={drugChartData[0]} />
        </div>
      </div>
      <DrugChartLegend />
    </div>
  );
}
DrugChart.propTypes = {
  drugChartData: PropTypes.array.isRequired,
};
