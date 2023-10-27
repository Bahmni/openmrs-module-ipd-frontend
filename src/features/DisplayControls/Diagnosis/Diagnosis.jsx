import React, { useEffect } from "react";
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
import { getPatientDiagnosis } from "./DiagnosisUtils";

const Diagnosis = () => {
   
  const patientUuid = "7cd01fbf-7b2e-4dc0-8ab4-7155cd86980b";
  const[diagnosis,setDiagnosis] = useState([]);
  const[isLoading,setIsLoading] = useState(null);
  
  const NoDiagnosisMessage = (
    <FormattedMessage
      id={"NO_DIAGNOSIS_MESSAGE"}
    />
);
  
const diagnosisHeaders = [
    {
        id: '1',
        header: 'Diagnosis',
        key: 'diagnosis',
        isSortable: true 
    },
    {
        id: '2',
        header: 'Order',
        key: 'order',
        isSortable: true 
    },
    {
        id: '3',
        header: 'Certainty',
        key: 'certainty',
        isSortable: true 
    },
    {
        id: '4',
        header: 'Status',
        key: 'status',
        isSortable: true 
    },
    {
        id: '5',
        header: 'Diagnosed by',
        key: 'diagnosedBy',
        isSortable: true 
    },
    {
        id: '6',
        header: 'Diagnosis date ',
        key: 'diagnosisDate',
        isSortable: true 
    },
  ];

const mapDiagnosisData = (diagnosisList) => {
    const mappedDiagnoses = diagnosisList.map((diagnosis) => {
        let status = diagnosis.diagnosisStatusConcept ? "INACTIVE" : "ACTIVE";
        let diagnosisDate = new Date(diagnosis.diagnosisDateTime).toLocaleDateString();
        return {
            id: diagnosis.codedAnswer.uuid,
            diagnosis: diagnosis.codedAnswer.name,
            order: diagnosis.order,
            certainty: diagnosis.certainty,
            status: status,
            diagnosedBy: diagnosis.providers[0].name,
            diagnosisDate: diagnosisDate
        };
    });
    setDiagnosis(mappedDiagnoses);
};
    const getDiagnosis =  async () => {
        const diagnosisList  = await getPatientDiagnosis(patientUuid);
        mapDiagnosisData(diagnosisList);
    }

    useEffect (() => { 
        setIsLoading(true);
        getDiagnosis();
        setIsLoading(false);
    },[]);

  return (
    isLoading ? (
        <DataTableSkeleton />) : diagnosis && diagnosis.length === 0 ? (
            <div>{NoDiagnosisMessage}</div>
        ) : (
        diagnosis.length != 0 && <DataTable rows={diagnosis} headers={diagnosisHeaders} >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()} useZebraStyles>
                <TableHead>
                    <TableRow>
                    {headers.map((header) => (
                        <TableHeader key={header.id} {...getHeaderProps({ header, isSortable: header.isSortable })}>
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
        )
  );
};


export default Diagnosis;
