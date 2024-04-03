import React, { useContext } from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { areDatesSame, formatDate } from "../../../../utils/DateTimeUtils.js";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor12hr, timeFormatfor24Hr } from "../../../../constants";
import moment from "moment";

export default function CalendarRow(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const { rowData, currentShiftArray, selectedDate } = props;
  const { slots } = rowData;
  const transformedData = {};
  const currentShiftMinute = currentShiftArray[0].split(":")[1];
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
        timeFormatfor24Hr
      );
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: `${administrationSummary.performerName} [${
          enable24HourTime
            ? time
            : formatDate(
                medicationAdministration.administeredDateTime,
                timeFormatFor12hr
              )
        }]`,
      };
    } else if (administrationSummary.status === "Not-Administered") {
      time = formatDate(slot.startTime * 1000, timeFormatfor24Hr);
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: administrationSummary.performerName,
      };
    } else {
      time = formatDate(slot.startTime * 1000, timeFormatfor24Hr);
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
        const shiftArrayTime = moment(time, timeFormatfor24Hr);
        const nextShiftArrayTime =
          index + 1 != currentShiftArray.length
            ? moment(currentShiftArray[index + 1], timeFormatfor24Hr)
            : moment(time, timeFormatfor24Hr).add(1, "hour");
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
            />
          );
        }
        return (
          <TimeCell
            key={time}
            doHighlightCell={isCurrentHour}
            highlightedCell={highlightedCell}
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
