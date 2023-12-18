import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import "../styles/UpdateNursingTasks.scss";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import Clock from "../../../../icons/clock.svg";
import { Toggle, Tag, TextArea, Modal, Notification } from "carbon-components-react";
import moment from "moment";
import { TimePicker24Hour, Title } from "bahmni-carbon-ui";
import SimpleStructuredList from "./StructuredList";

const UpdateNursingTasks = (props) => {
  const { medicationTasks, updateNursingTasksSlider } = props;
  const [tasks, updateTasks] = useState({});
  const [errors, updateErrors] = useState({});
  const [showErrors, updateShowErrors] = useState(false);
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [isAnyMedicationAdministered, setIsAnyMedicationAdministered] =
    useState(false);
  const [administeredTasks, setAdministeredTasks] = useState({});
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const invalidTimeText24Hour = (
    <FormattedMessage
      id={"INVALID_TIME"}
      defaultMessage={"Please enter valid time"}
    />
  );
  const closeModal = () => {
    setOpenConfirmationModal(false);
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
    console.log("medication tasks", medicationTasks);
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

  const handleToggle = (checked, id) => {
    console.log("tasks", tasks);
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
      if (tasks[id].isTimeUpdated) {
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

    Object.keys(tasks).forEach((key) => {
      if (tasks[key].isSelected) {
        setAdministeredTasks((prev) => ({
          ...prev,
          [key]: { ...tasks[key], status: "COMPLETED" },
        }));
      }
    });
  };

  const handlePrimaryButtonClick = () => {
    setIsNotificationOpen(true);
  };

  console.log("administeredTasks", administeredTasks);

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
                    defaultTime={tasks[medicationTask.uuid]?.actualTime.format(
                      "HH:mm"
                    )}
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
                          isRequired={tasks[medicationTask.uuid].isTimeUpdated}
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
        // onRequestSubmit={closeModal}
      >
        <div className="divider"></div>
        <SimpleStructuredList list={administeredTasks} />
      </Modal>
      <SaveAndCloseButtons
        onSave={handleSave}
        onClose={() => {
          updateNursingTasksSlider(false);
        }}
        isSaveDisabled={isSaveDisabled}
      />
      <Notification
        kind="success" // Adjust the kind based on your notification type (success, error, etc.)
        title="Notification Title"
        subtitle="Notification Subtitle"
        caption="Additional caption information"
        onClose={handleNotificationClose}
        timeout={3000} // Set the timeout for auto-closing the notification (optional)
        hideCloseButton={false} // Set to true if you want to hide the close button
        open={isNotificationOpen}
      />
    </SideBarPanel>
  );
};
UpdateNursingTasks.propTypes = {
  medicationTasks: PropTypes.array.isRequired,
  updateNursingTasksSlider: PropTypes.func.isRequired,
};
export default UpdateNursingTasks;
