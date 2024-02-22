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
import { formatDate } from "../../../../utils/DateTimeUtils";
import { timeFormatFor12hr, timeFormatfor24Hr } from "../../../../constants";

const AdministeredMedicationList = ({ list, enable24Hour }) => {
  const getAdministeredTime = (date) => {
    return `${
      enable24Hour
        ? formatDate(date, timeFormatfor24Hr)
        : formatDate(date, timeFormatFor12hr)
    }`;
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
                  {list[key].skipped
                    ? list[key].startTime
                    : getAdministeredTime(new Date(list[key].actualTime))}
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
