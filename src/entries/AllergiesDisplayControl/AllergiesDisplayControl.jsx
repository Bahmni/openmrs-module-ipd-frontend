import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";
import React, { useEffect, useState } from "react";
import { useFetchAllergiesIntolerance } from "../../hooks/useFetchAllergiesIntolerance";
import PropTypes from "prop-types";
import "./AllergiesDisplayControl.scss";

export const AllergiesDisplayControl = (props) => {
  const { hostData } = props;

  const { allergiesData, isLoading } = useFetchAllergiesIntolerance(
    hostData?.patientId
  );
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (allergiesData && allergiesData.entry) {
      const allergies = [];
      allergiesData.entry?.map((allergy) => {
        allergies.push({
          allergen: allergy.resource.code.coding[0].display,
          id: allergy.resource.id,
          severity: getSeverity(allergy.resource.criticality),
          reaction: getAllergyReactions(allergy.resource.reaction),
          comments: getComments(allergy.resource.note),
          sortWeight: getSortingWait(getSeverity(allergy.resource.criticality)),
        });
      });
      setRows(sortedRow(allergies));
    }
  }, [allergiesData]);

  const getSortingWait = (severity) => {
    if (severity === "High") return -1;
    if (severity === "Mild") return 0;
    return 1;
  };

  const getSeverity = (criticality) => {
    if (criticality == "unable-to-assess") return "Mild";
    return criticality.charAt(0).toUpperCase() + criticality.slice(1);
  };

  const getComments = (notes) =>
    notes && notes.length > 0 ? notes[0].text : "";

  const getAllergyReactions = (reactions) => {
    let allergyReactions = "";
    if (reactions && reactions.length > 0) {
      reactions[0].manifestation.map((reaction) => {
        allergyReactions =
          allergyReactions != ""
            ? `${allergyReactions}, ${reaction.coding[0].display}`
            : `${reaction.coding[0].display}`;
      });
    }
    return allergyReactions;
  };

  const headers = [
    {
      key: "allergen",
      header: "Allergen",
    },
    {
      key: "severity",
      header: "Severity",
    },
    {
      key: "reaction",
      header: "Reaction",
    },
    {
      key: "comments",
      header: "Comments",
    },
  ];

  const sortedRow = (rows) => {
    const sortedRows = rows
      .sort((a, b) => {
        if (a === b) return 0;
        return a.allergen > b.allergen ? 1 : -1;
      })
      .sort((a, b) => a.sortWeight - b.sortWeight);
    return sortedRows;
  };

  if (isLoading)
    return (
      <DataTableSkeleton
        data-testid="datatable-skeleton"
        headers={headers}
        aria-label="sample table"
        zebra="true"
      />
    );

  return (
    <DataTable
      rows={rows}
      headers={headers}
      useZebraStyles={true}
      data-testid="datatable"
    >
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableHeader
                  key={index + header.key}
                  {...getHeaderProps({ header })}
                  isSortable={header.key === "severity"}
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
                  <TableCell
                    key={cell.id}
                    className={
                      cell.id.includes("severity") && cell.value == "High"
                        ? "high-severity-color"
                        : ""
                    }
                  >
                    {cell.value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
};

AllergiesDisplayControl.propTypes = {
  hostData: PropTypes.shape({
    patientId: PropTypes.string,
  }).isRequired,
};
