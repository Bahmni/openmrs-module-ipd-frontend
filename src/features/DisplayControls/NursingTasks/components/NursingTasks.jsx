import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
        <>
          <TaskTile medicationNursingTask={medicationNursingTask} />
        </>
      );
    });
  };

  const showMedicationNursingTasks = () => {
    if (isLoading) {
      return <>Loading...</>;
    }
    if (medicationNursingTasks && medicationNursingTasks.length === 0) {
      return <>No Nursing Tasks</>;
    }
    // return medicationNursingTasks.map((medicationNursingTask) => {
    //   return (
    //     <>
    //       <TaskTile medicationNursingTask={medicationNursingTask} />
    //     </>
    //   );
    // })
    return (
      <div style={{ flexDirection: "column" }}>
        {showCurrentDate()}
        {showTaskTiles()}
      </div>
    );
  };
  return <div style={{ display: "flex" }}>{showMedicationNursingTasks()}</div>;
}

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
