import React from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableExpandedRow,
  TableExpandHeader,
  TableExpandRow,
} from "carbon-components-react";
import PropTypes from "prop-types";
import DiagnosisExpandableRow from "../../features/DisplayControls/Diagnosis/components/DiagnosisExpandableRow";

const ExpandableDataTable = (props) => {
  const { rows, headers, additionalData } = props;

  console.log("rows", rows);
  console.log("additionalData", additionalData);
  return (
    <DataTable
      rows={rows}
      headers={headers}
      additionalData={additionalData}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
      }) => (
        <>
          {console.log("rows inside DT", rows)}
          {console.log("additionalData inside DT", additionalData)}
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader />
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableExpandRow>
                  {/* toggle based off of if the row is expanded. If it is, render TableExpandedRow */}
                  {row.isExpanded && (
                    <TableExpandedRow colSpan={headers.length + 1}>
                      {<DiagnosisExpandableRow row={row} additionalData={additionalData} />}
                    </TableExpandedRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    />
  );
};

ExpandableDataTable.propTypes = {
    rows: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    additionalData: PropTypes.array,
};
export default ExpandableDataTable;

