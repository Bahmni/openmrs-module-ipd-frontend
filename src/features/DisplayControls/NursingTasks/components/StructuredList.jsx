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
  console.log("lIST", list);

  const listObj = {
    "8040ab44-2100-4e4e-91ad-50a5715050da": {
      displayName: "Liquid Paraffin",
      doseType: "Drop",
      dosage: 2,
      route: "Topical",
      startTime: "16:00",
      isSelected: true,
      actualTime: "2023-12-15T12:30:21.731Z",
      status: "completed",
    },
    "c5b7f756-52a9-4eda-80c5-672272487a44": {
      displayName: "Liquid Paraffin",
      doseType: "Drop",
      dosage: 2,
      route: "Topical",
      startTime: "16:00",
      isSelected: true,
      actualTime: "2023-12-15T12:30:20.785Z",
      status: "completed",
    },
  };

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
                <div>{getMedicationDetails(list[key])}</div>
              </StructuredListCell>
              <StructuredListCell className="time-cell">
                <ClockIcon className="clock-icon" />
                {getAdministeredTime(new Date(list[key].actualTime))}
              </StructuredListCell>
              <StructuredListCell>
                {getStatusIcon(list[key].status)}
                {getMedicationStatus(list[key].status)}
              </StructuredListCell>
            </StructuredListRow>
          );
        })}
      </StructuredListBody>
    </StructuredListWrapper>
  );
};

export default SimpleStructuredList;
