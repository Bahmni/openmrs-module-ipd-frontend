import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/NursingTasks.scss";
import { Add16 } from "@carbon/icons-react";

import {
  fetchMedicationNursingTasks,
  ExtractMedicationNursingTasksData,
  GetUTCEpochForDate,
} from "../utils/NursingTasksUtils";
import TaskTile from "./TaskTile";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { SliderContext } from "../../../../context/SliderContext";
import UpdateNursingTasks from "./UpdateNursingTasks";
import { Button } from "carbon-components-react";
import AddEmergencyTasks from "./AddEmergencyTasks";

export default function NursingTasks(props) {
  const { patientId } = props;
  const [medicationNursingTasks, setMedicationNursingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSliderOpen, updateSliderOpen } = useContext(SliderContext);
  const [selectedMedicationTask, setSelectedMedicationTask] = useState([]);
  const updateNursingTasksSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        nursingTasks: value,
      };
    });
  };

  const updateEmergencyTasksSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        emergencyTasks: value,
      };
    });
  };
  const NoNursingTasksMessage = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE"}
      defaultMessage={"No Nursing Task is scheduled for the patient"}
    />
  );

  const fetchNursingTasks = async () => {
    setIsLoading(true);
    const forDate = GetUTCEpochForDate(new Date().toUTCString());
    const nursingTasks = await fetchMedicationNursingTasks(patientId, forDate);
    if (nursingTasks) {
      const extractedData = ExtractMedicationNursingTasksData(nursingTasks);
      setMedicationNursingTasks(extractedData);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNursingTasks();
  }, []);

  const showCurrentDate = () => {
    var currentDate = new Date();

    var formattedDate = formatDate(currentDate, "DD/MM/YYYY");
    return <div className="date-text">{formattedDate}</div>;
  };

  const showTaskTiles = () => {
    return medicationNursingTasks.map((medicationNursingTask, index) => {
      return (
        <div key={index}>
          <div
            onClick={() => {
              if (!isSliderOpen.nursingTasks) {
                setSelectedMedicationTask(medicationNursingTask);
                updateNursingTasksSlider(true);
              }
            }}
          >
            <TaskTile medicationNursingTask={medicationNursingTask} />
          </div>
        </div>
      );
    });
  };

  const showMedicationNursingTasks = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (medicationNursingTasks && medicationNursingTasks.length === 0) {
      return <div className="no-nursing-tasks">{NoNursingTasksMessage}</div>;
    }

    return (
      <div className="nursing-tasks-content-container">
        <div className={"nursing-task-navigation"}>
          {showCurrentDate()}
          <div>
            <Button
              kind={"tertiary"}
              isExpressive
              size="default"
              renderIcon={Add16}
              onClick={() => {
                if (!isSliderOpen.emergencyTasks) {
                  updateEmergencyTasksSlider(true);
                }
              }}
            >
              <FormattedMessage id={"ADD_TASK"} defaultMessage={"Add Task"} />
            </Button>
          </div>
        </div>

        {isSliderOpen.nursingTasks && (
          <UpdateNursingTasks
            medicationTasks={selectedMedicationTask}
            updateNursingTasksSlider={updateNursingTasksSlider}
          />
        )}
        {isSliderOpen.emergencyTasks && (
          <AddEmergencyTasks
            patientId={"uuid"}
            updateEmergencyTasksSlider={updateEmergencyTasksSlider}
          />
        )}
        <div className="nursing-task-tiles-container">{showTaskTiles()}</div>
      </div>
    );
  };
  return <div>{showMedicationNursingTasks()}</div>;
}

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
