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
  Button,
} from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  getPrescribedAndActiveDrugOrders,
  treatmentHeaders,
  getConfigsForTreatments,
} from "../utils/TreatmentsUtils";
import "../styles/Treatments.scss";
import { formatDate } from "../../../../utils/DateFormatter";
import { dateFormat } from "../../../../constants";
import DrugChartSlider from "./DrugChartSlider/DrugChartSlider";

const Treatments = (props) => {
  const { patientId } = props;
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonClicked, setButtonClick] = useState(false);
  const [hostData, setHostData] = useState({});
  const [drugOrders, setDrugOrders] = useState([]);

  const NoTreatmentsMessage = (
    <FormattedMessage
      id={"NO_TREATMENTS_MESSAGE"}
      defaultMessage={"No IPD Medication is prescribed for this patient yet"}
    />
  );

  const handleAddToDrugChartClick = (drugOrderId) => {
    console.log("drugOrder", drugOrders);
    console.log("drugOrderId", drugOrderId);
    // const drugOrderObject = drugOrders.find(
    //   (drugOrder) => drugOrder.uuid === drugOrderId
    // );
    // setHostData(
    //   drugOrder= drugOrderObject
    //   );
    setButtonClick(true);
  };

  const AddToDrugChart = (
    <FormattedMessage
      id={"ADD_TO_DRUG_CHART"}
      defaultMessage={"Add to Drug Chart"}
    />
  );

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
          startDate: formatDate(
            new Date(drugOrder.effectiveStartDate),
            dateFormat
          ),
          drugName: drugOrder.drug.name,
          dosageDetails: setDosingInstructions(drugOrder),
          prescribedBy: drugOrder.provider.name,
          // actions: <Link href="#">{AddToDrugChart}</Link>,
          actions: (
            <Button
              as={Link}
              onClick={() => handleAddToDrugChartClick(drugOrder.uuid)}
            >
              {AddToDrugChart}
            </Button>
          ),
        };
      });
    setTreatments(treatments);
  };

  useEffect(() => {
    const getActiveDrugOrdersAndTreatmentConfig = async () => {
      const drugOrderList = await getPrescribedAndActiveDrugOrders(patientId);
      const treatmentsConfigList = await getConfigsForTreatments();

      console.log("treatmentsConfigList", treatmentsConfigList);

      if (drugOrderList.visitDrugOrders && treatmentsConfigList) {
        console.log("inside if for treatment config ");
        setDrugOrders(drugOrderList.visitDrugOrders);
        modifyTreatmentData(drugOrderList);
        setHostData({
          patientId: patientId,
          scheduleFrequencies: treatmentsConfigList.scheduleFrequencies,
          startTimeFrequencies: treatmentsConfigList.startTimeFrequencies,
          enable24HrTimeFormat: treatmentsConfigList.enable24HrTimeFormat,
          drugOrder: null,
        });
      }
      console.log("drugOrdersList", drugOrderList);
    };
    getActiveDrugOrdersAndTreatmentConfig();
    console.log("treatments", treatments);
  }, []);

  useEffect(() => {
    if (drugOrders.length > 0) {
      setIsLoading(false);
    }
  }, [drugOrders]);

  return (
    <>
      {buttonClicked && (
        <DrugChartSlider
          title="Add to drug chart"
          hostData={hostData}
          hostApi="api"
        />
      )}
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
    </>
  );
};

Treatments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Treatments;
