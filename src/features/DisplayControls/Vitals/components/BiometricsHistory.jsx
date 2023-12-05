import React from 'react'
import { DataTable, Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from 'carbon-components-react';
import PropTypes from 'prop-types';

const BiometricsHistory = ({biometricsHistory, biometricsHistoryHeaders}) => {
  return (
    <>
    <DataTable
          rows= {biometricsHistory}
          headers={biometricsHistoryHeaders}
          useZebraStyles={true} >
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
    </>
  )
}

export default BiometricsHistory

BiometricsHistory.propTypes = {
    biometricsHistory: PropTypes.array.isRequired,
    biometricsHistoryHeaders: PropTypes.array.isRequired
    };