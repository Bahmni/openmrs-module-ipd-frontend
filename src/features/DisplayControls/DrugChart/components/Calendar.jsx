import React from "react";
import PropTypes from "prop-types";
import CalendarRow from "./CalendarRow.jsx";
import "../styles/Calendar.scss";
export default function Calendar(props) {
  const { calendarData } = props;
  return (
    <table className="drug-chart-calendar">
      <tbody>
        {calendarData.map((rowData, index) => {
          return (
            <tr key={index}>
              <CalendarRow rowData={rowData} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Calendar.propTypes = {
  calendarData: PropTypes.array.isRequired,
};
