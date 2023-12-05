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

const VitalsHistory = ({ vitalsHistory, vitalsHistoryHeaders }) => {
  const [vitalsHistoryPage, setVitalsHistoryPage] = useState(1);
  const [vitalsHistoryPageSize, setVitalsHistoryPageSize] = useState(10);
  const vitalsTitle = (
    <FormattedMessage id={"VITALS_TITLE"} defaultMessage={"Vitals"} />
  );

  const changeVitalsPaginationState = (pageInfo) => {
    if (vitalsHistoryPage != pageInfo.page) {
      setVitalsHistoryPage(pageInfo.page);
    }
    if (vitalsHistoryPageSize != pageInfo.pageSize) {
      setVitalsHistoryPageSize(pageInfo.pageSize);
    }
  };

  return (
    <>
      <div className="vitals-history-title">{vitalsTitle}</div>
      <DataTable
        rows={vitalsHistory}
        headers={vitalsHistoryHeaders}
        useZebraStyles={true}
      >
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <Table
            {...getTableProps()}
            useZebraStyles
            data-testid="vitals-datatable"
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
        className="vitals-history-pagination"
        backwardText="Previous page"
        forwardText="Next page"
        itemsPerPageText="Items per page:"
        onChange={changeVitalsPaginationState}
        page={vitalsHistoryPage}
        pageSize={vitalsHistoryPageSize}
        pageSizes={[10, 20]}
        size="md"
        totalItems={vitalsHistory.length}
      />
    </>
  );
};

export default VitalsHistory;

VitalsHistory.propTypes = {
  vitalsHistory: PropTypes.array.isRequired,
  vitalsHistoryHeaders: PropTypes.array.isRequired,
};
