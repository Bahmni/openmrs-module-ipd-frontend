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
import "./AllergiesDisplayControl.scss";

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
          sortWeight: getSortingWait(getSeverity(allergy.resource.criticality)),
        });
      });
      setRows(sortedRow(allergies));
    }
  }, [allergiesData]);

  console.log("sortedRow", rows);

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

  if (isLoading) <div>Loading...</div>;

  //   const groupById = (acc, item) => {
  //     const id = item.severity;
  //     if(id in acc){
  //       acc[id].push(item);
  //     }else{
  //       acc[id] = [item];
  //     }
  //     return acc;
  //   };

  //   const sortByWait = (a,b) => a.sortWeight - b.sortWeight;
  // const sortByAllergen = (a,b) => a[0].allergen === b[0].allergen? 0 : a[0].allergen > b[0].allergen ? 1 : -1;

  const sortedRow = (rows) => {
    //  const groups = Object.values(rows.reduce(groupById, {}))
    // .map(group => group.sort(sortByWait))
    // .sort(sortByAllergen);
    // console.log('groups', groups)
    const temp = rows
      .sort((a, b) => {
        if (a === b) return 0;
        return a.allergen > b.allergen ? 1 : -1;
      })
      .sort((a, b) => a.sortWeight - b.sortWeight);

    console.log("temp", temp);
    return temp;

    // return temp.sort((a, b) => {
    //   if (a === b) return 0;
    //   console.log("first", a.allergen, b.allergen, a.allergen > b.allergen);
    //   return a.allergen > b.allergen ? 1 : -1;
    // });
  };

  // function customSortRow(cellA, cellB, { sortDirection, sortStates, locale }) {
  //   if (sortDirection === sortStates.DESC) {
  //     return compare(cellB, cellA, locale);
  //   }

  //   return compare(cellA, cellB, locale);
  // }

  // const compare = (firstCell, secondCell, locale) => {
  //   console.log('firstCell', firstCell, secondCell, firstCell > secondCell)
  //   if (firstCell === secondCell) return 0;
  //   return firstCell < secondCell ? 1 : -1;
  // };

  return (
    <>
      <div>Allergies</div>
      <DataTable
        rows={rows}
        headers={headers}
        useZebraStyles={true}
        // sortRow={customSortRow}
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
                <TableRow key={index + row.id} {...getRowProps({ row })}>
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
    </>
  );
};

AllergiesDisplayControl.propTypes = {
  hostData: PropTypes.shape({
    patientId: PropTypes.string,
  }).isRequired,
};
