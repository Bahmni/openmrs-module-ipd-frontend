import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable, Table, TableHead, TableRow, TableBody, TableCell, TableHeader } from 'carbon-components-react';
import '../styles/IntakeOutputTable.scss';
import { FormattedMessage } from "react-intl";

const IntakeOutputTable = (props) => {
  const { rows, headers, totalIntakeGroup, totalOutputGroup } = props;
  const [totalIntake, setTotalIntake] = useState({});
  const [totalOutput, setTotalOutput] = useState({});
  const [columnWidth, setColumnWidth] = useState("");

  useEffect(() => {
    setTotalIntake(totalIntakeGroup);
    setTotalOutput(totalOutputGroup);
  }, [totalIntakeGroup, totalOutputGroup]);

  useEffect(() => {
    const numColumns = headers.length;
    setColumnWidth(100 / numColumns + '%');
  }, []);

  return (
    <DataTable
      rows={rows}
      headers={headers}
      useZebraStyles={true}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
      }) => (
        <Table {...getTableProps()} useZebraStyles
          data-testid="intake-output-datatable"
          className="intake-output-datatable"
        >
          <TableHead>
            <TableRow className={"intput-output-table-header"}>
              {headers.map((header) => (
                <TableHeader key={header.key} {...getHeaderProps({ header })} width={columnWidth}>
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
                className={"intput-output-table-data"}
              >
                {row.cells.map((cell) => (
                  <TableCell key={cell.id} width={columnWidth}>
                    {cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {(totalIntake || totalOutput) && <TableRow className={"custom-row"}>
              <TableCell width={columnWidth}></TableCell>
              <TableCell colSpan={2}>
                <div className={"total-group-container"}>
                  {totalIntake && Object.keys(totalIntake).map((intake, index) => {
                    return (<div key={index} className={index < 2 ? "total-group-left-div" : index < 4 ? "total-group-right-div" : ""}> 
                      <FormattedMessage id="TOTAL_TEXT" defaultMessage={"Total"} /> {intake + ": " + totalIntake[intake].quantity + " " + totalIntake[intake].quantityUnits}
                    </div>)
                  })}
                </div>
              </TableCell>
              <TableCell colSpan={2}>
                <div className={"total-group-container"}>
                  {totalOutput && Object.keys(totalOutput).map((output, index) => {
                    return (<div key={index} className={index < 2 ? "total-group-left-div" : index < 4 ? "total-group-right-div" : ""}> 
                      <FormattedMessage id="TOTAL_TEXT" defaultMessage={"Total"} /> {output + ": " + totalOutput[output].quantity + " " + totalOutput[output].quantityUnits}
                    </div>)
                  })}
                </div>
              </TableCell>
              <TableCell width={columnWidth}></TableCell>
            </TableRow>}
          </TableBody>
      </Table>
      )}
    />
  );
};

IntakeOutputTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  totalIntakeGroup: PropTypes.object.isRequired,
  totalOutputGroup: PropTypes.object.isRequired,
};

export default IntakeOutputTable;
