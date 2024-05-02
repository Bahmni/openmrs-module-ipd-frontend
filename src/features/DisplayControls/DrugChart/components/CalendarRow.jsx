import React, { useContext } from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { areDatesSame, formatDate } from "../../../../utils/DateTimeUtils.js";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor12Hr, timeFormatFor24Hr } from "../../../../constants";
import moment from "moment";
import { currentShiftHoursArray } from "../utils/DrugChartUtils";

export default function CalendarRow(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {}, shiftDetails: shiftConfig = {} } = config;
  const { rowData, currentShiftArray, selectedDate } = props;
  const { slots } = rowData;
  const transformedData = {};
  const currentShiftMinute = currentShiftArray[0].split(":")[1];
  const { shiftIndex } = currentShiftHoursArray(new Date(), shiftConfig);
  const shiftArray = Object.values(shiftConfig);
  const shiftEndTime = shiftArray[shiftIndex].shiftEndTime;
  const endTime = moment(shiftEndTime, "HH:mm");
  const isWholeHourEndTime = endTime.minutes() === 0;
  const isWholeHourStartTime = Number(currentShiftMinute) === 0;
  slots.forEach((slot) => {
    let time;
    const { medicationAdministration, administrationSummary } = slot;
    let adminInfo = {};
    if (
      ["Administered", "Administered-Late"].includes(
        administrationSummary.status
      )
    ) {
      time = formatDate(
        medicationAdministration.administeredDateTime,
        timeFormatFor24Hr
      );
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: `${administrationSummary.performerName} [${
          enable24HourTime
            ? time
            : formatDate(
                medicationAdministration.administeredDateTime,
                timeFormatFor12Hr
              )
        }]`,
      };
    } else if (administrationSummary.status === "Not-Administered") {
      time = formatDate(slot.startTime * 1000, timeFormatFor24Hr);
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: administrationSummary.performerName,
      };
    } else {
      time = formatDate(slot.startTime * 1000, timeFormatFor24Hr);
    }
    let [hours, minutes] = time.split(":");
    if (currentShiftMinute > minutes) {
      hours = +hours - 1;
    }
    transformedData[+hours] = transformedData[+hours] || [];
    transformedData[+hours].push({
      time,
      status: administrationSummary.status,
      ...adminInfo,
    });
  });
  return (
    <div style={{ display: "flex" }}>
      {currentShiftArray.map((time, index) => {
        const shiftArrayTime = moment(time, timeFormatFor24Hr);
        const nextShiftArrayTime =
          index + 1 != currentShiftArray.length
            ? moment(currentShiftArray[index + 1], timeFormatFor24Hr)
            : moment(time, timeFormatFor24Hr).add(1, "hour");
        const date = moment();
        const sameDate = areDatesSame(date, selectedDate);
        const isCurrentHour =
          date.isBetween(shiftArrayTime, nextShiftArrayTime) && sameDate;
        const highlightedCell =
          date.diff(shiftArrayTime) < nextShiftArrayTime.diff(date)
            ? "left"
            : "right";
        if (transformedData[shiftArrayTime.hour()]) {
          return (
            <TimeCell
              slotInfo={transformedData[shiftArrayTime.hour()]}
              startTime={shiftArrayTime}
              endTime={nextShiftArrayTime}
              key={time}
              doHighlightCell={isCurrentHour}
              highlightedCell={highlightedCell}
              isBlank={
                index === currentShiftArray.length - 1 && !isWholeHourEndTime
              }
              isWholeHourStartTime={isWholeHourStartTime}
            />
          );
        }
        return (
          <TimeCell
            key={time}
            doHighlightCell={isCurrentHour}
            highlightedCell={highlightedCell}
            isBlank={
              index === currentShiftArray.length - 1 && !isWholeHourEndTime
            }
            isWholeHourStartTime={isWholeHourStartTime}
          />
        );
      })}
    </div>
  );
}

CalendarRow.propTypes = {
  rowData: PropTypes.object.isRequired,
  currentShiftArray: PropTypes.array,
  selectedDate: PropTypes.instanceOf(Date),
};
