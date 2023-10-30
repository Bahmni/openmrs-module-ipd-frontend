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
import { useFetchAllergiesIntolerance } from "../hooks/useFetchAllergiesIntolerance";
import PropTypes from "prop-types";
import "../styles/Allergies.scss";
import { FormattedMessage } from "react-intl";

const Allergies = (props) => {
  const { patientId } = props;

  const { allergiesData, isLoading } = useFetchAllergiesIntolerance(patientId);
  const [rows, setRows] = useState([]);
  const NoAllergenMessage = (
    <FormattedMessage
      id={"NO_ALLERGENS_MESSAGE"}
      defaultMessage={"No Allergen is captured for this patient yet."}
    />
  );

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
    if (severity === "Severe") return -1;
    if (severity === "Moderate") return 0;
    return 1;
  };

  const getSeverity = (criticality) => {
    if (criticality == "unable-to-assess") return "Moderate";
    else if (criticality == "high") return "Severe";
    else return "Mild";
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

  return allergiesData.entry === undefined ? (
    <div className="no-allergen-message"> {NoAllergenMessage} </div>
  ) : (
    <DataTable
      rows={rows}
      headers={headers}
      useZebraStyles={true}
      data-testid="datatable"
    >
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()} useZebraStyles>
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
                      cell.id.includes("severity") && cell.value == "Severe"
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

Allergies.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Allergies;
