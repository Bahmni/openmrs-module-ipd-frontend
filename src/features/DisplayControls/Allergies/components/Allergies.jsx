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
import React, { useContext, useEffect, useState } from "react";
import { useFetchAllergiesIntolerance } from "../hooks/useFetchAllergiesIntolerance";
import PropTypes from "prop-types";
import "../styles/Allergies.scss";
import { FormattedMessage } from "react-intl";
import {
  dateTimeToEpochInMilliSeconds,
  formatDate,
} from "../../../../utils/DateTimeUtils";
import { IPDContext } from "../../../../context/IPDContext";
import { getNoKnownAllergyUuid } from "../utils/AllergiesUtils";

const Allergies = (props) => {
  const { patientId } = props;
  const { visitSummary } = useContext(IPDContext);
  const { allergiesData, isLoading } = useFetchAllergiesIntolerance(patientId);
  const [rows, setRows] = useState([]);
  const [noKnownAllergyUuid, setNoKnownAllergyUuid] = useState(undefined);
  const NoAllergenMessage = (
    <FormattedMessage
      id={"NO_ALLERGENS_MESSAGE"}
      defaultMessage={"No Allergen is captured for this patient yet."}
    />
  );

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const code = await getNoKnownAllergyUuid();
        setNoKnownAllergyUuid(code);
      } catch (error) {
        console.error("Failed to fetch no known allergy code:", error);
      }
    };
    fetchCode();
  }, []);

  useEffect(() => {
    if (allergiesData && allergiesData.entry) {
      const allergies = [];
      allergiesData.entry?.map((allergy) => {
        const recordedDate = dateTimeToEpochInMilliSeconds(
          allergy?.resource?.recordedDate
        );
        const allergyData = {
          allergen: allergy.resource.code?.coding[0]?.display,
          allergenCode: allergy.resource.code?.coding[0]?.code,
          id: allergy.resource.id,
          severity: getSeverity(allergy.resource.criticality),
          reaction: getAllergyReactions(allergy.resource.reaction),
          comments: getComments(allergy.resource.note),
          sortWeight: getSortingWait(getSeverity(allergy.resource.criticality)),
          provider: allergy.resource.recorder.display,
          date: formatDate(recordedDate),
        };

        if (
          visitSummary.stopDateTime === null ||
          recordedDate < visitSummary.stopDateTime
        )
          allergies.push(allergyData);
      });
      setRows(sortedRow(allergies));
    }
  }, [allergiesData]);

  const getSortingWait = (severity) => {
    if (severity === "Severe") return -1;
    if (severity === "Moderate") return 0;
    if (severity === "Mild") return 1;
    return 2;
  };

  const getSeverity = (criticality) => {
    if (criticality === "unable-to-assess") return "Moderate";
    else if (criticality === "high") return "Severe";
    else if (criticality === "low") return "Mild";
    else return "";
  };

  const getComments = (notes) =>
    notes && notes.length > 0 ? notes[0].text : "";

  const getAllergyReactions = (reactions) => {
    let allergyReactions = "";
    if (reactions && reactions.length > 0) {
      reactions[0].manifestation?.forEach((reaction) => {
        allergyReactions =
          allergyReactions !== ""
            ? `${allergyReactions}, ${reaction.coding[0].display}`
            : `${reaction.coding[0].display}`;
      });
    }
    return allergyReactions;
  };

  const headers = [
    {
      key: "allergen",
      header: (
        <FormattedMessage
          id={"ALLERGEN_COLUMN_HEADER"}
          defaultMessage={`Allergen`}
        />
      ),
    },
    {
      key: "severity",
      header: (
        <FormattedMessage
          id={"SEVERITY_COLUMN_HEADER"}
          defaultMessage={`Severity`}
        />
      ),
    },
    {
      key: "reaction",
      header: (
        <FormattedMessage
          id={"REACTION_COLUMN_HEADER"}
          defaultMessage={`Reaction`}
        />
      ),
    },
    {
      key: "comments",
      header: (
        <FormattedMessage
          id={"COMMENTS_COLUMN_HEADER"}
          defaultMessage={`Comments`}
        />
      ),
    },
    {
      key: "provider",
      header: (
        <FormattedMessage
          id={"PROVIDER_COLUMN_HEADER"}
          defaultMessage={`Provider Name`}
        />
      ),
    },
    {
      key: "date",
      header: (
        <FormattedMessage id={"DATE_COLUMN_HEADER"} defaultMessage={`Date`} />
      ),
    },
  ];

  const sortedRow = (rows) =>
    rows
      .sort((a, b) => {
        if (a === b) return 0;
        return a.allergen > b.allergen ? 1 : -1;
      })
      .sort((a, b) => a.sortWeight - b.sortWeight);

  if (isLoading)
    return (
      <DataTableSkeleton
        data-testid="datatable-skeleton"
        headers={headers}
        aria-label="sample table"
      />
    );

  return allergiesData?.entry === undefined ? (
    <div className="no-allergen-message"> {NoAllergenMessage} </div>
  ) : (
    <DataTable rows={rows} headers={headers} useZebraStyles={true}>
      {({
        rows: dataTableRows,
        headers,
        getTableProps,
        getHeaderProps,
        getRowProps,
      }) => (
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
            {dataTableRows.map((row, index) => {
              const allergyRecord = rows[index];
              const isNoKnownAllergy =
                allergyRecord?.allergenCode === noKnownAllergyUuid;
              const shouldStrikethrough = rows.length > 1 && isNoKnownAllergy;
              return (
                <TableRow
                  key={index + row.id}
                  {...getRowProps({ row })}
                  data-testid="table-body-row"
                  className={
                    shouldStrikethrough
                      ? "no-known-allergy"
                      : "high-severity-color"
                  }
                >
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              );
            })}
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
