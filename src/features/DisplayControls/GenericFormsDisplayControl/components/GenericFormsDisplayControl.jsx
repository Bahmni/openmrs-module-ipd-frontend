import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IPDContext } from "../../../../context/IPDContext";
import {
  fetchAllConceptsForForm,
  fetchFormTranslations,
  formDisplayControlHeaders,
} from "../utils/GenericFormsDisplayControlUtils";
import "../styles/GenericFormDisplayControl.scss";
import {
  DataTableSkeleton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";
import { useIntl } from "react-intl";
import { ViewFormModal } from "./ViewFormModal";
import {
  formatDate,
  getFormattedDateTimeFromEpochTime,
} from "../../../../utils/DateTimeUtils";

const GenericFormsDisplayControl = (props) => {
  const {
    config: { formName: formName },
  } = props;
  const ipdContext = useContext(IPDContext);
  const intl = useIntl();
  const [formTemplate, setFormTemplate] = useState([]);
  const [formTranslations, setFormTranslations] = useState({});
  const [formEntries, setFormEntries] = useState([]);
  const [openViewFormModal, setOpenViewFormModal] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {
    allFormsSummary = [],
    allFormsFilledInCurrentVisit = [],
    config,
    isAllFormSummaryLoading,
    isAllFormsFilledInCurrentVisitLoading,
  } = ipdContext;
  const { enable24HourTime = {} } = config;
  const fetchFormConcepts = async (formUuid) => {
    const response = await fetchAllConceptsForForm(formUuid);
    if (response?.resources && response?.resources[0]?.value) {
      return JSON.parse(response?.resources[0]?.value);
    }
  };
  const restructureFormConcepts = (formConcepts) => {
    const form = formConcepts.map((formConcept) => {
      if (formConcept.type === "obsControl") {
        return {
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: false,
        };
      } else if (formConcept.type === "obsGroupControl") {
        return {
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: true,
          members: restructureFormConcepts(formConcept.controls),
        };
      } else if (formConcept.type === "section") {
        return {
          conceptName: formConcept.label.value,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: true,
          members: restructureFormConcepts(formConcept.controls),
        };
      }
    });
    return form;
  };

  useEffect(() => {
    setIsLoading(true);
    if (allFormsSummary.length > 0) {
      const formUuid = allFormsSummary.find(
        (form) => form.name === formName
      )?.uuid;
      if (formUuid) {
        fetchFormConcepts(formUuid).then((response) => {
          const finalResponse = restructureFormConcepts(response.controls);
          setFormTemplate(finalResponse);
        });
        fetchFormTranslations(formName, formUuid).then((response) => {
          setFormTranslations({ ...response.concepts, ...response.labels });
          setIsLoading(false);
        });
      }
    }
  }, [allFormsSummary]);

  useEffect(() => {
    const forms = allFormsFilledInCurrentVisit.filter(
      (form) => form.formName === formName
    );
    forms.sort((a, b) => b.encounterDateTime - a.encounterDateTime);
    setFormEntries(forms);
  }, [allFormsFilledInCurrentVisit]);

  const setModalValue = (uuid, value) => {
    setOpenViewFormModal({ ...openViewFormModal, [uuid]: value });
  };

  const getNoFormDataMessage = () => {
    return intl.formatMessage(
      {
        id: "NO_FORM_DATA_MESSAGE",
        defaultMessage: "No {formName} recorded for this patient in this visit",
      },
      { formName }
    );
  };

  return (
    <div className={"form-table-display-control"}>
      {isAllFormSummaryLoading ||
      isAllFormsFilledInCurrentVisitLoading ||
      isLoading ? (
        <DataTableSkeleton rowCount={3} columnCount={4} />
      ) : formEntries && formEntries.length > 0 ? (
        <Table useZebraStyles>
          <TableHead>
            <TableRow>
              {formDisplayControlHeaders.map((header, index) => (
                <TableHeader
                  key={index + header.key}
                  className={`${
                    header.key === "Provider" && "provider-column-width"
                  }`}
                >
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {formEntries.map((formEntry, index) => {
              const { encounterDateTime, providers } = formEntry;
              const provider = providers[0].providerName;
              return (
                <TableRow key={index}>
                  <TableCell>{formatDate(encounterDateTime)}</TableCell>
                  <TableCell>
                    {getFormattedDateTimeFromEpochTime(
                      encounterDateTime,
                      enable24HourTime
                    )}
                  </TableCell>
                  <TableCell>{provider}</TableCell>
                  <TableCell>
                    <Link
                      onClick={() => {
                        setModalValue(formEntry.encounterUuid, true);
                      }}
                    >
                      View
                    </Link>
                  </TableCell>
                  {openViewFormModal[formEntry.encounterUuid] && (
                    <ViewFormModal
                      encounterUuid={formEntry.encounterUuid}
                      callbacks={{ setModalValue }}
                      form={{ formTemplate, formTranslations }}
                      metadata={{
                        formName,
                        encounterDateTime: formEntry.encounterDateTime,
                        provider,
                        enable24HourTime,
                      }}
                    />
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className={"no-form-data"}>{getNoFormDataMessage()}</div>
      )}
    </div>
  );
};

export default GenericFormsDisplayControl;

GenericFormsDisplayControl.propTypes = {
  patientId: PropTypes.string,
  config: PropTypes.object,
};
