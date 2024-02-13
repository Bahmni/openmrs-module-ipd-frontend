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
import "./ExpandableDataTable.scss";

const ExpandableDataTable = (props) => {
  const { rows, headers, additionalData, component, useZebraStyles } = props;

  const renderExpandableRowComponent = (row, additionalData) => {
    const filteredData = additionalData.filter((data) => row.id === data.id);
    return filteredData.map((data) => component(data));
  };

  return (
    <DataTable
      rows={rows}
      headers={headers}
      additionalData={additionalData}
      useZebraStyles={useZebraStyles}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getExpandHeaderProps,
      }) => (
        <Table
          {...getTableProps()}
          data-testid="expandable-datatable"
          className="expandable-datatable"
        >
          <TableHead>
            <TableRow>
              <TableExpandHeader
                style={{ padding: "0px" }}
                id="expand"
                enableToggle
                {...getExpandHeaderProps()}
              />
              {headers.map((header) => (
                <TableHeader key={header.key} {...getHeaderProps({ header })}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return additionalData.map((data) => {
                if (data.id == row.id)
                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow
                        {...getRowProps({ row })}
                        data-testid="expandable-row"
                        className={data?.isNotScheduled && "green-row"}
                      >
                        {row.cells.map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={data?.isNotScheduled && "green-cell"}
                          >
                            {cell.value}
                          </TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}
                        className="expandable-row-content"
                      >
                        {renderExpandableRowComponent(row, additionalData)}
                      </TableExpandedRow>
                    </React.Fragment>
                  );
              });
            })}
          </TableBody>
        </Table>
      )}
    />
  );
};

ExpandableDataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  additionalData: PropTypes.array,
  component: PropTypes.func.isRequired,
  useZebraStyles: PropTypes.bool,
};
export default ExpandableDataTable;
