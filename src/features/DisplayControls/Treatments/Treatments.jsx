import React, { useEffect } from "react";
import {
  DataTable,
  TableCell,
  TableHead,
  TableHeader,
  TableBody,
  Table,
  TableRow,
  Link,
  DataTableSkeleton,
} from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { I18nProvider } from "../../i18n/I18nProvider";
import PropTypes from "prop-types";
import { getPrescribedAndActiveDrugOrders } from "./TreatmentsUtils";
import "./Treatments.scss";

const Treatments = (props) => {
  const { patientId } = props;
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const treatmentHeaders = [
    {
      header: "Start Date",
      key: "startDate",
      isSortable: true,
    },
    {
      header: "Drug Name",
      key: "drugName",
      isSortable: false,
    },
    {
      header: "Dosage Details",
      key: "dosageDetails",
      isSortable: false,
    },
    {
      header: "Prescribed By",
      key: "prescribedBy",
      isSortable: true,
    },
    {
      header: "Actions",
      key: "actions",
      isSortable: false,
    },
  ];

  const NoTreatmentsMessage = <FormattedMessage id={"NO_TREATMENTS_MESSAGE"} />;

  const AddToDrugChart = <FormattedMessage id={"ADD_TO_DRUG_CHART"} />;

  const isIPDDrugOrder = (drugOrder) => {
    return drugOrder.careSetting === "INPATIENT";
  };

  const setDosingInstructions = (drugOrder) => {
    return (
      drugOrder.dosingInstructions.dose +
      " " +
      drugOrder.dosingInstructions.doseUnits +
      " - " +
      drugOrder.dosingInstructions.route +
      " - " +
      drugOrder.dosingInstructions.frequency +
      " - for " +
      drugOrder.duration +
      " " +
      drugOrder.durationUnits
    );
  };

  const modifyTreatmentData = (drugOrders) => {
    const treatments = drugOrders.visitDrugOrders
      .filter((drugOrder) => isIPDDrugOrder(drugOrder))
      .map((drugOrder) => {
        return {
          id: drugOrder.uuid,
          startDate: new Date(
            drugOrder.effectiveStartDate
          ).toLocaleDateString(),
          drugName: drugOrder.drug.name,
          dosageDetails: setDosingInstructions(drugOrder),
          prescribedBy: drugOrder.provider.name,
          actions: <Link href="#">{AddToDrugChart}</Link>,
        };
      });
    setTreatments(treatments);
  };

  useEffect(() => {
    const getActiveDrugOrders = async () => {
      const drugOrders = await getPrescribedAndActiveDrugOrders(patientId);
      if (drugOrders.visitDrugOrders) {
        modifyTreatmentData(drugOrders);
        setIsLoading(false);
      }
    };

    getActiveDrugOrders();
  }, []);

  return (
    <I18nProvider>
      {isLoading ? (
        <DataTableSkeleton />
      ) : treatments && treatments.length === 0 ? (
        <div className="no-treatments">{NoTreatmentsMessage}</div>
      ) : (
        <DataTable rows={treatments} headers={treatmentHeaders}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()} useZebraStyles>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
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
      )}
    </I18nProvider>
  );
};

Treatments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Treatments;
