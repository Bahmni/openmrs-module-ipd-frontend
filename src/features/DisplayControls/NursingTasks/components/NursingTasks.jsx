import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/NursingTasks.scss";
import { Add16 } from "@carbon/icons-react";
import { items } from "../utils/constants";
import {
  fetchMedicationNursingTasks,
  ExtractMedicationNursingTasksData,
} from "../utils/NursingTasksUtils";
import TaskTile from "./TaskTile";
import {
  convertDaystoSeconds,
  formatDate,
} from "../../../../utils/DateTimeUtils";
import { SliderContext } from "../../../../context/SliderContext";
import UpdateNursingTasks from "./UpdateNursingTasks";
import { Button, Dropdown, Loading } from "carbon-components-react";
import AddEmergencyTasks from "./AddEmergencyTasks";
import Notification from "../../../../components/Notification/Notification";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import { componentKeys } from "../../../../constants";
import AdministrationLegend from "../../../../components/AdministrationLegend/AdministrationLegend";
import data from "../../../../utils/config.json";
import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import {
  currentShiftHoursArray,
  getDateFormatString,
  getDateTime,
  getNextShiftDetails,
  getPreviousShiftDetails,
} from "../../DrugChart/utils/DrugChartUtils";

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
  const [successMessage, setSuccessMessage] = useState("");
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const [date, updateDate] = useState(new Date());
  const [lastAction, updateLastActon] = useState("");
  const allowedForthShfts =
    getDateTime(new Date(), currentShiftHoursArray()[0]) / 1000 +
    convertDaystoSeconds(2);
  const [currentShiftArray, updateShiftArray] = useState(
    currentShiftHoursArray()
  );
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [nextShiftMaxHour] = useState(allowedForthShfts);
  const [isShiftsButtonsDisabled, setIsShiftsButtonsDisabled] = useState({
    previous: false,
    next: false,
  });
  const { config: { drugChart = {} } = {} } = data;
  const dateFormatString = getDateFormatString();

  useEffect(() => {
    const currentShift = currentShiftHoursArray();
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];
    let startDateTime = getDateTime(new Date(), currentShift[0]);
    let endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    /** if the shift is going on two different dates */
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTime = getDateTime(d, currentShift[currentShift.length - 1] + 1);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTime = getDateTime(d, currentShift[0]);
      }
    }
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    updateDate(new Date(endDateTime));
    fetchNursingTasks(startDateTime, endDateTime);
  }, []);
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

  const handlePrevious = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && (lastAction === "N" || lastAction === "")) {
      date.setDate(date.getDate() - 1);
    }
    const { startDateTime, endDateTime, nextDate } = getPreviousShiftDetails(
      currentShiftArray,
      drugChart.shiftHours,
      date
    );
    const previousShiftArray = currentShiftArray.map((hour) => {
      let updatedHour = hour - drugChart.shiftHours;
      updatedHour = updatedHour < 0 ? 24 + updatedHour : updatedHour;
      return updatedHour;
    });
    updateShiftArray(previousShiftArray);
    updateDate(nextDate);
    updateLastActon("P");
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
  };

  const handleNext = () => {
    const firstHour = currentShiftArray[0];
    const lastHour = currentShiftArray[currentShiftArray.length - 1];
    if (lastHour < firstHour && lastAction === "P") {
      date.setDate(date.getDate() + 1);
    }
    const { startDateTime, endDateTime, nextDate } = getNextShiftDetails(
      currentShiftArray,
      drugChart.shiftHours,
      date
    );
    const nextShiftArray = currentShiftArray.map(
      (hour) => (hour + drugChart.shiftHours) % 24
    );
    updateShiftArray(nextShiftArray);
    updateDate(nextDate);
    updateLastActon("N");
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const currentShift = currentShiftHoursArray();
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];
    let startDateTime = getDateTime(new Date(), currentShift[0]);
    let endDateTime = getDateTime(
      new Date(),
      currentShift[currentShift.length - 1] + 1
    );
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTime = getDateTime(d, currentShift[currentShift.length - 1] + 1);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTime = getDateTime(d, currentShift[0]);
      }
    }
    updateShiftArray(currentShift);
    updateDate(new Date(endDateTime));
    updateLastActon("");
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
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

  const fetchNursingTasks = async (startDate, endDate) => {
    setIsLoading(true);
    const startDateTimeInSeconds = startDate / 1000;
    const endDateTimeInSeconds = endDate / 1000 - 60;
    const nursingTasks = await fetchMedicationNursingTasks(
      patientId,
      startDateTimeInSeconds,
      endDateTimeInSeconds
    );
    setNursingTasks(nursingTasks);
    if (nursingTasks) {
      const extractedData = ExtractMedicationNursingTasksData(
        nursingTasks,
        filterValue
      );
      setMedicationNursingTasks(extractedData);
      setIsLoading(false);
      setIsShiftsButtonsDisabled({
        previous: nursingTasks[0].startDate > startDateTimeInSeconds,
        next:
          startDateTimeInSeconds >= nextShiftMaxHour ||
          endDateTimeInSeconds >= nextShiftMaxHour,
      });
    }
  };
  useEffect(() => {
    setMedicationNursingTasks(
      ExtractMedicationNursingTasksData(nursingTasks, filterValue)
    );
  }, [filterValue]);

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

  return (
    <div className="nursing-tasks-content-container display-container">
      <div className={"nursing-task-navigation"}>
        <div className="nursingTask-shift-header">
          <Button
            kind="tertiary"
            isExpressive
            size="small"
            onClick={handleCurrent}
            className="margin-right-10"
            data-testid="current-shift"
          >
            <FormattedMessage
              id={"CURRENT_SHIFT"}
              defaultMessage={"Current Shift"}
            />
          </Button>
          <Button
            disabled={isShiftsButtonsDisabled.previous}
            renderIcon={ChevronLeft16}
            kind="tertiary"
            isExpressive
            hasIconOnly
            size="sm"
            onClick={handlePrevious}
            className="margin-right-6"
            data-testid="previous-shift"
          />
          <Button
            disabled={isShiftsButtonsDisabled.next}
            renderIcon={ChevronRight16}
            kind="tertiary"
            isExpressive
            hasIconOnly
            size="sm"
            onClick={handleNext}
            className="margin-right-10"
            data-testid="next-shift"
          />
          {`${formatDate(
            startEndDates.startDate,
            dateFormatString
          )} - ${formatDate(startEndDates.endDate, dateFormatString)}`}
        </div>
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

      {isSliderOpen.nursingTasks && (
        <UpdateNursingTasks
          medicationTasks={selectedMedicationTask}
          updateNursingTasksSlider={updateNursingTasksSlider}
          patientId={patientId}
          providerId={provider.uuid}
          setShowSuccessNotification={setShowSuccessNotification}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {isSliderOpen.emergencyTasks && (
        <AddEmergencyTasks
          patientId={patientId}
          providerId={provider.uuid}
          updateEmergencyTasksSlider={updateEmergencyTasksSlider}
          setShowSuccessNotification={setShowSuccessNotification}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {isLoading ? (
        <div className="loading-parent" data-testid="loading-icon">
          <Loading withOverlay={false} />
        </div>
      ) : medicationNursingTasks && medicationNursingTasks.length === 0 ? (
        <div className="no-nursing-tasks">{getNoTaskMessage()}</div>
      ) : (
        <div>
          <div className="nursing-task-tiles-container">{showTaskTiles()}</div>
          <AdministrationLegend />
        </div>
      )}
      {showSuccessNotification && (
        <Notification
          hostData={{
            notificationKind: "success",
            messageId: successMessage,
          }}
          hostApi={{
            onClose: () => {
              setShowSuccessNotification(false);
              refreshDisplayControl([
                componentKeys.TREATMENTS,
                componentKeys.NURSING_TASKS,
                componentKeys.DRUG_CHART,
              ]);
            },
          }}
        />
      )}
    </div>
  );
}

NursingTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
};
