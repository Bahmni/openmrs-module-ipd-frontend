import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import {
  DataTableSkeleton,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Modal,
  Button,
} from "carbon-components-react";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import {
  fetchAcknowledgedObservationUuids,
  fetchCareInstructionsObs,
  fetchTasksByObservationUuids,
  mapObservationsToInstructions,
} from "../utils/CareInstructionsUtils.jsx";
import {
  updateNonMedicationTask,
} from "../../NursingTasks/utils/NursingTasksUtils";
import { getDateTimeFromEpochTime } from "../../../../utils/DateTimeUtils";
import AddEmergencyTasks from "../../NursingTasks/components/AddEmergencyTasks";
import Notification from "../../../../components/Notification/Notification";
import { isUserPrivileged } from "../../../../utils/CommonUtils";
import { PRIVILEGE_CONSTANTS, componentKeys } from "../../../../constants";
import "../styles/CareInstructions.scss";

const SKELETON_ROW_COUNT = 3;
const EMPTY_FORM_CONCEPTS = [];
const getInitialTaskName = (instructionType, instruction) =>
  [instructionType, instruction].filter(Boolean).join(" - ");

const CareInstructions = (props) => {
  const { patientId, config: { formConcepts = EMPTY_FORM_CONCEPTS } = {} } =
    props;
  const ipdContext = useContext(IPDContext);
  const intl = useIntl();
  const { visit, config, currentUser } = ipdContext;
  const { enable24HourTime = false } = config || {};
  const { isSliderOpen, updateSliderOpen, provider } =
    useContext(SliderContext);
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationDirectMessage, setNotificationDirectMessage] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("");
  const providerUuid = provider?.uuid;

  const handleSetNotificationMessage = (msg) => {
    setNotificationMessage(msg);
    setNotificationDirectMessage("");
  };

  const updateCareInstructionsTasksSlider = (value) => {
    updateSliderOpen((prev) => ({ ...prev, careInstructionsTasks: value }));
  };

  const allConceptNames = useMemo(
    () => [
      ...new Set(formConcepts.flatMap((formConcept) => formConcept.concepts)),
    ],
    [formConcepts]
  );

  const [instructions, setInstructions] = useState([]);
  const [acknowledgedObsUuids, setAcknowledgedObsUuids] = useState(new Set());
  const [selectedInstruction, setSelectedInstruction] = useState({
    observationUuid: null,
    orderUuid: null,
    instruction: "",
    initialTaskName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAcknowledgedLoading, setIsAcknowledgedLoading] = useState(false);
  const [pendingTaskUuidsByObservation, setPendingTaskUuidsByObservation] = useState({});
  const [isStoppingTasks, setIsStoppingTasks] = useState(false);

  const careInstructionsHeaders = useMemo(
    () => [
      {
        key: "dateAndTime",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_DATE_AND_TIME_HEADER",
          defaultMessage: "Date and Time",
        }),
      },
      {
        key: "form",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_FORM_HEADER",
          defaultMessage: "Form",
        }),
      },
      {
        key: "instructionType",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_INSTRUCTION_TYPE_HEADER",
          defaultMessage: "Instruction Type",
        }),
      },
      {
        key: "instruction",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_INSTRUCTION_HEADER",
          defaultMessage: "Instruction",
        }),
      },
      {
        key: "providerName",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_PROVIDER_NAME_HEADER",
          defaultMessage: "Provider Name",
        }),
      },
      {
        key: "action",
        header: intl.formatMessage({
          id: "CARE_INSTRUCTIONS_ACTION_HEADER",
          defaultMessage: "Action",
        }),
      },
      {
        key: "stopTasks",
        header: "",
      },
    ],
    [intl]
  );

  useEffect(() => {
    const loadInstructions = async () => {
      if (!visit || formConcepts.length === 0) return;

      setIsLoading(true);

      try {
        const observations = await fetchCareInstructionsObs(
          visit,
          allConceptNames
        );

        const mapped = mapObservationsToInstructions(
          observations,
          formConcepts
        );

        const allInstructions = mapped
          .map((instruction, index) => ({
            id: `${instruction.encounterUuid}-${instruction.instructionType}-${index}`,
            ...instruction,
          }))
          .sort(
            (instructionA, instructionB) =>
              instructionB.encounterDateTime - instructionA.encounterDateTime
          );

        setInstructions(allInstructions);
      } catch (error) {
        console.error("Failed to load care instructions", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstructions();
  }, [visit, formConcepts]);

  useEffect(() => {
    const obsUuids = instructions
      .map((instruction) => instruction.observationUuid)
      .filter(Boolean);
    if (obsUuids.length === 0) return;
    setIsAcknowledgedLoading(true);
    fetchAcknowledgedObservationUuids(obsUuids)
      .then(setAcknowledgedObsUuids)
      .finally(() => setIsAcknowledgedLoading(false));
  }, [instructions]);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      if (instructions.length === 0) return;
      try {
        const observationUuids = new Set();
        instructions.forEach((instruction) => {
          observationUuids.add(instruction.observationUuid);
          if (instruction.previousVersionUuid) {
            observationUuids.add(instruction.previousVersionUuid);
          }
        });

        const pendingTasks = await fetchTasksByObservationUuids(
          Array.from(observationUuids),
          'requested'
        );

        const taskUuidsByObservation = {};
        pendingTasks?.forEach((task) => {
          const observationUuid = task.observationUuid;
          if (observationUuid) {
            if (!taskUuidsByObservation[observationUuid]) {
              taskUuidsByObservation[observationUuid] = [];
            }
            taskUuidsByObservation[observationUuid].push(task.uuid);
          }
        });

        setPendingTaskUuidsByObservation(taskUuidsByObservation);
      } catch (error) {
        console.error("Failed to fetch pending tasks", error);
      }
    };

    fetchPendingTasks();
  }, [instructions]);

  const getPendingTaskCount = (instruction) => {
    const currentVersionCount = pendingTaskUuidsByObservation[instruction.observationUuid]?.length || 0;
    const previousVersionCount = instruction.previousVersionUuid
      ? pendingTaskUuidsByObservation[instruction.previousVersionUuid]?.length || 0
      : 0;
    return currentVersionCount + previousVersionCount;
  };

  const notAcknowledgedInstructions = useMemo(
    () => instructions.filter((row) => !acknowledgedObsUuids.has(row.observationUuid)),
    [instructions, acknowledgedObsUuids]
  );

  const acknowledgedInstructions = useMemo(
    () => instructions.filter((row) => acknowledgedObsUuids.has(row.observationUuid)),
    [instructions, acknowledgedObsUuids]
  );

  const renderInstructionRows = (rows) => (
    <Table useZebraStyles>
      <TableHead>
        <TableRow>
          {careInstructionsHeaders.map((header) => (
            <TableHeader key={header.key}>{header.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            className={row.previousVersionUuid ? "edited-instruction-row" : ""}
          >
            <TableCell>
              {getDateTimeFromEpochTime(
                row.encounterDateTime,
                enable24HourTime
              )}
            </TableCell>
            <TableCell>{row.form}</TableCell>
            <TableCell>{row.instructionType}</TableCell>
            <TableCell className="instruction-cell">
              {row.instruction}
            </TableCell>
            <TableCell>{row.providerName}</TableCell>
            <TableCell className="action-cell">
              {isUserPrivileged(currentUser, PRIVILEGE_CONSTANTS.ADD_TASKS) && (
                <Link
                  onClick={() => {
                    if (!providerUuid) {
                      setNotificationStatus("error");
                      setNotificationMessage("UNKNOWN_ERROR");
                      setShowNotification(true);
                      return;
                    }
                    if (!isSliderOpen.careInstructionsTasks) {
                      setSelectedInstruction({
                        observationUuid: row.observationUuid,
                        orderUuid: row.orderUuid,
                        instruction: row.instruction,
                        initialTaskName: getInitialTaskName(
                          row.instructionType,
                          row.instruction
                        ),
                      });
                      updateCareInstructionsTasksSlider(true);
                    }
                  }}
                >
                  <FormattedMessage id="ADD_TASK" defaultMessage="Add Task" />
                </Link>
              )}
            </TableCell>
            <TableCell className="stop-tasks-cell">
              {getPendingTaskCount(row) > 0 && isUserPrivileged(currentUser, PRIVILEGE_CONSTANTS.EDIT_TASKS) && (
                <Link
                  style={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    setSelectedInstruction({
                      observationUuid: row.observationUuid,
                      previousVersionUuid: row.previousVersionUuid,
                    });
                    setIsStoppingTasks(true);
                  }}
                >
                  <FormattedMessage id="STOP_TASKS" defaultMessage="Stop Tasks" />
                </Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderNotAcknowledgedContent = () => {
    if (notAcknowledgedInstructions.length === 0) {
      return (
        <div className={"empty-state-message"}>
          <FormattedMessage
            id={"NO_CARE_INSTRUCTIONS_MESSAGE"}
            defaultMessage={
              "No care instructions are available for the patient"
            }
          />
        </div>
      );
    }
    return renderInstructionRows(notAcknowledgedInstructions);
  };

  const renderAcknowledgedContent = () => {
    if (acknowledgedInstructions.length === 0) {
      return (
        <div className={"empty-state-message"}>
          <FormattedMessage
            id={"NO_CARE_INSTRUCTIONS_MESSAGE"}
            defaultMessage={
              "No care instructions are available for the patient"
            }
          />
        </div>
      );
    }
    return renderInstructionRows(acknowledgedInstructions);
  };

  if (isLoading || isAcknowledgedLoading) {
    return (
      <div data-testid="care-instructions-loading">
        <DataTableSkeleton
          rowCount={SKELETON_ROW_COUNT}
          columnCount={careInstructionsHeaders.length}
        />
      </div>
    );
  }

  return (
    <div className={"care-instructions-display-control"}>
      <Tabs>
        <Tab
          id="notAcknowledged"
          label={intl.formatMessage({
            id: "NOT_ACKNOWLEDGED_TAB",
            defaultMessage: "Not Acknowledged",
          })}
        >
          {renderNotAcknowledgedContent()}
        </Tab>
        <Tab
          id="acknowledged"
          label={intl.formatMessage({
            id: "ACKNOWLEDGED_TAB",
            defaultMessage: "Acknowledged",
          })}
        >
          {renderAcknowledgedContent()}
        </Tab>
      </Tabs>
      {isSliderOpen.careInstructionsTasks && (
        <AddEmergencyTasks
          patientId={patientId}
          providerId={providerUuid}
          updateEmergencyTasksSlider={updateCareInstructionsTasksSlider}
          setShowNotification={setShowNotification}
          setNotificationMessage={handleSetNotificationMessage}
          setNotificationStatus={setNotificationStatus}
          hideMedicationTab={true}
          observationUuid={selectedInstruction.observationUuid}
          orderUuid={selectedInstruction.orderUuid}
          instruction={selectedInstruction.instruction}
          initialTaskName={selectedInstruction.initialTaskName}
        />
      )}
      {showNotification && (
        <Notification
          hostData={{
            notificationKind: notificationStatus,
            messageId: notificationMessage,
            defaultMessage: notificationDirectMessage || undefined,
          }}
          hostApi={{
            onClose: () => {
              setShowNotification(false);
              refreshDisplayControl([
                componentKeys.NURSING_TASKS,
                componentKeys.CARE_INSTRUCTIONS,
              ]);
            },
          }}
        />
      )}
      {isStoppingTasks && (
        <Modal
          open={isStoppingTasks}
          modalHeading={intl.formatMessage({
            id: "STOP_TASKS_CONFIRMATION_TITLE",
            defaultMessage: "Stop Pending Tasks",
          })}
          onRequestClose={() => {
            setIsStoppingTasks(false);
          }}
          primaryButtonText={intl.formatMessage({
            id: "CONFIRM_BUTTON",
            defaultMessage: "Confirm",
          })}
          secondaryButtonText={intl.formatMessage({
            id: "CANCEL_BUTTON",
            defaultMessage: "Cancel",
          })}
          onRequestSubmit={async () => {
            try {
              const currentVersionTaskUuids = pendingTaskUuidsByObservation[selectedInstruction.observationUuid] || [];
              const previousVersionTaskUuids = selectedInstruction.previousVersionUuid
                ? pendingTaskUuidsByObservation[selectedInstruction.previousVersionUuid] || []
                : [];

              const taskUuidsToStop = [...currentVersionTaskUuids, ...previousVersionTaskUuids];

              const updatePayload = taskUuidsToStop.map((taskUuid) => ({
                uuid: taskUuid,
                executionEndTime: Date.now(),
                status: "CANCELLED",
              }));

              const response = await updateNonMedicationTask(updatePayload);

              if (response?.status === 200) {
                setNotificationDirectMessage(intl.formatMessage({
                  id: "ALL_PENDING_TASKS_STOPPED_SUCCESSFULLY",
                  defaultMessage: "All pending tasks stopped successfully.",
                }));
                setNotificationMessage("");
                setNotificationStatus("success");
                setShowNotification(true);
              } else {
                throw new Error("Failed to update tasks");
              }

              setIsStoppingTasks(false);
            } catch (error) {
              setIsStoppingTasks(false);
              setNotificationDirectMessage(intl.formatMessage({
                id: "FAILED_TO_STOP_TASKS",
                defaultMessage: "Failed to stop tasks. Please try again.",
              }));
              setNotificationMessage("");
              setNotificationStatus("error");
              setShowNotification(true);
            }
          }}
          danger={true}
        >
          <p>
            <FormattedMessage
              id="STOP_TASKS_CONFIRMATION_MESSAGE"
              defaultMessage="Are you sure you want to stop all pending tasks for this instruction?"
            />
          </p>
        </Modal>
      )}
    </div>
  );
};

CareInstructions.propTypes = {
  patientId: PropTypes.string,
  config: PropTypes.shape({
    formConcepts: PropTypes.arrayOf(
      PropTypes.shape({
        formName: PropTypes.string.isRequired,
        concepts: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ),
  }),
};

export default CareInstructions;
