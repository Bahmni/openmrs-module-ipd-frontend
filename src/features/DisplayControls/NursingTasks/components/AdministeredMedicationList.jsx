import React from "react";
import {
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from "carbon-components-react";
import PropTypes from "prop-types";
import { getMedicationDetails } from "../utils/TaskTileUtils";
import ClockIcon from "../../../../icons/clock.svg";
import Administered from "../../../../icons/administered.svg";
import NotAdministered from "../../../../icons/not-administered.svg";
import "../styles/AdministeredMedicationList.scss";

const AdministeredMedicationList = ({ list }) => {
  const getAdministeredTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getMedicationStatus = (status) => {
    return status === "completed" ? "Done" : "Skipped";
  };

  const getStatusIcon = (status) => {
    return status === "completed" ? <Administered /> : <NotAdministered />;
  };

  return (
    <StructuredListWrapper className="administered-list-body">
      <StructuredListBody>
        {Object.keys(list).map((key, index) => {
          return (
            <StructuredListRow key={index}>
              <StructuredListCell className="drug-name-cell">
                <div>{list[key].displayName}</div>
                <span>{getMedicationDetails(list[key])}</span>
              </StructuredListCell>
              <StructuredListCell className="administered-time-cell">
                <ClockIcon className="clock-icon" />
                <span className="time">
                  {getAdministeredTime(new Date(list[key].actualTime))}
                </span>
              </StructuredListCell>
              <StructuredListCell>
                {getStatusIcon(list[key].status)}
                <span className="status" data-testid="status-name-cell">
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

AdministeredMedicationList.propTypes = {
  list: PropTypes.object.isRequired,
};
export default AdministeredMedicationList;
