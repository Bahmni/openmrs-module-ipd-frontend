import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";

import {
  fetchMedicationNursingTasks,
  ExtractMedicationNursingTasksData,
  GetUTCEpochForDate,
} from "../utils/NursingTasksUtils";
import TaskTile from "./TaskTile";

export default function NursingTasks(props) {
  const { patientId } = props;
  console.log("patientId", patientId);
  const [medicationNursingTasks, setMedicationNursingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const NoNursingTasksMessage = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE"}
      defaultMessage={"No Nursing tasks scheduled for this patient yet"}
    />
  );

  useEffect(() => {
    const fetchNursingTasks = async () => {
      setIsLoading(true);
      const forDate = GetUTCEpochForDate(new Date().toUTCString());
      const nursingTasks = await fetchMedicationNursingTasks(
        patientId,
        forDate
      );
      if (nursingTasks) {
        const extractedData = ExtractMedicationNursingTasksData(nursingTasks);
        setMedicationNursingTasks(extractedData);
        setIsLoading(false);
      }
    };

    fetchNursingTasks();
  }, []);

  const showCurrentDate = () => {
    var currentDate = new Date();

    var formattedDate = currentDate.toLocaleDateString();
    return <div className="date-text">{formattedDate}</div>;
  };

  const showTaskTiles = () => {
    return medicationNursingTasks.map((medicationNursingTask) => {
      return (
        <div
          style={{ display: "flex", height: "110px" }}
          key={medicationNursingTask}
        >
          <TaskTile medicationNursingTask={medicationNursingTask} />
        </div>
      );
    });
  };

  const showMedicationNursingTasks = () => {
    if (isLoading) {
      return <>Loading...</>;
    }
    if (medicationNursingTasks && medicationNursingTasks.length === 0) {
      return <>{NoNursingTasksMessage}</>;
    }

    return (
      <div style={{ flexDirection: "column" }}>
        {showCurrentDate()}
        {showTaskTiles()}
      </div>
    );
  };
  return <div>{showMedicationNursingTasks()}</div>;
}

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
