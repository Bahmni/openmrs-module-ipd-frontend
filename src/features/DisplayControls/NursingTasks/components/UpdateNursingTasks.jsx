import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import "../styles/UpdateNursingTasks.scss";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import Clock from "../../../../icons/clock.svg";
import {
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  TextArea,
  Toggle,
} from "carbon-components-react";
import moment from "moment";
import { TimePicker24Hour, Title, TimePicker } from "bahmni-carbon-ui";
import AdministeredMedicationList from "./AdministeredMedicationList";
import {
  saveAdministeredMedication,
  isTimeWithinAdministeredWindow,
  disableDoneTogglePostNextTaskTime,
  updateNonMedicationTask,
} from "../utils/NursingTasksUtils";
import { saveEmergencyMedication } from "../utils/EmergencyTasksUtils";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import {
  performerFunction,
  timeText12,
  timeText24,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
} from "../../../../constants";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { IPDContext } from "../../../../context/IPDContext";
import {
  formatDate,
  formatTime,
  isTimeInFuture,
} from "../../../../utils/DateTimeUtils";

const UpdateNursingTasks = (props) => {
  const {
    medicationTasks,
    groupSlotsByOrderId,
    updateNursingTasksSlider,
    patientId,
    providerId,
    setShowSuccessNotification,
    setSuccessMessage,
  } = props;
  const [tasks, updateTasks] = useState({});
  const [errors, updateErrors] = useState({});
  const [showErrors, updateShowErrors] = useState(false);
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [isPRNMedication, updateIsPRNMedication] = useState(false);
  const [isNonMedication, updateIsNonMedication] = useState(false);
  const [isSystemGeneratedNonMedication, updateIsSystemGeneratedNonMedication] =
    useState(false);
  const [isAnyMedicationSkipped, setIsAnyMedicationSkipped] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isAnyMedicationAdministered, setIsAnyMedicationAdministered] =
    useState(false);
  const [administeredTasks, setAdministeredTasks] = useState({});
  const [skippedTasks, setSkippedTasks] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [isInvalidTime, setIsInvalidTime] = useState(false);
  const [invalidText, setInvalidText] = useState();

  const invalidTimeText = (
    <FormattedMessage
      id={"INVALID_TIME"}
      defaultMessage={"Please enter valid time"}
    />
  );

  const invalidFutureTimeText = (
    <FormattedMessage
      id={"FUTURE_TIME"}
      defaultMessage={"Future time is not allowed"}
    />
  );

  const closeModal = () => {
    setOpenConfirmationModal(false);
  };

  const { config, handleAuditEvent } = useContext(IPDContext);
  const { nursingTasks = {}, enable24HourTime = {} } = config;
  const relevantTaskStatusWindowInSeconds =
    nursingTasks && nursingTasks.timeInMinutesFromNowToShowTaskAsRelevant * 60;
  const saveAdministeredTasks = (task) => {
    setShowSuccessNotification(true);
    setSuccessMessage("NURSING_TASKS_SAVE_MESSAGE");
    setOpenConfirmationModal(false);
    updateNursingTasksSlider(false);
    updateIsPRNMedication(false);
    task.status === "not-done"
      ? handleAuditEvent("SKIP_SCHEDULED_MEDICATION_TASK")
      : handleAuditEvent("ADMINISTER_MEDICATION_TASK");
  };

  const saveAdministeredNonMedicationTasks = () => {
    setShowSuccessNotification(true);
    setSuccessMessage("NON_MEDICATION_TASK_UPDATE_MESSAGE");
    updateNursingTasksSlider(false);
    updateIsPRNMedication(false);
  };

  const handlePrimaryButtonClick = async () => {
    const administeredTasks = createAdministeredTasksPayload();
    const response = isPRNMedication
      ? await saveEmergencyMedication(administeredTasks[0])
      : await saveAdministeredMedication(administeredTasks);
    response.status === 200
      ? saveAdministeredTasks(administeredTasks[0])
      : null;
  };

  const createAdministeredTasksPayload = () => {
    const administeredTasksPayload = [];
    Object.keys(administeredTasks).forEach((key) => {
      const time = new Date(tasks[key].actualTime);
      const utcTimeEpoch = moment.utc(time).unix();

      administeredTasksPayload.push({
        patientUuid: patientId,
        orderUuid: administeredTasks[key].orderId,
        providers: [{ providerUuid: providerId, function: performerFunction }],
        notes: administeredTasks[key].notes
          ? [{ authorUuid: providerId, text: administeredTasks[key]?.notes }]
          : [],
        status: administeredTasks[key]?.status,
        slotUuid: key,
        administeredDateTime: utcTimeEpoch,
      });
    });
    Object.keys(skippedTasks).forEach((key) => {
      administeredTasksPayload.push({
        patientUuid: patientId,
        orderUuid: skippedTasks[key].orderId,
        providers: [{ providerUuid: providerId, function: performerFunction }],
        notes: skippedTasks[key].notes
          ? [{ authorUuid: providerId, text: skippedTasks[key]?.notes }]
          : [],
        status: skippedTasks[key]?.status,
        slotUuid: key,
        administeredDateTime: skippedTasks[key].scheduledTime,
      });
    });
    return administeredTasksPayload;
  };

  const getLabel = (time) => {
    return (
      <div>
        <FormattedMessage id={"DONE"} defaultMessage={"Done"} />
        &nbsp;
        {time && (
          <>
            <FormattedMessage id={"AT"} defaultMessage={"at"} />
            &nbsp;
            {enable24HourTime
              ? time.format(timeFormatFor24Hr)
              : time.format(timeFormatFor12Hr)}
          </>
        )}
      </div>
    );
  };
  useEffect(() => {
    medicationTasks.map((medicationTask) => {
      updateIsPRNMedication(medicationTask?.dosingInstructions?.asNeeded);
      updateIsNonMedication(medicationTask?.taskType?.display);
      updateIsSystemGeneratedNonMedication(
        medicationTask?.taskType?.display == "Automated Nursing Tasks"
      );
      updateTasks((prev) => {
        return {
          ...prev,
          [medicationTask.uuid]: {
            displayName: medicationTask.drugName,
            doseType: medicationTask.doseType,
            dosage: medicationTask.dosage,
            route: medicationTask.drugRoute,
            startTime: medicationTask.startTime,
            dosingInstructions: medicationTask.dosingInstructions,
            isSelected: false,
            actualTime: null,
            providerId: medicationTask.providerId,
            orderId: medicationTask.orderId,
            isRelevantTask:
              medicationTask.startTimeInEpochSeconds <=
              new Date().getTime() / 1000 + relevantTaskStatusWindowInSeconds,
          },
        };
      });
    });
  }, [medicationTasks]);

  useEffect(() => {
    checkFormStatus();
  }, [tasks, isInvalidTime]);

  const checkFormStatus = () => {
    let saveDisabled = true;
    Object.keys(tasks).forEach((key) => {
      if (tasks[key].isSelected) {
        saveDisabled = false;
        setIsAnyMedicationAdministered(true);
      }
      if (tasks[key].skipped) {
        saveDisabled = false;
        setIsAnyMedicationSkipped(true);
      }
    });
    updateIsSaveDisabled(saveDisabled || isInvalidTime);
  };

  const handleTimeChange = (time, id) => {
    const taskTime = enable24HourTime
      ? formatTime(time, timeFormatFor24Hr, timeFormatFor24Hr)
      : formatTime(time, timeFormatFor12Hr, timeFormatFor24Hr);
    if (
      !isTimeWithinAdministeredWindow(
        taskTime,
        tasks[id].startTime,
        nursingTasks
      )
    ) {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: true,
          actualTime: enable24HourTime
            ? moment(time, timeFormatFor24Hr)
            : moment(time, timeFormatFor12Hr),
        },
      });
      if (!isPRNMedication) {
        updateErrors({
          ...errors,
          [id]: Boolean(!tasks[id].notes),
        });
      }
    } else {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: false,
          actualTime: enable24HourTime
            ? moment(time, timeFormatFor24Hr)
            : moment(time, timeFormatFor12Hr),
        },
      });
      delete errors[id];
    }
  };

  const handleToggle = (checked, id) => {
    const time = enable24HourTime
      ? moment().format(timeFormatFor24Hr)
      : moment().format(timeFormatFor12Hr);
    if (
      checked &&
      !isTimeWithinAdministeredWindow(time, tasks[id].startTime, nursingTasks)
    ) {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: true,
          isSelected: checked,
          actualTime: checked ? moment() : null,
        },
      });
      if (!isPRNMedication) {
        updateErrors({
          ...errors,
          [id]: Boolean(!tasks[id].notes),
        });
      }
    } else {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: false,
          isSelected: checked,
          actualTime: checked ? moment() : null,
        },
      });
      delete errors[id];
    }
  };

  const handleNotes = (e, id) => {
    updateTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        notes: e.target.value,
      },
    });
    if (e.target.value) {
      delete errors[id];
    } else {
      if (
        !isPRNMedication &&
        (tasks[id].isTimeOutOfWindow || tasks[id].skipped)
      ) {
        updateErrors({
          ...errors,
          [id]: true,
        });
      }
    }
  };

  const handleSave = async () => {
    if (Object.keys(errors).length === 0) {
      if (!isNonMedication) {
        setOpenConfirmationModal(true);
      }
    }
    if (!isNonMedication) {
      updateShowErrors(true);
      setAdministeredTasks({});
      setSkippedTasks({});
      Object.keys(tasks).forEach((key) => {
        if (tasks[key].isSelected) {
          setAdministeredTasks((prev) => ({
            ...prev,
            [key]: { ...tasks[key], status: "completed" },
          }));
        } else if (tasks[key].skipped) {
          setSkippedTasks((prev) => ({
            ...prev,
            [key]: { ...tasks[key], status: "not-done" },
          }));
        }
      });
    } else {
      setSkippedTasks({});
      const nonMedicationPayload = [];
      let saveDisabled = true;
      Object.keys(tasks).forEach((key) => {
        if (tasks[key].isSelected) {
          saveDisabled = false;
          const time = new Date(tasks[key].actualTime);
          const utcTimeEpoch = moment.utc(time).unix() * 1000;
          nonMedicationPayload.push({
            uuid: key,
            status: "COMPLETED",
            executionEndTime: utcTimeEpoch,
          });
        }
        if (tasks[key].skipped) {
          setSkippedTasks((prev) => ({
            ...prev,
            [key]: { ...tasks[key], status: "not-done" },
          }));
          const utcTimeEpoch = moment.utc().unix() * 1000;
          nonMedicationPayload.push({
            uuid: key,
            executionEndTime: utcTimeEpoch,
            comment: tasks[key].notes,
            status: "REJECTED",
          });
        }
      });
      updateIsSaveDisabled(saveDisabled || isInvalidTime);
      const response = await updateNonMedicationTask(nonMedicationPayload);
      response.status === 200 ? saveAdministeredNonMedicationTasks() : null;
    }
  };

  const handleClose = () => {
    if (isSaveDisabled) {
      updateNursingTasksSlider(false);
      setShowWarningNotification(false);
    } else {
      setShowWarningNotification(true);
    }
    setIsInvalidTime(false);
    setInvalidText("");
    updateShowErrors(false);
  };

  const handleSkipDrug = (medicationTask, skipped) => {
    updateTasks({
      ...tasks,
      [medicationTask.uuid]: {
        ...tasks[medicationTask.uuid],
        skipped: skipped,
        scheduledTime: medicationTask.startTimeInEpochSeconds,
      },
    });
    if (skipped && !tasks[medicationTask.uuid].notes) {
      updateErrors({
        ...errors,
        [medicationTask.uuid]: skipped,
      });
    } else {
      delete errors[medicationTask.uuid];
    }
  };

  const sliderCloseActions = {
    onCancel: () => {
      setShowWarningNotification(false);
      updateNursingTasksSlider(false);
      setIsInvalidTime(false);
      setInvalidText("");
    },
    onClose: () => {
      setIsInvalidTime(false);
      setInvalidText("");
      setShowWarningNotification(false);
    },
  };

  const customValidation = (time) => {
    if (time) {
      if (
        isTimeInFuture(
          time,
          formatDate(
            new Date(),
            enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
          )
        )
      ) {
        setIsInvalidTime(true);
        setInvalidText(invalidFutureTimeText);
      } else {
        setIsInvalidTime(false);
      }
    }
  };

  const actionForInvalidTime = (invalid) => {
    setIsInvalidTime(invalid);
    setInvalidText(invalidTimeText);
  };

  return (
    <>
      <SideBarPanel
        title={<FormattedMessage id="TASKS" defaultMessage={"Task(s)"} />}
        closeSideBar={handleClose}
      >
        <div className={"update-nursing-tasks"}>
          {!isPRNMedication && (
            <div className={"task-heading"}>
              <FormattedMessage
                id={"SCHEDULED_FOR_KEY"}
                defaultMessage={"Scheduled for"}
              />
              <Clock />
              {enable24HourTime
                ? formatTime(
                    medicationTasks[0].startTime,
                    timeFormatFor24Hr,
                    timeFormatFor24Hr
                  )
                : formatTime(
                    medicationTasks[0].startTime,
                    timeFormatFor24Hr,
                    timeFormatFor12Hr
                  )}
            </div>
          )}
          {medicationTasks.map((medicationTask, index) => {
            return (
              <div key={index} className={"nursing-task-section"}>
                {!tasks[medicationTask.uuid]?.skipped && (
                  <Toggle
                    data-testId="done-toggle"
                    id={medicationTask.uuid}
                    size={"sm"}
                    labelA={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                    labelB={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                    onToggle={handleToggle}
                    disabled={
                      !tasks[medicationTask.uuid]?.isRelevantTask ||
                      (!medicationTask.isANonMedicationTask &&
                        medicationTask.serviceType !== "AsNeededPlaceholder" &&
                        disableDoneTogglePostNextTaskTime(
                          medicationTask,
                          groupSlotsByOrderId
                        ))
                    }
                  />
                )}
                <div className={"medication-name"}>
                  {!isNonMedication ? (
                    <div
                      className={`name ${
                        tasks[medicationTask.uuid]?.skipped && "red-text"
                      }`}
                    >
                      {medicationTask.drugName}
                    </div>
                  ) : (
                    <div
                      className={`name ${
                        tasks[medicationTask.uuid]?.skipped && "red-text"
                      }`}
                    >
                      {medicationTask.drugName}
                      {!isNonMedication ? (
                        <>
                          <FormattedMessage id={"AT"} defaultMessage={" at "} />
                          {enable24HourTime
                            ? formatTime(
                                medicationTasks[0].startTime,
                                timeFormatFor24Hr,
                                timeFormatFor24Hr
                              )
                            : formatTime(
                                medicationTasks[0].startTime,
                                timeFormatFor24Hr,
                                timeFormatFor12Hr
                              )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {!isNonMedication ? (
                    <DisplayTags
                      drugOrder={medicationTask.dosingInstructions}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                {tasks[medicationTask.uuid]?.route ? (
                  <div className="medication-details">
                    <span>{medicationTask.dosage}</span>
                    {medicationTask.doseType && (
                      <span>&nbsp;-&nbsp;{medicationTask.doseType}</span>
                    )}
                    <span>&nbsp;-&nbsp;{medicationTask.drugRoute}</span>
                  </div>
                ) : (
                  <></>
                )}
                {(tasks[medicationTask.uuid]?.actualTime ||
                  tasks[medicationTask.uuid]?.skipped) && (
                  <div style={{ display: "flex" }}>
                    {tasks[medicationTask.uuid]?.actualTime &&
                      !isSystemGeneratedNonMedication &&
                      (enable24HourTime ? (
                        <TimePicker24Hour
                          defaultTime={tasks[
                            medicationTask.uuid
                          ]?.actualTime.format(timeFormatFor24Hr)}
                          onChange={(time) => {
                            handleTimeChange(time, medicationTask.uuid);
                          }}
                          labelText={`Task Time (${timeText24})`}
                          customValidation={customValidation}
                          actionForInvalidTime={actionForInvalidTime}
                          invalid={isInvalidTime}
                          invalidText={invalidText}
                          light={true}
                          width={"150px"}
                        />
                      ) : (
                        <TimePicker
                          defaultTime={tasks[
                            medicationTask.uuid
                          ]?.actualTime.format(timeFormatFor12Hr)}
                          onChange={(time) => {
                            handleTimeChange(time, medicationTask.uuid);
                          }}
                          labelText={`Task Time (${timeText12})`}
                          customValidation={customValidation}
                          actionForInvalidTime={actionForInvalidTime}
                          invalid={isInvalidTime}
                          invalidText={invalidText}
                          light={true}
                          width={"150px"}
                        />
                      ))}

                    {!isNonMedication ||
                    (isNonMedication && tasks[medicationTask.uuid].skipped) ? (
                      <div
                        className={`${
                          Boolean(tasks[medicationTask.uuid]?.actualTime) &&
                          "notes-text-area"
                        }`}
                        style={{ width: "100%" }}
                      >
                        <TextArea
                          labelText={
                            <Title
                              text={"Notes"}
                              isRequired={
                                isPRNMedication
                                  ? false
                                  : tasks[medicationTask.uuid]
                                      .isTimeOutOfWindow ||
                                    tasks[medicationTask.uuid].skipped
                              }
                            />
                          }
                          onChange={(e) => {
                            handleNotes(e, medicationTask.uuid);
                          }}
                          maxCount={250}
                          rows={1}
                          cols={50}
                          light={true}
                        />
                        {showErrors && errors[medicationTask.uuid] && (
                          <div className={"error"}>
                            <FormattedMessage
                              id={"NOTES_ERROR_MESSAGE"}
                              defaultMessage={"Please enter notes"}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
                {!tasks[medicationTask.uuid]?.dosingInstructions?.asNeeded && (
                  <OverflowMenu
                    flipped={true}
                    disabled={tasks[medicationTask.uuid]?.isSelected}
                    className={"overflowMenu"}
                  >
                    {tasks[medicationTask.uuid]?.skipped ? (
                      <OverflowMenuItem
                        itemText={
                          !isNonMedication ? "Un-Skip Drug" : "Un-Skip Task"
                        }
                        onClick={() => {
                          handleSkipDrug(medicationTask, false);
                        }}
                      />
                    ) : (
                      <OverflowMenuItem
                        itemText={!isNonMedication ? "Skip Drug" : "Skip Task"}
                        onClick={() => {
                          handleSkipDrug(medicationTask, true);
                        }}
                      />
                    )}
                  </OverflowMenu>
                )}
              </div>
            );
          })}
        </div>
        <Modal
          open={
            (isAnyMedicationAdministered || isAnyMedicationSkipped) &&
            openConfirmationModal
          }
          onRequestClose={closeModal}
          onSecondarySubmit={closeModal}
          preventCloseOnClickOutside={true}
          modalHeading={
            isPRNMedication ? (
              <>
                <FormattedMessage
                  id={"PRN_TASKS_CONFIRMATION"}
                  defaultMessage={"Please confirm your PRN task"}
                />
              </>
            ) : (
              <>
                <FormattedMessage
                  id={"NURSING_TASKS_CONFIRMATION"}
                  defaultMessage={"Please confirm your nursing tasks"}
                />
              </>
            )
          }
          primaryButtonText={
            <FormattedMessage
              id={"DRUG_CHART_MODAL_SAVE"}
              defaultMessage={"Save"}
            />
          }
          secondaryButtonText={
            <FormattedMessage
              id={"DRUG_CHART_MODAL_CANCEL"}
              defaultMessage={"Cancel"}
            />
          }
          onRequestSubmit={handlePrimaryButtonClick}
        >
          <hr />
          <AdministeredMedicationList
            list={{ ...administeredTasks, ...skippedTasks }}
          />
        </Modal>
        <SaveAndCloseButtons
          onSave={handleSave}
          onClose={handleClose}
          isSaveDisabled={isSaveDisabled}
        />
      </SideBarPanel>

      {showWarningNotification && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage
              id="TREATMENTS_WARNING_TEXT"
              defaultMessage="You will lose the details entered. Do you want to continue?"
            />
          }
          label={""}
          primaryButtonText={<FormattedMessage id="NO" defaultMessage="No" />}
          secondaryButtonText={
            <FormattedMessage id="YES" defaultMessage="Yes" />
          }
          onSubmit={sliderCloseActions.onClose}
          onSecondarySubmit={sliderCloseActions.onCancel}
          onClose={sliderCloseActions.onClose}
        />
      )}
    </>
  );
};

UpdateNursingTasks.propTypes = {
  medicationTasks: PropTypes.array.isRequired,
  groupSlotsByOrderId: PropTypes.object.isRequired,
  updateNursingTasksSlider: PropTypes.func.isRequired,
  patientId: PropTypes.string.isRequired,
  providerId: PropTypes.string.isRequired,
  setShowSuccessNotification: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
};
export default UpdateNursingTasks;
