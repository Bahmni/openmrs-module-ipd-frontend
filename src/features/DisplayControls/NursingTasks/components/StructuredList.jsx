import React from "react";
import {
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "carbon-components-react";
import ClockIcon from "../../../../icons/clock.svg";
import DoneIcon from "../../../../icons/done.svg";
import "../styles/StructuredList.scss";

const SimpleStructuredList = ({ list }) => {
  const getAdministeredTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getMedicationDetails = (medication) => {
    return `${medication.dosage} - ${medication.doseType} - ${medication.route}`;
  };

  const getMedicationStatus = (status) => {
    return status === "completed" ? "Done" : "";
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? <DoneIcon className="done-icon" /> : "";
  };

  return (
    <StructuredListWrapper>
      <StructuredListBody>
        {Object.keys(list).map((key, index) => {
          return (
            <StructuredListRow key={index}>
              <StructuredListCell className="drug-name-cell">
                <div>{list[key].displayName}</div>
                <span>{getMedicationDetails(list[key])}</span>
              </StructuredListCell>
              <StructuredListCell className="time-cell">
                <ClockIcon className="clock-icon" />
                <span className="time">
                  {getAdministeredTime(new Date(list[key].actualTime))}
                </span>
              </StructuredListCell>
              <StructuredListCell>
                {getStatusIcon(list[key].status)}
                <span className="status">
                  {getMedicationStatus(list[key].status)}
                </span>
              </StructuredListCell>
            </StructuredListRow>
          );
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  );
};

export default SimpleStructuredList;
