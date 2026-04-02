import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DataTableSkeleton,
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
import {
  extractInstructionsFromObs,
  fetchEncounterObs,
} from "../utils/CareInstructionsUtils.jsx";
import { getDateTimeFromEpochTime } from "../../../../utils/DateTimeUtils";
import "../styles/CareInstructions.scss";

const SKELETON_ROW_COUNT = 3;

const CareInstructions = (props) => {
  const { config: { formConcepts = [] } = {} } = props;
  const ipdContext = useContext(IPDContext);
  const intl = useIntl();
  const {
    allFormsFilledInCurrentVisit = [],
    isAllFormsFilledInCurrentVisitLoading,
    config,
  } = ipdContext;
  const { enable24HourTime = false } = config || {};

  const [instructions, setInstructions] = useState([]);
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
      if (isAllFormsFilledInCurrentVisitLoading) return;
      if (formConcepts.length === 0) return;

      setIsLoading(true);

      try {
        const configuredFormNames = formConcepts.map((fc) => fc.formName);

        const matchingFormEntries = allFormsFilledInCurrentVisit.filter(
          (form) => configuredFormNames.includes(form.formName)
        );

        // One fetchEncounterObs request per matching form entry (intentional N+1 —
        // no bulk encounter obs endpoint available; requests run in parallel via Promise.all)
        const results = await Promise.all(
          matchingFormEntries.map(async (formEntry) => {
            const formConceptConfig = formConcepts.find(
              (fc) => fc.formName === formEntry.formName
            );
            if (!formConceptConfig) return [];

            const encounterData = await fetchEncounterObs(
              formEntry.encounterUuid
            );
            if (!encounterData || !encounterData.observations) return [];

            const extracted = extractInstructionsFromObs(
              encounterData.observations,
              formConceptConfig.concepts
            );

            return extracted.map((item, idx) => ({
              id: `${formEntry.encounterUuid}-${item.conceptName}-${idx}`,
              encounterDateTime: formEntry.encounterDateTime,
              form: formEntry.formName,
              instructionType: item.conceptName,
              instruction: item.value,
              providerName: formEntry.providers?.[0]?.providerName ?? "",
              action: "",
            }));
          })
        );

        const allInstructions = results
          .flat()
          .sort((a, b) => b.encounterDateTime - a.encounterDateTime);

        setInstructions(allInstructions);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstructions();
  }, [
    allFormsFilledInCurrentVisit,
    isAllFormsFilledInCurrentVisitLoading,
    formConcepts,
  ]);

  const isDataLoading = isAllFormsFilledInCurrentVisitLoading || isLoading;

  const renderNotAcknowledgedContent = () => {
    if (instructions.length === 0) {
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

    return (
      <Table useZebraStyles>
        <TableHead>
          <TableRow>
            {careInstructionsHeaders.map((header) => (
              <TableHeader key={header.key}>{header.header}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {instructions.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {getDateTimeFromEpochTime(
                  row.encounterDateTime,
                  enable24HourTime
                )}
              </TableCell>
              <TableCell>{row.form}</TableCell>
              <TableCell>{row.instructionType}</TableCell>
              <TableCell>{row.instruction}</TableCell>
              <TableCell>{row.providerName}</TableCell>
              <TableCell>{row.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // TODO: Acknowledged tab — not yet implemented; will show acknowledged instructions in a future story
  const renderAcknowledgedContent = () => {
    return (
      <div className={"empty-state-message"}>
        <FormattedMessage
          id={"NO_ACKNOWLEDGED_RECORDS_MESSAGE"}
          defaultMessage={"No records available"}
        />
      </div>
    );
  };

  if (isDataLoading) {
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
    </div>
  );
};

CareInstructions.propTypes = {
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
