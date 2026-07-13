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
  const {
    rows,
    headers,
    additionalData,
    component,
    useZebraStyles,
    isExpandable,
  } = props;

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
              const matchedData = additionalData.find(
                (data) => data.id === row.id
              );
              if (matchedData) {
                const expandable = isExpandable
                  ? isExpandable(matchedData)
                  : true;
                const rowClassName = matchedData?.isNotScheduled
                  ? "green-row"
                  : matchedData?.isVariableDose
                  ? "variable-dose-row"
                  : "";
                const cellClassName = matchedData?.isNotScheduled
                  ? "green-cell"
                  : matchedData?.isVariableDose
                  ? "variable-dose-cell"
                  : "";
                if (expandable) {
                  return (
                    <React.Fragment key={row.id}>
                      <TableExpandRow
                        {...getRowProps({ row })}
                        data-testid="expandable-row"
                        className={rowClassName}
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id} className={cellClassName}>
                            {cell.value}
                          </TableCell>
                        ))}
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 1}
                        className="expandable-row-content variable-dose-expanded-row"
                      >
                        {component(matchedData)}
                      </TableExpandedRow>
                    </React.Fragment>
                  );
                }
                return (
                  <TableRow
                    key={row.id}
                    {...getRowProps({ row })}
                    data-testid="non-expandable-row"
                    className={rowClassName}
                  >
                    <TableCell
                      style={{ padding: "0px", width: "2rem" }}
                      className={cellClassName}
                    />
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id} className={cellClassName}>
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }
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
  isExpandable: PropTypes.func,
};
export default ExpandableDataTable;
