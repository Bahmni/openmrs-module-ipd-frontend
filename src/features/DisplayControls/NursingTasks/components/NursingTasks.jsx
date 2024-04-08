import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/NursingTasks.scss";
import { Add16 } from "@carbon/icons-react";
import { items } from "../utils/constants";
import {
  fetchMedicationNursingTasks,
  ExtractMedicationNursingTasksData,
  disableTaskTilePastNextSlotTime,
  ExtractNonMedicationTasks,
  sortNursingTasks,
  fetchNonMedicationTasks,
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
import {
  asNeededPlaceholderConceptName,
  componentKeys,
  timeFormatFor12Hr,
} from "../../../../constants";
import AdministrationLegend from "../../../../components/AdministrationLegend/AdministrationLegend";
import { IPDContext } from "../../../../context/IPDContext";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import {
  currentShiftHoursArray,
  getDateTime,
  getNextShiftDetails,
  getPreviousShiftDetails,
  isCurrentShift,
  NotCurrentShiftMessage,
  setCurrentShiftTimes,
} from "../../DrugChart/utils/DrugChartUtils";
import { displayShiftTimingsFormat } from "../../../../constants";
import WarningIcon from "../../../../icons/warning.svg";
export default function NursingTasks(props) {
  const { patientId } = props;
  const { config, isReadMode, visitSummary, visit } = useContext(IPDContext);
  const [medicationNursingTasks, setMedicationNursingTasks] = useState([]);
  const [nursingTasks, setNursingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSliderOpen, updateSliderOpen, provider } =
    useContext(SliderContext);
  const [selectedMedicationTask, setSelectedMedicationTask] = useState([]);
  const [filterValue, setFilterValue] = useState(
    isReadMode ? items[1] : items[2]
  );
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [notCurrentShift, setNotCurrentShift] = useState(false);
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const { shiftDetails: shiftConfig = {}, enable24HourTime = {} } = config;
  const shiftDetails = currentShiftHoursArray(
    isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    shiftConfig
  );
  const allowedForthShfts =
    getDateTime(new Date(), shiftDetails.currentShiftHoursArray[0]) / 1000 +
    convertDaystoSeconds(2);
  const [startEndDates, updatedStartEndDates] = useState({
    startDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
    endDate: isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
  });
  const [nextShiftMaxHour] = useState(
    isReadMode ? visitSummary.stopDateTime / 1000 : allowedForthShfts
  );
  const [isShiftsButtonsDisabled, setIsShiftsButtonsDisabled] = useState({
    previous: false,
    next: isReadMode ? true : false,
  });
  const shiftRangeArray = shiftDetails.rangeArray;
  const [shiftIndex, updateShiftIndex] = useState(shiftDetails.shiftIndex);
  const [nonMedicationTasks, setNonMedicationTasks] = useState([]);
  let startDateTimeChange, endDateTimeChange;

  useEffect(() => {
    const timeframe = setCurrentShiftTimes(
      shiftDetails,
      isReadMode,
      visitSummary
    );
    startDateTimeChange = timeframe[0];
    endDateTimeChange = timeframe[1];
    updatedStartEndDates({
      startDate: startDateTimeChange,
      endDate: endDateTimeChange,
    });
    fetchNursingTasks(startDateTimeChange, endDateTimeChange);
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
    startDateTimeChange = startDateTime;
    endDateTimeChange = endDateTime;
    isCurrentShift(
      shiftDetails,
      shiftConfig,
      startDateTimeChange,
      endDateTimeChange
    )
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
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
    startDateTimeChange = startDateTime;
    endDateTimeChange = endDateTime;
    isCurrentShift(
      shiftDetails,
      shiftConfig,
      startDateTimeChange,
      endDateTimeChange
    )
      ? setNotCurrentShift(false)
      : setNotCurrentShift(true);
    updateShiftIndex(nextShiftIndex);
    setIsLoading(true);
    updatedStartEndDates({ startDate: startDateTime, endDate: endDateTime });
    fetchNursingTasks(startDateTime, endDateTime);
  };

  const handleCurrent = () => {
    const shiftDetailsObj = currentShiftHoursArray(
      isReadMode ? new Date(visitSummary.stopDateTime) : new Date(),
      shiftConfig
    );
    const updatedShiftIndex = shiftDetailsObj.shiftIndex;
    const [start, end] =
      shiftDetails.rangeArray[shiftDetails.shiftIndex].split("-");
    const [startHour, startMinute] = start.split(":");
    const [endHour, endMinute] = end.split(":");
    const firstHour = `${startHour}:${startMinute}`;
    const lastHour = `${endHour}:${endMinute}`;
    startDateTimeChange = getDateTime(new Date(), firstHour);
    endDateTimeChange = getDateTime(new Date(), lastHour);
    if (lastHour < firstHour) {
      const d = new Date();
      const currentHour = d.getHours();
      if (currentHour > 12) {
        d.setDate(d.getDate() + 1);
        endDateTimeChange = getDateTime(d, lastHour);
      } else {
        d.setDate(d.getDate() - 1);
        startDateTimeChange = getDateTime(d, firstHour);
      }
    }
    setNotCurrentShift(false);
    updateShiftIndex(updatedShiftIndex);
    setIsLoading(true);
    updatedStartEndDates({
      startDate: startDateTimeChange,
      endDate: endDateTimeChange,
    });
    fetchNursingTasks(startDateTimeChange, endDateTimeChange);
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

  const NoPRNTasksMessageForStopped = (
    <FormattedMessage
      id={"NO_PRN_TASKS_MESSAGE_STOPPED"}
      defaultMessage={"No PRN Task is available for the patient"}
    />
  );

  const NoNursingTasksMessageForMissed = (
    <FormattedMessage
      id={"NO_NURSING_TASKS_MESSAGE_MISSED"}
      defaultMessage={"No Missed Task is available for the patient"}
    />
  );

  const fetchNursingTasks = async (startDate, endDate) => {
    setIsLoading(true);
    const startDateTimeInSeconds = startDate / 1000;
    const endDateTimeInSeconds = endDate / 1000 - 60;
    const arrayOfNonMedicationTasks = await fetchNonMedicationTasks(
      visit,
      startDateTimeInSeconds * 1000,
      endDateTimeInSeconds * 1000
    );
    setNonMedicationTasks(arrayOfNonMedicationTasks);

    const nursingTasks = await fetchMedicationNursingTasks(
      patientId,
      startDateTimeInSeconds,
      endDateTimeInSeconds,
      visit
    );
    setNursingTasks(nursingTasks);

    if (nursingTasks && arrayOfNonMedicationTasks) {
      const extractedNonMedicationTasks = ExtractNonMedicationTasks(
        arrayOfNonMedicationTasks,
        filterValue,
        isReadMode
      );
      const extractedData = ExtractMedicationNursingTasksData(
        nursingTasks,
        filterValue,
        isReadMode
      );
      if (
        !isCurrentShift(
          shiftDetails,
          shiftConfig,
          startDateTimeChange,
          endDateTimeChange
        )
      ) {
        const filteredData = extractedData
          .map((extract) =>
            extract.filter(
              (data) => data.serviceType != asNeededPlaceholderConceptName
            )
          )
          .filter((innerArray) => innerArray.length > 0);
        setMedicationNursingTasks(
          extractedNonMedicationTasks.length > 0
            ? [...filteredData, ...extractedNonMedicationTasks]
            : filteredData
        );
      } else {
        setMedicationNursingTasks(
          extractedNonMedicationTasks.length > 0
            ? [...extractedData, ...extractedNonMedicationTasks]
            : extractedData
        );
      }
      setIsLoading(false);
      setIsShiftsButtonsDisabled({
        previous:
          (isReadMode &&
            nursingTasks.length === 0 &&
            arrayOfNonMedicationTasks.length === 0) ||
          nursingTasks[0].startDate > startDateTimeInSeconds,
        next:
          startDateTimeInSeconds >= nextShiftMaxHour ||
          endDateTimeInSeconds >= nextShiftMaxHour,
      });
    }
  };
  useEffect(() => {
    const sortedNursingTasks = [
      ...ExtractMedicationNursingTasksData(
        nursingTasks,
        filterValue,
        isReadMode
      ),
      ...ExtractNonMedicationTasks(nonMedicationTasks, filterValue, isReadMode),
    ];
    sortNursingTasks(sortedNursingTasks);
    setMedicationNursingTasks(sortedNursingTasks);
  }, [filterValue, nursingTasks, nonMedicationTasks]);

  const showTaskTiles = () => {
    return medicationNursingTasks.map(
      (medicationNursingTask, index, medicationNursingTasks) => {
        return (
          <div key={index}>
            {disableTaskTilePastNextSlotTime(medicationNursingTasks, index)}
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
      }
    );
  };

  const getNoTaskMessage = () => {
    switch (filterValue.id) {
      case "completed":
        return NoNursingTasksMessageForCompleted;
      case "pending":
        return NoNursingTasksMessageForPending;
      case "stopped":
        return NoNursingTasksMessageForStopped;
      case "prn":
        return NoPRNTasksMessageForStopped;
      case "missed":
        return NoNursingTasksMessageForMissed;
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

    const formattedShiftStartTime = enable24HourTime
      ? shiftStartTime
      : formatDate(startEndDates.startDate, timeFormatFor12Hr);

    const formattedShiftEndTime = enable24HourTime
      ? shiftEndTime
      : formatDate(startEndDates.endDate - 60, timeFormatFor12Hr);

    if (shiftStartDate === shiftEndDate) {
      return (
        <div className="shift-timing">
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
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
          {notCurrentShift && (
            <div className="not-current-shift-message-div">
              <WarningIcon />
              <span className="not-current-shift-message">
                {NotCurrentShiftMessage}
              </span>
            </div>
          )}
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
            disabled={isReadMode}
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
            disabled={isReadMode}
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
          disabled={isReadMode}
        />
      )}
      {isSliderOpen.emergencyTasks && (
        <AddEmergencyTasks
          patientId={patientId}
          providerId={provider.uuid}
          updateEmergencyTasksSlider={updateEmergencyTasksSlider}
          setShowSuccessNotification={setShowSuccessNotification}
          setSuccessMessage={setSuccessMessage}
          disabled={isReadMode}
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
