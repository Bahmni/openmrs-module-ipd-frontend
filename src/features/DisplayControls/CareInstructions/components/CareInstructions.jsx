import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
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
} from "carbon-components-react";
import { IPDContext } from "../../../../context/IPDContext";
import { SliderContext } from "../../../../context/SliderContext";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import {
  fetchAcknowledgedObservationUuids,
  fetchCareInstructionsObs,
  mapObservationsToInstructions,
} from "../utils/CareInstructionsUtils.jsx";
import { getDateTimeFromEpochTime } from "../../../../utils/DateTimeUtils";
import AddEmergencyTasks from "../../NursingTasks/components/AddEmergencyTasks";
import Notification from "../../../../components/Notification/Notification";
import { isUserPrivileged } from "../../../../utils/CommonUtils";
import { PRIVILEGE_CONSTANTS, componentKeys } from "../../../../constants";
import "../styles/CareInstructions.scss";

const SKELETON_ROW_COUNT = 3;
const EMPTY_FORM_CONCEPTS = [];

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
  const [notificationStatus, setNotificationStatus] = useState("");

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
  const [selectedObservationUuid, setSelectedObservationUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchAcknowledgedObservationUuids(obsUuids).then(setAcknowledgedObsUuids);
  }, [instructions]);

  const notAcknowledgedInstructions = useMemo(
    () =>
      instructions.filter(
        (row) => !acknowledgedObsUuids.has(row.observationUuid)
      ),
    [instructions, acknowledgedObsUuids]
  );
  const acknowledgedInstructions = useMemo(
    () =>
      instructions.filter((row) =>
        acknowledgedObsUuids.has(row.observationUuid)
      ),
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
          <TableRow key={row.id}>
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
                    if (!isSliderOpen.careInstructionsTasks) {
                      setSelectedObservationUuid(row.observationUuid);
                      updateCareInstructionsTasksSlider(true);
                    }
                  }}
                >
                  <FormattedMessage id="ADD_TASK" defaultMessage="Add Task" />
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

  if (isLoading) {
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
          providerId={provider?.uuid}
          updateEmergencyTasksSlider={updateCareInstructionsTasksSlider}
          setShowNotification={setShowNotification}
          setNotificationMessage={setNotificationMessage}
          setNotificationStatus={setNotificationStatus}
          hideMedicationTab={true}
          observationUuid={selectedObservationUuid}
        />
      )}
      {showNotification && (
        <Notification
          hostData={{
            notificationKind: notificationStatus,
            messageId: notificationMessage,
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
