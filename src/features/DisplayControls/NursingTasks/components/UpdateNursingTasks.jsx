import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import "../styles/UpdateNursingTasks.scss";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import Clock from "../../../../icons/clock.svg";
import { Toggle, Tag, TextArea } from "carbon-components-react";
import moment from "moment";
import { TimePicker24Hour, Title } from "bahmni-carbon-ui";
import { getTagForTheDrugOrder } from "../../../../utils/DisplayTags";
import { useFetchIpdConfig } from "../../../../entries/Dashboard/hooks/useFetchIpdConfig";

const UpdateNursingTasks = (props) => {
  const { medicationTasks, updateNursingTasksSlider } = props;
  const [tasks, updateTasks] = useState({});
  const [errors, updateErrors] = useState({});
  const [showErrors, updateShowErrors] = useState(false);
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const { configData, isConfigLoading } = useFetchIpdConfig();
  const [ipdConfig, setIpdConfig] = useState();

  useEffect(() => {
    if (configData && ipdConfig === undefined) {
      setIpdConfig(configData);
    }
  }, [configData]);

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
            dosingInstructions: medicationTask.dosingInstructions,
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
      if (tasks[id].isTimeUpdated) {
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
                {getTagForTheDrugOrder(medicationTask.dosingInstructions, ipdConfig)}
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
      <SaveAndCloseButtons
        onSave={() => {
          updateShowErrors(true);
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
