import React, { useState } from "react";
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
  Pagination,
} from "carbon-components-react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { abnormalHeader } from "../utils/VitalsUtils";

const BiometricsHistory = ({ biometricsHistory, biometricsHistoryHeaders }) => {
  const [biometricsHistoryPage, setBiometricsHistoryPage] = useState(1);
  const [biometricsHistoryPageSize, setBiometricsHistoryPageSize] =
    useState(10);
  const biometricsTitle = (
    <FormattedMessage id={"BIOMETRICS_TITLE"} defaultMessage={"Biometrics"} />
  );

  const changeBiometricsPaginationState = (pageInfo) => {
    if (biometricsHistoryPage != pageInfo.page) {
      setBiometricsHistoryPage(pageInfo.page);
    }
    if (biometricsHistoryPageSize != pageInfo.pageSize) {
      setBiometricsHistoryPageSize(pageInfo.pageSize);
    }
  };

  return (
    <>
      <div className="biometrics-history-title">{biometricsTitle}</div>
      <DataTable
        rows={biometricsHistory}
        headers={biometricsHistoryHeaders}
        useZebraStyles={true}
      >
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table
            {...getTableProps()}
            useZebraStyles
            data-testid="biometrics-datatable"
            className = "history-data-table"
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
                  {row.cells.map((cell) => {
                    if ( abnormalHeader.includes(cell.info.header))
                     return <TableCell className={ cell.value.abnormal ? "history-abnormal-tile" : "history-tile"} key={cell.id}>{cell.value.value}</TableCell>
                    else
                    return <TableCell key={cell.id}>{cell.value}</TableCell>
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTable>
      <Pagination
        className="biometrics-history-pagination"
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={changeBiometricsPaginationState}
        page={biometricsHistoryPage}
        pageSize={biometricsHistoryPageSize}
        pageSizes={[10, 20]}
        size="md"
        totalItems={biometricsHistory.length}
      />
    </>
  );
};

export default BiometricsHistory;

BiometricsHistory.propTypes = {
  biometricsHistory: PropTypes.array.isRequired,
  biometricsHistoryHeaders: PropTypes.array.isRequired,
};
