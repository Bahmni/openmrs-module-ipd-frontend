import React, { useContext } from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { areDatesSame } from "../../../../utils/DateTimeUtils.js";
import moment from "moment";
import { IPDContext } from "../../../../context/IPDContext";
import { timeFormatFor12hr, timeFormatfor24Hr } from "../../../../constants";
import { formatDate } from "../../../../utils/DateTimeUtils.js";

export default function CalendarRow(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const { rowData, currentShiftArray, selectedDate } = props;
  const { slots } = rowData;
  const transformedData = {};
  slots.forEach((slot) => {
    let time;
    const { medicationAdministration, administrationSummary } = slot;
    let adminInfo = {};
    if (
      ["Administered", "Administered-Late"].includes(
        administrationSummary.status
      )
    ) {
      time = formatDate(medicationAdministration.administeredDateTime, timeFormatfor24Hr);
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: `${administrationSummary.performerName} [${
          enable24HourTime
            ? time
            : formatDate(medicationAdministration.administeredDateTime, timeFormatFor12hr)
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
    const [hours, minutes] = time.split(":");
    transformedData[+hours] = transformedData[+hours] || [];
    transformedData[+hours].push({
      minutes,
      status: administrationSummary.status,
      ...adminInfo,
    });
  });
  return (
    <div style={{ display: "flex" }}>
      {currentShiftArray.map((hour) => {
        const date = new Date();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();
        const sameDate = areDatesSame(date, selectedDate);
        const isCurrentHour = hour === currentHour && sameDate;
        const highlightedCell = currentMinute < 30 ? "left" : "right";
        if (transformedData[hour]) {
          return (
            <TimeCell
              slotInfo={transformedData[hour]}
              key={hour}
              doHighlightCell={isCurrentHour}
              highlightedCell={highlightedCell}
            />
          );
        }
        return (
          <TimeCell
            key={hour}
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
