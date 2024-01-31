import React, { useEffect } from "react";
import { DataTableSkeleton } from "carbon-components-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { getPatientDiagnosis, diagnosisHeaders } from "../utils/DiagnosisUtils";
import PropTypes from "prop-types";
import "../styles/Diagnosis.scss";
import { formatDate } from "../../../../utils/DateTimeUtils";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";
import DiagnosisExpandableRow from "./DiagnosisExpandableRow";
import NotesIcon from "../../../../icons/notes.svg";

const Diagnosis = (props) => {
  const { patientId } = props;
  const [diagnosis, setDiagnosis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [additionalData, setAdditionalData] = useState([]);

  const NoDiagnosisMessage = (
    <FormattedMessage
      id={"NO_DIAGNOSIS_MESSAGE"}
      defaultMessage={"No Diagnosis found for this patient"}
    />
  );

  const mapDiagnosisData = (diagnosisList) => {
    const mappedDiagnoses =
      diagnosisList === undefined || !Array.isArray(diagnosisList)
        ? []
        : diagnosisList.map((diagnosis) => {
            let status = diagnosis.diagnosisStatusConcept
              ? "Inactive"
              : "Active";
            let diagnosisDate = formatDate(
              diagnosis.diagnosisDateTime,
            );
            let diagnosisTime = formatDate(
              diagnosis.diagnosisDateTime,
              "HH:mm"
            );
            let diagnosisId = diagnosis.codedAnswer
              ? diagnosis.codedAnswer.uuid
              : diagnosis.freeTextAnswer + diagnosis.diagnosisDateTime;
            let diagnosisNotes = diagnosis.comments ? diagnosis.comments : "";
            let diagnosisName = getDrugName(diagnosis);
            return {
              id: diagnosisId,
              diagnosis: diagnosisName,
              order: diagnosis.order,
              certainty: diagnosis.certainty,
              status: status,
              diagnosedBy: diagnosis.providers[0].name,
              diagnosisDate: diagnosisDate,
              additionalData: {
                diagnosisTime: diagnosisTime,
                diagnosisNotes: diagnosisNotes,
              },
            };
          });

    setDiagnosis(mappedDiagnoses);
    const additionalMappedData = mappedDiagnoses.map((diagnosis) => {
      return {
        id: diagnosis.id,
        diagnosisTime: diagnosis.additionalData.diagnosisTime,
        diagnosisNotes: diagnosis.additionalData.diagnosisNotes,
        provider: diagnosis.diagnosedBy,
      };
    });
    setAdditionalData(additionalMappedData);
    setIsLoading(false);
  };

  const getDrugName = (diagnosis) => {
    if (diagnosis.codedAnswer && diagnosis.comments !== "") {
      return (
        <div className="notes-icon-div">
          <NotesIcon className="notes-icon" />
          <span className="drug-name">{diagnosis.codedAnswer.name}</span>
        </div>
      );
    } else if (diagnosis.codedAnswer) {
      return diagnosis.codedAnswer.name;
    }
    return diagnosis.freeTextAnswer;
  };

  const getDiagnosis = async () => {
    const diagnosisList = await getPatientDiagnosis(patientId);
    mapDiagnosisData(diagnosisList);
  };

  useEffect(() => {
    getDiagnosis();
  }, []);

  return (
    <div className="display-container">
      {isLoading ? (
        <DataTableSkeleton data-testid="diagnosis-datatable-skeleton" />
      ) : diagnosis && diagnosis.length === 0 ? (
        <div className="no-dignosis-message">{NoDiagnosisMessage}</div>
      ) : (
        <ExpandableDataTable
          rows={diagnosis}
          headers={diagnosisHeaders}
          additionalData={additionalData}
          component={(additionalData) => {
            return <DiagnosisExpandableRow data={additionalData} />;
          }}
          useZebraStyles={true}
        />
      )}
    </div>
  );
};

Diagnosis.propTypes = {
  patientId: PropTypes.string.isRequired,
};
export default Diagnosis;
