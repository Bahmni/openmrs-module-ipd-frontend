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

const BiometricsHistory = ({ biometricsHistory, biometricsHistoryHeaders }) => {
  const [biometricsHistoryPage, setBiometricsHistoryPage] = useState(1);
  const [biometricsHistoryPageSize, setBiometricsHistoryPageSize] =
    useState(10);

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
