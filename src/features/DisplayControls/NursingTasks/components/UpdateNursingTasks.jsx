import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import "../styles/UpdateNursingTasks.scss";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import Clock from "../../../../icons/clock.svg";
import { Toggle, Tag, TextArea, Modal } from "carbon-components-react";
import moment from "moment";
import { TimePicker24Hour, Title } from "bahmni-carbon-ui";
import AdministeredMedicationList from "./AdministeredMedicationList";
import { saveAdministeredMedication } from "../utils/NursingTasksUtils";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import data from "../../../../utils/config.json";
import { performerFunction } from "../utils/constants";

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
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isAnyMedicationAdministered, setIsAnyMedicationAdministered] =
    useState(false);
  const [administeredTasks, setAdministeredTasks] = useState({});
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

  const { config: { nursingTasks = {} } = {} } = data;

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
    });
    updateIsSaveDisabled(saveDisabled);
  };

  const timeToEpoch = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const specificTime = new Date();
    specificTime.setHours(hours, minutes, 0, 0);
    const epochTimeInSeconds = Math.floor(specificTime.getTime() / 1000);
    return epochTimeInSeconds;
  };

  const isTimeWithinAdministeredWindow = (time, id, index) => {
    const enteredTimeInEpochSeconds = timeToEpoch(time);
    const timeWithinWindowInEpochSeconds =
      timeToEpoch(tasks[id].startTime) +
      nursingTasks.timeInMinutesFromStartTimeToShowAdministeredTaskAsLate * 60;

    console.log("enteredTimeInEpochSeconds", enteredTimeInEpochSeconds);
    console.log(
      "timeWithinWindowInEpochSeconds",
      timeWithinWindowInEpochSeconds
    );
    if (enteredTimeInEpochSeconds > timeWithinWindowInEpochSeconds) {
      console.log("Inside if of isTimeWithinAdministeredWindow");
      return false;
    } else return true;
  };

  const handleTimeChange = (time, id) => {
    console.log("inside handleTimeChange");
    console.log("time", time);
    if (!isTimeWithinAdministeredWindow(time, id)) {
      console.log("Inside if of handleTimeChange");
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
    }
  };

  const handleToggle = (checked, id) => {
    console.log("inside handleToggle");
    const time = moment().format("HH:mm");
    if (!isTimeWithinAdministeredWindow(time, id)) {
      console.log("Inside if of handleToggle");
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
      if (tasks[id].isTimeOutOfWindow) {
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
    Object.keys(tasks).forEach((key) => {
      if (tasks[key].isSelected) {
        setAdministeredTasks((prev) => ({
          ...prev,
          [key]: { ...tasks[key], status: "completed" },
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

  const sliderCloseActions = {
    onCancel: () => {
      setShowWarningNotification(false);
      updateNursingTasksSlider(false);
    },
    onClose: () => {
      setShowWarningNotification(false);
    },
  };

  useEffect(() => {
    console.log("INFOOOO");
    console.log("tasks", tasks);
  }, [tasks]);

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
                <Toggle
                  id={medicationTask.uuid}
                  size={"sm"}
                  labelA={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                  labelB={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                  onToggle={handleToggle}
                />
                <div className={"medication-name"}>
                  <div className={"name"}>{medicationTask.drugName}</div>
                  <Tag type={"blue"}>Rx</Tag>
                </div>
                <div className="medication-details">
                  <span>{medicationTask.dosage}</span>
                  {medicationTask.doseType && (
                    <span>&nbsp;-&nbsp;{medicationTask.doseType}</span>
                  )}
                  <span>&nbsp;-&nbsp;{medicationTask.drugRoute}</span>
                </div>
                {tasks[medicationTask.uuid]?.actualTime && (
                  <div style={{ display: "flex" }}>
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
                    <div className={"notes-text-area"}>
                      <TextArea
                        labelText={
                          <Title
                            text={"Notes"}
                            isRequired={
                              tasks[medicationTask.uuid].isTimeOutOfWindow
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
              </div>
            );
          })}
        </div>
        <Modal
          open={isAnyMedicationAdministered && openConfirmationModal}
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
          <div className="divider"></div>
          <AdministeredMedicationList list={administeredTasks} />
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
