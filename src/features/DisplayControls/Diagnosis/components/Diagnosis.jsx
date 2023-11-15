import React, {
  // useContext,
  useEffect,
} from "react";
import {
  DataTable,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
  Table,
  TableRow,
  DataTableSkeleton,
} from "carbon-components-react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { getPatientDiagnosis, diagnosisHeaders } from "../utils/DiagnosisUtils";
import PropTypes from "prop-types";
import "../styles/Diagnosis.scss";
import { formatDate } from "../../../../utils/DateTimeUtils";
// import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
// import { componentKeys } from "../../../../constants";

const Diagnosis = (props) => {
  const { patientId } = props;
  const [diagnosis, setDiagnosis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const refreshDisplayControl = useContext(RefreshDisplayControl);

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
            let diagnosisId = diagnosis.codedAnswer
              ? diagnosis.codedAnswer.uuid
              : diagnosis.freeTextAnswer + diagnosis.diagnosisDateTime;
            let diagnosisName = diagnosis.codedAnswer
              ? diagnosis.codedAnswer.name
              : diagnosis.freeTextAnswer;
            return {
              id: diagnosisId,
              diagnosis: diagnosisName,
              order: diagnosis.order,
              certainty: diagnosis.certainty,
              status: status,
              diagnosedBy: diagnosis.providers[0].name,
              diagnosisDate: diagnosisDate,
            };
          });
    setDiagnosis(mappedDiagnoses);
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
      {/* <button
        onClick={() => {
          // refreshDisplayControl([componentKeys.ALLERGIES ,componentKeys.TREATMENTS]);
          refreshDisplayControl([componentKeys.ALLERGIES]);
        }}
      >
        refresh
      </button> */}
      {isLoading ? (
        <DataTableSkeleton data-testid="diagnosis-datatable-skeleton" />
      ) : diagnosis && diagnosis.length === 0 ? (
        <div className="no-dignosis-message">{NoDiagnosisMessage}</div>
      ) : (
        <DataTable
          rows={diagnosis}
          headers={diagnosisHeaders}
          useZebraStyles={true}
        >
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table
              {...getTableProps()}
              useZebraStyles
              data-testid="diagnosis-datatable"
            >
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.id}
                      {...getHeaderProps({
                        header,
                        isSortable: header.isSortable,
                      })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      )}
    </>
  );
};

Diagnosis.propTypes = {
  patientId: PropTypes.string.isRequired,
};
export default Diagnosis;
