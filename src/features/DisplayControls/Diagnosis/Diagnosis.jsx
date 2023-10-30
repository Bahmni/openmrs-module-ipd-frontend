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
import PropTypes from "prop-types";
import "./Diagnosis.scss";

const Diagnosis = (props) => {
   
    const {patientId} = props;
    const[diagnosis, setDiagnosis] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    const NoDiagnosisMessage = (
    <FormattedMessage
        id={"NO_DIAGNOSIS_MESSAGE"}
        defaultMessage={"No Diagnosis found for this patient"}
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
        header: 'Diagnosed By',
        key: 'diagnosedBy',
        isSortable: true 
    },
    {
        id: '6',
        header: 'Diagnosis Date ',
        key: 'diagnosisDate',
        isSortable: true 
    },
    ];

    const mapDiagnosisData = (diagnosisList) => {
        const mappedDiagnoses = diagnosisList.map((diagnosis) => {
            let status = diagnosis.diagnosisStatusConcept ? "Inactive" : "Active";
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
        setIsLoading(false);
    };
    const getDiagnosis =  async () => {
        const diagnosisList  = await getPatientDiagnosis(patientId);
        mapDiagnosisData(diagnosisList);
    }

    useEffect (() => { 
        getDiagnosis();
    },[]);
    console.log("diagnosisList --- ", diagnosis);
    return ( <>
        {isLoading ? (
        <DataTableSkeleton data-testid="diagnosis-datatable-skeleton"/>)
            :  (
                diagnosis && diagnosis.length === 0 ? (
                <div className="no-dignosis-message">{NoDiagnosisMessage}</div> ) :
                <DataTable 
                    rows={diagnosis} 
                    headers={diagnosisHeaders} 
                    useZebraStyles={true}
                    >
                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                        <Table {...getTableProps()} useZebraStyles data-testid="diagnosis-datatable">
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
            )}
        </>);
    };

Diagnosis.propTypes = {
    patientId: PropTypes.string.isRequired,
  };
export default Diagnosis;
