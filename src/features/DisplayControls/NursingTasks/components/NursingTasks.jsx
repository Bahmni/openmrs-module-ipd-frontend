import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/NursingTasks.scss";
import { Add16 } from "@carbon/icons-react";
import { items } from "../utils/constants";
import {
  fetchMedicationNursingTasks,
  ExtractMedicationNursingTasksData,
  GetUTCEpochForDate,
} from "../utils/NursingTasksUtils";
import TaskTile from "./TaskTile";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { SliderContext } from "../../../../context/SliderContext";
import UpdateNursingTasks from "./UpdateNursingTasks";
import { Button, Dropdown } from "carbon-components-react";
import AddEmergencyTasks from "./AddEmergencyTasks";
import Notification from "../../../../components/Notification/Notification";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import { componentKeys } from "../../../../constants";
import AdministrationLegend from "../../../../components/AdministrationLegend/AdministrationLegend";

export default function NursingTasks(props) {
  const { patientId } = props;
  const [medicationNursingTasks, setMedicationNursingTasks] = useState([]);
  const [nursingTasks, setNursingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSliderOpen, updateSliderOpen, provider } =
    useContext(SliderContext);
  const [selectedMedicationTask, setSelectedMedicationTask] = useState([]);
  const [filterValue, setFilterValue] = useState(items[2]);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const refreshDisplayControl = useContext(RefreshDisplayControl);
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
  const NoNursingTasksMessageForCompleted = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE_COMPLETED"}
      defaultMessage={"No Completed Task is available for the patient"}
    />
  );
  const NoNursingTasksMessageForPending = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE_PENDING"}
      defaultMessage={"No Pending Task is available for the patient"}
    />
  );
  const NoNursingTasksMessageForStopped = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE_STOPPED"}
      defaultMessage={"No Stopped Task is available for the patient"}
    />
  );

  const fetchNursingTasks = async () => {
    setIsLoading(true);
    const forDate = GetUTCEpochForDate(new Date().toUTCString());
    const nursingTasks = await fetchMedicationNursingTasks(patientId, forDate);
    setNursingTasks(nursingTasks);
    if (nursingTasks) {
      const extractedData = ExtractMedicationNursingTasksData(
        nursingTasks,
        filterValue
      );
      setMedicationNursingTasks(extractedData);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchNursingTasks();
  }, []);

  useEffect(() => {
    setMedicationNursingTasks(
      ExtractMedicationNursingTasksData(nursingTasks, filterValue)
    );
  }, [filterValue]);
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
              const isStoppedSlot = medicationNursingTask[0]?.stopTime;
              if (
                !isSliderOpen.nursingTasks &&
                !medicationNursingTask[0].isDisabled &&
                !isStoppedSlot
              ) {
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

  const getNoTaskMessage = () => {
    switch (filterValue.id) {
      case "completed":
        return NoNursingTasksMessageForCompleted;
      case "pending":
        return NoNursingTasksMessageForPending;
      case "stopped":
        return NoNursingTasksMessageForStopped;
      default:
        return NoNursingTasksMessage;
    }
  };

  const showMedicationNursingTasks = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="nursing-tasks-content-container">
        <div className={"nursing-task-navigation"}>
          {showCurrentDate()}
          <div className="nursing-task-actions">
            <Dropdown
              id="filter-task"
              className="nursing-task-dropdown"
              size="lg"
              selectedItem={filterValue}
              items={items}
              itemToString={(item) => (item ? item.text : "")}
              onChange={(event) => {
                event.selectedItem
                  ? setFilterValue(event.selectedItem)
                  : setFilterValue(items[2]);
              }}
            />
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
        {
          console.log("Provider", provider)
        }
        {isSliderOpen.nursingTasks && (
          <UpdateNursingTasks
            medicationTasks={selectedMedicationTask}
            updateNursingTasksSlider={updateNursingTasksSlider}
            patientId={patientId}
            providerId={provider.uuid}
            setShowSuccessNotification={setShowSuccessNotification}
          />
        )}
        {isSliderOpen.emergencyTasks && (
          <AddEmergencyTasks
            patientId={patientId}
            providerId={provider.uuid}
            updateEmergencyTasksSlider={updateEmergencyTasksSlider}
          />
        )}
        {medicationNursingTasks && medicationNursingTasks.length === 0 ? (
          <div className="no-nursing-tasks">{getNoTaskMessage()}</div>
        ) : (
          <div>
            <div className="nursing-task-tiles-container">
              {showTaskTiles()}
            </div>
            <AdministrationLegend />
          </div>
        )}
        {showSuccessNotification && (
          <Notification
            hostData={{
              notificationKind: "success",
              messageId: "NURSING_TASKS_SAVE_MESSAGE",
            }}
            hostApi={{
              onClose: () => {
                setShowSuccessNotification(false);
                refreshDisplayControl([componentKeys.NURSING_TASKS]);
              },
            }}
          />
        )}
      </div>
    );
  };
  return <div>{showMedicationNursingTasks()}</div>;
}

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
