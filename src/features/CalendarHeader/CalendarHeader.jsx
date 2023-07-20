import React from "react";
import "./CalendarHeader.scss";

export function CalendarHeader() {
  const hours = [...Array(24).keys()];

  return (
    <div className={"calendar-header"}>
      <table>
        <tbody>
          <tr>
            {hours.map((hour) => {
              return (
                <td key={hour}>
                  <div>
                    {hour.toLocaleString("en-US", { minimumIntegerDigits: 2 })}
                    :00
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
