import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import Calendar from "./Calendar";
import CalendarHeader from "./CalendarHeader";
import "../styles/DrugChart.scss";
import DrugList from "./DrugList";
import DrugChartLegend from "../../../../components/AdministrationLegend/AdministrationLegend";
import { Button } from "carbon-components-react";
import { ChevronDown20, ChevronUp20 } from "@carbon/icons-react";
import { throttle } from "lodash";

export default function DrugChart(props) {
  const { drugChartData, currentShiftArray, selectedDate, shiftIndex } = props;
  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { registerPane, unregisterPane } = useScrollSync({
    vertical: true,
  });
  const drugChartRowHeight = 72;
  /* 65px header */
  const drugChartHeight = drugChartData?.length * drugChartRowHeight + 65;

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

  const handleScroll = useCallback(() => {
    const leftPaneElement = leftPane.current;
    const scrollTop = Math.ceil(leftPaneElement.scrollTop);
    const maxScrollTop =
      leftPaneElement.scrollHeight - leftPaneElement.clientHeight;

    setScrollPosition(scrollTop);
    setIsPrevDisabled(scrollTop <= 0);
    setIsNextDisabled(scrollTop >= Math.ceil(maxScrollTop));
  }, []);

  const throttledScrollHandler = useCallback(throttle(handleScroll, 100), []);

  useEffect(() => {
    leftPane.current.addEventListener("scroll", throttledScrollHandler);
    return () => {
      leftPane.current.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [throttledScrollHandler]);

  useEffect(() => {
    if (drugChartData) {
      const isListLong = drugChartData.length <= 10;
      setIsNextDisabled(isListLong);
    }
  }, [drugChartData]);

  const handleSmoothScroll = useCallback(
    (direction) => {
      const scrollAmount = drugChartRowHeight;
      const startScrollTop = scrollPosition;
      const endScrollTop =
        startScrollTop + (direction === "Up" ? -scrollAmount : scrollAmount);

      smoothScroll(startScrollTop, endScrollTop);
    },
    [scrollPosition]
  );

  const smoothScroll = useCallback((startScrollTop, endScrollTop) => {
    const startTime = Date.now();
    const distanceToScroll = Math.abs(endScrollTop - startScrollTop);
    const defaultDuration = 250;
    const duration = Math.min(defaultDuration, distanceToScroll / 2);

    const scroll = () => {
      const elapsedTime = Date.now() - startTime;
      const easing = Math.min(elapsedTime / duration, 1);
      const newScrollTop =
        startScrollTop + (endScrollTop - startScrollTop) * easing;
      leftPane.current.scrollTop = Math.round(newScrollTop);
      rightPane.current.scrollTop = Math.round(newScrollTop);

      if (elapsedTime < duration) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  }, []);

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
              data-testid="up-arrow"
              renderIcon={ChevronUp20}
              onClick={() => handleSmoothScroll("Up")}
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
            shiftIndex={shiftIndex}
          />
        </div>
      </div>
      <div className="arrow-button-wrapper">
        <Button
          className="arrow-button"
          data-testid="down-arrow"
          renderIcon={ChevronDown20}
          onClick={() => handleSmoothScroll("Down")}
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
  shiftIndex: PropTypes.number,
};
