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
import {
  getPrescribedAndActiveDrugOrders,
  treatmentHeaders,
} from "./TreatmentsUtils";
import PropTypes from "prop-types";
import "./Treatments.scss";

const Treatments = ({ patientId }) => {
  console.log("patientUuid", patientId);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const patientUuid = patientId;
  //   "82260304-0a02-4c27-a879-e697c2180a7d";
  //   "d22c5c6b-278f-47cc-91b0-92087c712519";

  const NoIPDMedicationMessage = (
    <FormattedMessage id={"NO_IPD_MEDICATION_MESSAGE"} />
  );

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
        <div className="no-treatments">{NoIPDMedicationMessage}</div>
      ) : (
        <div className="treatments">
          <DataTable rows={treatments} headers={treatmentHeaders}>
            {({
              rows,
              headers,
              getTableProps,
              getHeaderProps,
              getRowProps,
            }) => (
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
        </div>
      )}
    </I18nProvider>
  );
};

Treatments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Treatments;
