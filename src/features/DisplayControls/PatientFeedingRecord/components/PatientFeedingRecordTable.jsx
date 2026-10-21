import React from "react";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";

const PatientFeedingRecordTable = (props) => {
  const { rows, headers, useZebraStyles } = props;

  return (
    <DataTable rows={rows} headers={headers} useZebraStyles={useZebraStyles}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()} useZebraStyles>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableHeader
                  key={index + header.key}
                  {...getHeaderProps({ header })}
                >
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index + row.id}
                {...getRowProps({ row })}
                data-testid="table-body-row"
              >
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
};

export default PatientFeedingRecordTable;
