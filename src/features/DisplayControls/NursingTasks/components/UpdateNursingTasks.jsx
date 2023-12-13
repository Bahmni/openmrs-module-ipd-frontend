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
  Toggle,
  Tag,
  TextArea,
} from "carbon-components-react";
import moment from "moment";
import { TimePicker24Hour, Title } from "bahmni-carbon-ui";

const UpdateNursingTasks = (props) => {
  const { medicationTasks, updateNursingTasksSlider } = props;
  const [tasks, updateTasks] = useState({});
  const [errors, updateErrors] = useState({});
  const [showErrors, updateShowErrors] = useState(false);
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isAnyMedicationStopped, setIsAnyMedicationStopped] = useState(false);
  const closeModal = () => {
    setOpenConfirmationModal(false);
  };
  const invalidTimeText24Hour = (
    <FormattedMessage
      id={"INVALID_TIME"}
      defaultMessage={"Please enter valid time"}
    />
  );
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
            route: medicationTask.drugRoute,
            startTime: medicationTask.startTime,
            isSelected: false,
            actualTime: null,
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
      }
      if (tasks[key].stopped) {
        saveDisabled = false;
        setIsAnyMedicationStopped(true);
      }
    });
    updateIsSaveDisabled(saveDisabled);
  };

  const handleToggle = (checked, id) => {
    updateTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        isSelected: checked,
        actualTime: checked ? moment() : null,
      },
    });
  };

  const handleTimeChange = (time, id) => {
    updateTasks({
      ...tasks,
      [id]: {
        ...tasks[id],
        isTimeUpdated: true,
        actualTime: moment(time, "HH:mm"),
      },
    });
    updateErrors({
      ...errors,
      [id]: Boolean(!tasks[id].notes),
    });
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
      if (tasks[id].isTimeUpdated || tasks[id].stopped) {
        updateErrors({
          ...errors,
          [id]: true,
        });
      }
    }
  };

  return (
    <SideBarPanel
      title={<FormattedMessage id="TASKS" defaultMessage={"Task(s)"} />}
      closeSideBar={() => {
        updateNursingTasksSlider(false);
      }}
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
          console.log(medicationTask);
          return (
            <div key={index} className={"nursing-task-section"}>
              <div className={"actionable-section"}>
                <Toggle
                  id={medicationTask.uuid}
                  size={"sm"}
                  labelA={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                  labelB={getLabel(tasks[medicationTask.uuid]?.actualTime)}
                  onToggle={handleToggle}
                />
                <OverflowMenu flipped={true}>
                  <OverflowMenuItem
                    itemText={"Stop Drug"}
                    onClick={() => {
                      updateTasks({
                        ...tasks,
                        [medicationTask.uuid]: {
                          ...tasks[medicationTask.uuid],
                          stopped: true,
                        },
                      });
                      if (!tasks[medicationTask.uuid].notes) {
                        updateErrors({
                          ...errors,
                          [medicationTask.uuid]: true,
                        });
                      }
                    }}
                  />
                </OverflowMenu>
              </div>
              <div className={"medication-name"}>
                <div
                  className={`name ${
                    tasks[medicationTask.uuid]?.stopped && "red-text"
                  }`}
                >
                  {medicationTask.drugName}
                </div>
                <Tag type={"blue"}>Rx</Tag>
                {tasks[medicationTask.uuid]?.stopped && (
                  <Tag className={"red-tag"}>Stopped</Tag>
                )}
              </div>
              <div className="medication-details">
                <span>{medicationTask.dosage}</span>
                {medicationTask.doseType && (
                  <span>&nbsp;-&nbsp;{medicationTask.doseType}</span>
                )}
                <span>&nbsp;-&nbsp;{medicationTask.drugRoute}</span>
              </div>
              {(tasks[medicationTask.uuid]?.actualTime ||
                tasks[medicationTask.uuid]?.stopped) && (
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
                  >
                    <TextArea
                      labelText={
                        <Title
                          text={"Notes"}
                          isRequired={
                            tasks[medicationTask.uuid].isTimeUpdated ||
                            tasks[medicationTask.uuid].stopped
                          }
                        />
                      }
                      onChange={(e) => {
                        handleNotes(e, medicationTask.uuid);
                      }}
                      maxCount={250}
                      rows={1}
                      cols={60}
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
        open={isAnyMedicationStopped && openConfirmationModal}
        danger
        onRequestClose={closeModal}
        onSecondarySubmit={closeModal}
        preventCloseOnClickOutside={true}
        modalHeading={
          <FormattedMessage
            id={"STOP_DRUG_CONFIRMATION_TITLE"}
            defaultMessage={"Stop Drug?"}
          />
        }
        primaryButtonText={
          <FormattedMessage id={"YES"} defaultMessage={"Stop Drug"} />
        }
        secondaryButtonText={
          <FormattedMessage id={"NO"} defaultMessage={"Cancel"} />
        }
        onRequestSubmit={closeModal}
      >
        <FormattedMessage
          id={"STOP_DRUG_CONFIRMATION_MESSAGE"}
          defaultMessage={"Stop drug action cannot be reversed."}
        />
      </Modal>
      <SaveAndCloseButtons
        onSave={() => {
          if (Object.keys(errors).length === 0) {
            setOpenConfirmationModal(true);
          }
          updateShowErrors(true);
          setTimeout(() => {
            updateShowErrors(false);
          }, 3000);
        }}
        onClose={() => {
          updateNursingTasksSlider(false);
        }}
        isSaveDisabled={isSaveDisabled}
      />
    </SideBarPanel>
  );
};
UpdateNursingTasks.propTypes = {
  medicationTasks: PropTypes.array.isRequired,
  updateNursingTasksSlider: PropTypes.func.isRequired,
};
export default UpdateNursingTasks;
