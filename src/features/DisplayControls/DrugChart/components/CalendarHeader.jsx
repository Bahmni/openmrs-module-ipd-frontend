import React from "react";
import "../styles/CalendarHeader.scss";

export default function CalendarHeader() {
  const hours = [...Array(24).keys()];

  return (
    <div className="calendar-header">
      <div style={{ display: "flex" }}>
        {hours.map((hour) => {
          return (
            <div data-testid="hour" key={hour} className={"hour-header"}>
              {hour.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
              :00
            </div>
          );
        })}
      </div>
    </div>
  );
}
