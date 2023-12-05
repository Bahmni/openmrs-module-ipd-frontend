import React from 'react'
import { DataTable, Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from 'carbon-components-react';
import PropTypes from 'prop-types';

const VitalsHistory = ({vitalsHistory, vitalsHistoryHeaders}) => {
  return (
    <><DataTable
    rows= {vitalsHistory}
    headers={vitalsHistoryHeaders}
    useZebraStyles={true} >
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
</DataTable></>
  )
}

export default VitalsHistory

VitalsHistory.propTypes = {
    vitalsHistory: PropTypes.array.isRequired,
    vitalsHistoryHeaders: PropTypes.array.isRequired
    };