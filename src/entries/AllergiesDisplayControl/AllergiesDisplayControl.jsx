import {
  DataTable,
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

export const AllergiesDisplayControl = (props) => {
  const { hostData } = props;

  const { allergiesData, isLoading } = useFetchAllergiesIntolerance(
    hostData?.patientId
  );
  const [rows, setRows] = useState([]);
  console.log("allergiesData", allergiesData);

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
        });
      });
      setRows(allergies);
    }
  }, [allergiesData]);

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

  if (isLoading) <div>Loading...</div>;

  return (
    <DataTable rows={rows} headers={headers} useZebraStyles={true}>
      {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableHeader
                  key={index + header.key}
                  {...getHeaderProps({ header })}
                >
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index + row.id} {...getRowProps({ row })}>
                {row.cells.map((cell) => (
                  <TableCell key={cell.id}>{cell.value}</TableCell>
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
