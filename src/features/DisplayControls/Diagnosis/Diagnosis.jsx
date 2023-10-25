import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Accordion,
  AccordionItem,
  DataTable,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
  Table,
  TableRow,
  DataTableSkeleton,
} from "carbon-components-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { getPatientDiagnosis } from "./DiagnosisUtils";

const Diagnosis = (props) => {
  const { hostData } = props;
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const data = [
    {
      id: 1,
      diagnosis: "Anemia",
      order: "Primary",
      certainity: "confirmed",
      status: "Active",
      diagnosedBy: "Dr ",
      diagnosisDate: new Date().toLocaleDateString(),
    },
  ];
  const NoTreatmentsMessage = <FormattedMessage id={"NO_TREATMENTS_MESSAGE"} />;

  const diagnosisHeaders = [
    {
      header: "Diagnosis",
      key: "diagnosis",
      isSortable: true,
    },
    {
      header: "Order",
      key: "order",
      isSortable: true,
    },
    {
      header: "Certainity",
      key: "certainity",
      isSortable: true,
    },
    {
      header: "Status",
      key: "status",
      isSortable: true,
    },
    {
      header: "Diagnosed by",
      key: "diagnosedBy",
      isSortable: true,
    },
    {
      header: "Diagnosis date ",
      key: "diagnosisDate",
      isSortable: true,
    },
  ];

  const getDiagnosis = async () => {
    console.log("+++++++", hostData.patient.uuid);
    const diagnosisList = await getPatientDiagnosis(hostData.patient.uuid);
    console.log("diagnosisList", diagnosisList);
  };

  useEffect(() => {
    setDiagnosis(data);
    setIsLoading(false);
    getDiagnosis();
  }, []);

  return (
    <I18nProvider>
      <Accordion align="end">
        <AccordionItem className="diagnosis-accordion" open title="Diagnosis">
          {isLoading ? (
            <DataTableSkeleton />
          ) : diagnosis && diagnosis.length === 0 ? (
            <div>{NoTreatmentsMessage}</div>
          ) : (
            <DataTable rows={diagnosis} headers={diagnosisHeaders}>
              {({
                rows,
                headers,
                getTableProps,
                getHeaderProps,
                getRowProps,
              }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader
                          key={header}
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
                      <TableRow key={row} {...getRowProps({ row })}>
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
        </AccordionItem>
      </Accordion>
    </I18nProvider>
  );
};
Diagnosis.propTypes = {
  hostData: PropTypes.shape({
    patient: { uuid: PropTypes.string },
  }).isRequired,
};
export default Diagnosis;
