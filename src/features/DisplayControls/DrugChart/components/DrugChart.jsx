import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";
import "../styles/DrugChart.scss";
import DrugList from "./DrugList";
import DrugChartLegend from "../../../../components/AdministrationLegend/AdministrationLegend";
import { Button } from "carbon-components-react";
import { ChevronDown20, ChevronUp20 } from "@carbon/icons-react";
export default function DrugChart(props) {
  const { drugChartData, currentShiftArray, selectedDate } = props;
  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const { registerPane, unregisterPane } = useScrollSync({
    vertical: true,
  });
  const drugChartRowHeight = 66;
  const drugChartHeight = (drugChartData?.length + 1) * drugChartRowHeight;
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
    const handleScroll = () => {
      const leftPaneElement = leftPane.current;
      const scrollTop = leftPaneElement.scrollTop;
      const maxScrollTop =
        leftPaneElement.scrollHeight - leftPaneElement.clientHeight;

      setIsPrevDisabled(scrollTop <= 0);
      setIsNextDisabled(scrollTop >= maxScrollTop);
    };

    leftPane.current.addEventListener("scroll", handleScroll);
    return () => {
      leftPane.current.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = (direction) => {
    const scrollAmount = 100;
    const newScrollTop =
      leftPane.current.scrollTop +
      (direction === "Prev" ? -scrollAmount : scrollAmount);
    leftPane.current.scrollTop = newScrollTop;
    rightPane.current.scrollTop = newScrollTop;

    const scrollTop = newScrollTop;
    const maxScrollTop =
      leftPane.current.scrollHeight - leftPane.current.clientHeight;
    setIsPrevDisabled(scrollTop <= 0);
    setIsNextDisabled(scrollTop >= maxScrollTop);
  };

  return (
    <div className="drug-chart-dashboard">
      <div className="drug-chart" style={{ height: drugChartHeight }}>
        <div
          className="drug-chart-left-panel"
          data-testid="left-panel"
          ref={leftPane}
        >
          <div className="header">
            <Button
              className="arrow-button"
              renderIcon={ChevronUp20}
              onClick={() => handleScroll("Prev")}
              disabled={isPrevDisabled}
            />
          </div>
          <DrugList drugDetails={drugChartData} />
        </div>
        <div
          className="drug-chart-content"
          data-testid="right-panel"
          ref={rightPane}
        >
          <CalendarHeader currentShiftArray={currentShiftArray} />
          <Calendar
            calendarData={drugChartData}
            currentShiftArray={currentShiftArray}
            selectedDate={selectedDate}
          />
        </div>
      </div>
      <div className="arrow-button-wrapper">
        <Button
          className="arrow-button"
          renderIcon={ChevronDown20}
          onClick={() => handleScroll("Next")}
          disabled={isNextDisabled}
        />
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
