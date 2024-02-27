import React ,{ useContext} from "react";
import PropTypes from "prop-types";
import TimeCell from "./TimeCell.jsx";
import { areDatesSame } from "../../../../utils/DateTimeUtils.js";
import moment from "moment";
import { IPDContext } from "../../../../context/IPDContext";
import {timeFormatFor12hr,timeFormatfor24Hr} from "../../../../constants";

export default function CalendarRow(props) {
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const enable24Hour = enable24HourTime;
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
      time = enable24Hour ? moment(medicationAdministration.administeredDateTime).format(timeFormatfor24Hr) : moment(medicationAdministration.administeredDateTime).format(timeFormatFor12hr);
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: `${administrationSummary.performerName} [${time}]`,
      };
    } else if (administrationSummary.status === "Not-Administered") {
      time = enable24Hour ? moment(slot.startTime * 1000).format(timeFormatfor24Hr) :  moment(slot.startTime * 1000).format(timeFormatFor12hr);
      adminInfo = {
        notes: administrationSummary.notes,
        administrationInfo: administrationSummary.performerName,
      };
    } else {
      time = enable24Hour ? moment(slot.startTime * 1000).format(timeFormatfor24Hr) : moment(slot.startTime * 1000).format(timeFormatFor12hr);
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
