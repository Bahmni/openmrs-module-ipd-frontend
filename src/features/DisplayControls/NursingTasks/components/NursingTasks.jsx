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
      console.log("inside fetch patientId", patientId);
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

  const showMedicationNursingTasks = () => {
    if (isLoading) {
      return <>Loading...</>;
    }
    if (medicationNursingTasks && medicationNursingTasks.length === 0) {
      return <>No Nursing Tasks</>;
    }
    return medicationNursingTasks.map((medicationNursingTask) => {
      return (
        <>
          <TaskTile medicationNursingTask={medicationNursingTask} />
        </>
      );
    });
  };
  return (
    <div style={{ flexDirection: "column" }}>
      {showMedicationNursingTasks()}
    </div>
  );
}
// for each element in medicationNursingTasks array render component TaskTile with props passed as array element
// <TaskTile medicationNursingTasks={medicationNursingTasks} />
// <>
{
  /* {console.log(medicationNursingTasks)} */
}

{
  /* <div>Nursing tasks tile</div> */
}
//   </>

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
