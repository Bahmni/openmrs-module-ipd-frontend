import React, { useEffect } from "react";
import { DataTableSkeleton } from "carbon-components-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { getPatientDiagnosis, diagnosisHeaders } from "../utils/DiagnosisUtils";
import PropTypes from "prop-types";
import "../styles/Diagnosis.scss";
import { formatDate } from "../../../../utils/DateTimeUtils";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";

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
              "DD/MM/YYYY"
            );
            let diagnosisTime = formatDate(
              diagnosis.diagnosisDateTime,
              "HH:mm"
            );
            let diagnosisId = diagnosis.codedAnswer
              ? diagnosis.codedAnswer.uuid
              : diagnosis.freeTextAnswer + diagnosis.diagnosisDateTime;
            let diagnosisName = diagnosis.codedAnswer
              ? diagnosis.codedAnswer.name
              : diagnosis.freeTextAnswer;
            let diagnosisNotes = diagnosis.comments;
            return {
              id: diagnosisId,
              diagnosis: diagnosisName,
              order: diagnosis.order,
              certainty: diagnosis.certainty,
              status: status,
              diagnosedBy: diagnosis.providers[0].name,
              diagnosisDate: diagnosisDate,
              additionalData: {
                id: diagnosisId,
                diagnosisTime: diagnosisTime,
                diagnosisNotes: diagnosisNotes,
              },
            };
          });

    setDiagnosis(mappedDiagnoses);
    console.log("mappedDiagnoses", mappedDiagnoses);
    const additionalMappedData = mappedDiagnoses.map((diagnosis) => {
      return {
        id: diagnosis.additionalData.id,
        diagnosisTime: diagnosis.additionalData.diagnosisTime,
        diagnosisNotes: diagnosis.additionalData.diagnosisNotes,
      };
    });
    console.log("additionalMappedData", additionalMappedData);
    setAdditionalData(additionalMappedData);
    setIsLoading(false);
  };
  const getDiagnosis = async () => {
    const diagnosisList = await getPatientDiagnosis(patientId);
    mapDiagnosisData(diagnosisList);
  };

  useEffect(() => {
    getDiagnosis();
  }, []);

  return (
    <>
      {isLoading ? (
        <DataTableSkeleton data-testid="diagnosis-datatable-skeleton" />
      ) : diagnosis && diagnosis.length === 0 ? (
        <div className="no-dignosis-message">{NoDiagnosisMessage}</div>
      ) : (
        <ExpandableDataTable
          rows={diagnosis}
          headers={diagnosisHeaders}
          additionalData={additionalData}
          useZebraStyles={true}
        />
      )}
    </>
  );
};

Diagnosis.propTypes = {
  patientId: PropTypes.string.isRequired,
};
export default Diagnosis;
