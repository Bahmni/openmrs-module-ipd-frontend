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
import { getPrescribedAndActiveDrugOrders } from "./TreatmentsUtils";

const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const patientUuid = "d22c5c6b-278f-47cc-91b0-92087c712519";

  const NoTreatmentsMessage = <FormattedMessage id={"NO_TREATMENTS_MESSAGE"} />;

  const AddToDrugChart = <FormattedMessage id={"ADD_TO_DRUG_CHART"} />;

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

  const isIPDDrugOrder = (drugOrder) => {
    return drugOrder.careSetting === "INPATIENT";
  };

  const modifyTreatmentData = (drugOrders) => {
    const treatments = drugOrders.visitDrugOrders
      .filter((drugOrder) => isIPDDrugOrder(drugOrder))
      .map((drugOrder) => {
        const treatment = {};
        treatment.id = drugOrder.uuid;
        treatment.startDate = new Date(
          drugOrder.effectiveStartDate
        ).toLocaleDateString();
        treatment.drugName = drugOrder.drug.name;
        const dosingInstructions =
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
          drugOrder.durationUnits;
        treatment.dosageDetails = dosingInstructions;
        treatment.prescribedBy = drugOrder.provider.name;
        treatment.actions = isIPDDrugOrder(drugOrder) ? (
          <Link href="#">{AddToDrugChart}</Link>
        ) : null;
        return treatment;
      });
    setTreatments(treatments);
  };

  useEffect(() => {
    const getActiveDrugOrders = async () => {
      const drugOrders = await getPrescribedAndActiveDrugOrders(patientUuid);
      modifyTreatmentData(drugOrders);
    };

    setIsLoading(true);
    getActiveDrugOrders();
    setIsLoading(false);
  }, []);

  return (
    <I18nProvider>
      {isLoading ? (
        <DataTableSkeleton />
      ) : treatments && treatments.length === 0 ? (
        <div>{NoTreatmentsMessage}</div>
      ) : (
        <DataTable rows={treatments} headers={treatmentHeaders}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <Table {...getTableProps()}>
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

export default Treatments;
