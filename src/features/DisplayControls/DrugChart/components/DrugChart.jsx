import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";
import "../styles/DrugChart.scss";
import DrugList from "./DrugList";
import DrugChartLegend from "../../../../components/AdministrationLegend/AdministrationLegend";
export default function DrugChart(props) {
  const { drugChartData, currentShiftArray, selectedDate } = props;
  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const { registerPane, unregisterPane } = useScrollSync({
    vertical: true,
  });
  const drugChartRowHeight = 66;
  const drugChartHeight = (drugChartData[0].length + 2) * drugChartRowHeight;
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
      <div className="drug-chart" style={{ height: drugChartHeight }}>
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
          <CalendarHeader currentShiftArray={currentShiftArray} />
          <Calendar
            calendarData={drugChartData[0]}
            currentShiftArray={currentShiftArray}
            selectedDate={selectedDate}
          />
        </div>
      </div>
      <DrugChartLegend />
    </div>
  );
}
DrugChart.propTypes = {
  drugChartData: PropTypes.array.isRequired,
  currentShiftArray: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
};
