import React from "react";
import PropTypes from "prop-types";
import TimeCell from "../DrugChartTimeCell/TimeCell.jsx";
export default function CalendarRow(props) {
  const { rowData } = props;
  const hours = [...Array(24).keys()];
  return (
    <div style={{ display: "flex" }}>
      {hours.map((hour) => {
        if (rowData[hour]) {
          const { minutes, status, administrationInfo } = rowData[hour];
          return (
            <TimeCell
              minutes={minutes}
              status={status}
              key={hour}
              administrationInfo={administrationInfo}
            />
          );
        }
        return <TimeCell key={hour} />;
      })}
    </div>
  );
}

CalendarRow.propTypes = {
  rowData: PropTypes.object.isRequired,
};
