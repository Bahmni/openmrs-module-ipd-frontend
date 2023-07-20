import React from "react";
import "./CalendarHeader.scss";

export default function CalendarHeader() {
  const hours = [...Array(24).keys()];

  return (
    <div className={"calendar-header"}>
      <table>
        <tbody>
          <tr>
            {hours.map((hour) => {
              return (
                <td key={hour}>
                  {hour.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
                  :00
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
