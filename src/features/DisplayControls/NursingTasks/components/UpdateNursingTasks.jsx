import React, { useEffect, useState } from "react";
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
import { TimePicker24Hour, Title } from "bahmni-carbon-ui";
import AdministeredMedicationList from "./AdministeredMedicationList";
import {
  saveAdministeredMedication,
  isTimeWithinAdministeredWindow,
} from "../utils/NursingTasksUtils";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import { performerFunction } from "../../../../constants";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";

const UpdateNursingTasks = (props) => {
  const {
    medicationTasks,
    updateNursingTasksSlider,
    patientId,
    providerId,
    setShowSuccessNotification,
  } = props;
  const [tasks, updateTasks] = useState({});
  const [errors, updateErrors] = useState({});
  const [showErrors, updateShowErrors] = useState(false);
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [isAnyMedicationSkipped, setIsAnyMedicationSkipped] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isAnyMedicationAdministered, setIsAnyMedicationAdministered] =
    useState(false);
  const [administeredTasks, setAdministeredTasks] = useState({});
  const [skippedTasks, setSkippedTasks] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const invalidTimeText24Hour = (
    <FormattedMessage
      id={"INVALID_TIME"}
      defaultMessage={"Please enter valid time"}
    />
  );
  const closeModal = () => {
    setOpenConfirmationModal(false);
  };

  const saveAdministeredTasks = () => {
    setShowSuccessNotification(true);
    setOpenConfirmationModal(false);
    updateNursingTasksSlider(false);
  };

  const handlePrimaryButtonClick = async () => {
    const administeredTasks = createAdministeredTasksPayload();
    const response = await saveAdministeredMedication(administeredTasks);
    response.status === 200 ? saveAdministeredTasks() : null;
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
            &nbsp;{time.format("HH:mm")}
          </>
        )}
      </div>
    );
  };
  useEffect(() => {
    medicationTasks.map((medicationTask) => {
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
          },
        };
      });
    });
  }, [medicationTasks]);

  useEffect(() => {
    checkFormStatus();
  }, [tasks]);

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
    updateIsSaveDisabled(saveDisabled);
  };

  const handleTimeChange = (time, id) => {
    if (!isTimeWithinAdministeredWindow(time, tasks[id].startTime)) {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: true,
          actualTime: moment(time, "HH:mm"),
        },
      });
      updateErrors({
        ...errors,
        [id]: Boolean(!tasks[id].notes),
      });
    } else {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: false,
          actualTime: moment(time, "HH:mm"),
        },
      });
      delete errors[id];
    }
  };

  const handleToggle = (checked, id) => {
    const time = moment().format("HH:mm");
    if (checked && !isTimeWithinAdministeredWindow(time, tasks[id].startTime)) {
      updateTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          isTimeOutOfWindow: true,
          isSelected: checked,
          actualTime: checked ? moment() : null,
        },
      });
      updateErrors({
        ...errors,
        [id]: Boolean(!tasks[id].notes),
      });
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
      if (tasks[id].isTimeOutOfWindow || tasks[id].skipped) {
        updateErrors({
          ...errors,
          [id]: true,
        });
      }
    }
  };

  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      setOpenConfirmationModal(true);
    }

    updateShowErrors(true);

    setTimeout(() => {
      updateShowErrors(false);
    }, 3000);

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
  };

  const handleClose = () => {
    if (isSaveDisabled) {
      updateNursingTasksSlider(false);
      setShowWarningNotification(false);
    } else {
      setShowWarningNotification(true);
    }
  };

  const handleSkipDrug = (medicationTask, skipped) => {
    updateTasks({
      ...tasks,
      [medicationTask.uuid]: {
        ...tasks[medicationTask.uuid],
        skipped: skipped,
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
    },
    onClose: () => {
      setShowWarningNotification(false);
    },
  };

  return (
    <>
      <SideBarPanel
        title={<FormattedMessage id="TASKS" defaultMessage={"Task(s)"} />}
        closeSideBar={handleClose}
      >
        <div className={"update-nursing-tasks"}>
          <div className={"task-heading"}>
            <FormattedMessage
              id={"SCHEDULED_FOR_KEY"}
              defaultMessage={"Scheduled for"}
            />
            <Clock />
            {medicationTasks[0].startTime}
          </div>
          {medicationTasks.map((medicationTask, index) => {
            return (
              <div key={index} className={"nursing-task-section"}>
                {!tasks[medicationTask.uuid]?.skipped && (
                  <Toggle
                    id={medicationTask.uuid}
                    size={"sm"}
                    labelA={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                    labelB={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                    onToggle={handleToggle}
                  />
                )}
                <div className={"medication-name"}>
                  <div
                    className={`name ${
                      tasks[medicationTask.uuid]?.skipped && "red-text"
                    }`}
                  >
                    {medicationTask.drugName}
                  </div>
                  <DisplayTags drugOrder={medicationTask.dosingInstructions} />
                </div>
                <div className="medication-details">
                  <span>{medicationTask.dosage}</span>
                  {medicationTask.doseType && (
                    <span>&nbsp;-&nbsp;{medicationTask.doseType}</span>
                  )}
                  <span>&nbsp;-&nbsp;{medicationTask.drugRoute}</span>
                </div>
                {(tasks[medicationTask.uuid]?.actualTime ||
                  tasks[medicationTask.uuid]?.skipped) && (
                  <div style={{ display: "flex" }}>
                    {tasks[medicationTask.uuid]?.actualTime && (
                      <TimePicker24Hour
                        defaultTime={tasks[
                          medicationTask.uuid
                        ]?.actualTime.format("HH:mm")}
                        onChange={(time) => {
                          handleTimeChange(time, medicationTask.uuid);
                        }}
                        labelText="Task Time"
                        invalidText={invalidTimeText24Hour}
                        light={true}
                      />
                    )}
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
                              tasks[medicationTask.uuid].isTimeOutOfWindow ||
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
                  </div>
                )}
                <OverflowMenu
                  flipped={true}
                  disabled={tasks[medicationTask.uuid]?.isSelected}
                  className={"overflowMenu"}
                >
                  {tasks[medicationTask.uuid]?.skipped ? (
                    <OverflowMenuItem
                      itemText={"Un-Skip Drug"}
                      onClick={() => {
                        handleSkipDrug(medicationTask, false);
                      }}
                    />
                  ) : (
                    <OverflowMenuItem
                      itemText={"Skip Drug"}
                      onClick={() => {
                        handleSkipDrug(medicationTask, true);
                      }}
                    />
                  )}
                </OverflowMenu>
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
            <FormattedMessage
              id={"NURSING_TASKS_CONFIRMATION"}
              defaultMessage={"Please confirm your nursing tasks"}
            />
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
  updateNursingTasksSlider: PropTypes.func.isRequired,
  patientId: PropTypes.string.isRequired,
  providerId: PropTypes.string.isRequired,
  setShowSuccessNotification: PropTypes.func.isRequired,
};
export default UpdateNursingTasks;
