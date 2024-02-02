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
import { IPDContext } from "../../../../context/IPDContext";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import {
  currentShiftHoursArray,
  getDateTime,
  getNextShiftDetails,
  getPreviousShiftDetails,
} from "../../DrugChart/utils/DrugChartUtils";
import { displayShiftTimingsFormat } from "../../../../constants";

export default function NursingTasks(props) {
  const { patientId } = props;
  const { config } = useContext(IPDContext);
  const { shiftDetails: shiftConfig = {}, drugChart = {} } = config;
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
  const shiftDetails = currentShiftHoursArray(shiftConfig);
  const allowedForthShfts =
    getDateTime(new Date(), shiftDetails.currentShiftHoursArray[0]) / 1000 +
    convertDaystoSeconds(2);
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [nextShiftMaxHour] = useState(allowedForthShfts);
  const [isShiftsButtonsDisabled, setIsShiftsButtonsDisabled] = useState({
    previous: false,
    next: false,
  });
  const shiftRangeArray = shiftDetails.rangeArray;
  const [shiftIndex, updateShiftIndex] = useState(shiftDetails.shiftIndex);

  useEffect(() => {
    const currentShift = shiftDetails.currentShiftHoursArray;
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
    const { startDateTime, endDateTime, previousShiftIndex } =
      getPreviousShiftDetails(
        shiftRangeArray,
        shiftIndex,
        startEndDates.startDate,
        startEndDates.endDate
      );
    updateShiftIndex(previousShiftIndex);
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
  };

  const handleNext = () => {
    const { startDateTime, endDateTime, nextShiftIndex } = getNextShiftDetails(
      shiftRangeArray,
      shiftIndex,
      startEndDates.startDate,
      startEndDates.endDate
    );
    updateShiftIndex(nextShiftIndex);
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const shiftDetailsObj = currentShiftHoursArray(shiftConfig);
    const currentShift = shiftDetailsObj.currentShiftHoursArray;
    const updatedShiftIndex = shiftDetailsObj.shiftIndex;
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
    updateShiftIndex(updatedShiftIndex);
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

  const shiftTiming = () => {
    let shiftStartDateTime = formatDate(
      startEndDates.startDate,
      displayShiftTimingsFormat
    );
    let shiftEndDateTime = formatDate(
      startEndDates.endDate - 60,
      displayShiftTimingsFormat
    );
    const [shiftStartDate, shiftStartTime] = shiftStartDateTime.split(" | ");
    const [shiftEndDate, shiftEndTime] = shiftEndDateTime.split(" | ");

    const formattedShiftStartTime = drugChart.enable24HourTime
      ? shiftStartTime
      : formatDate(startEndDates.startDate, "hh:mm a");

    const formattedShiftEndTime = drugChart.enable24HourTime
      ? shiftEndTime
      : formatDate(startEndDates.endDate - 60, "hh:mm a");

    if (shiftStartDate === shiftEndDate) {
      return (
        <div className="shift-timing">
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            <Time16 /> {formattedShiftEndTime}
          </div>
        </div>
      );
    } else {
      return (
        <div className="shift-timing">
          <div className="shift-time">
            {shiftStartDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftStartTime} <span className="to-text">to</span>{" "}
            {shiftEndDate} <span className="mr-5">|</span> <Time16 />{" "}
            {formattedShiftEndTime}
          </div>
        </div>
      );
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
          {shiftTiming()}
        </div>
        <div className="nursing-task-actions">
          <Dropdown
            id="filter-task"
            className="nursing-task-dropdown"
            size="sm"
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
