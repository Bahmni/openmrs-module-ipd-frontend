import React, { useEffect, useContext } from "react";
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
import PropTypes from "prop-types";
import {
  getPrescribedAndActiveDrugOrders,
  treatmentHeaders,
  getConfigsForTreatments,
  updateDrugOrderList,
} from "../utils/TreatmentsUtils";
import "../styles/Treatments.scss";
import { formatDate } from "../../../../utils/DateFormatter";
import { dateFormat } from "../../../../constants";
import DrugChartSlider from "../../../../components/DrugChartSlider/DrugChartSlider";
import DrugChartSliderNotification from "../../../../components/DrugChartSlider/DrugChartSliderNotification";
import { SliderContext } from "../../../../context/SliderContext";

const Treatments = (props) => {
  const { patientId } = props;
  const { isSliderOpen, toggleSlider } = useContext(SliderContext);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDrugChartClicked, setOpenDrugChartClicked] = useState(false);
  const [selectedDrugOrder, setSelectedDrugOrder] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  var drugOrderList = {};
  const DrugChartSliderActions = {
    onModalClose: () => {
      setOpenDrugChartClicked(false);
      toggleSlider();
    },
    onModalCancel: () => {
      setOpenDrugChartClicked(false);
      setShowWarningNotification(true);
      toggleSlider();
    },
    onModalSave: () => {
      setOpenDrugChartClicked(false);
      setShowSuccessNotification(true);
      toggleSlider();
    },
  };

  const NoTreatmentsMessage = (
    <FormattedMessage
      id={"NO_TREATMENTS_MESSAGE"}
      defaultMessage={"No IPD Medication is prescribed for this patient yet"}
    />
  );

  const handleAddToDrugChartClick = (drugOrderId) => {
    setSelectedDrugOrder((prevState) => ({
      ...prevState,
      drugOrder: drugOrderList.visitDrugOrders.find(
        (drugOrder) => drugOrder.uuid === drugOrderId
      ),
    }));
    if (openDrugChartClicked && isSliderOpen) {
      return;
    }
    setOpenDrugChartClicked(true);
    toggleSlider();
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
          actions: (
            <Link onClick={() => handleAddToDrugChartClick(drugOrder.uuid)}>
              {AddToDrugChart}
            </Link>
          ),
        };
      });
    setTreatments(treatments);
  };

  useEffect(() => {
    const getActiveDrugOrdersAndTreatmentConfig = async () => {
      drugOrderList = await getPrescribedAndActiveDrugOrders(patientId);
      if (drugOrderList.visitDrugOrders.length > 0) {
        drugOrderList = updateDrugOrderList(drugOrderList);
        modifyTreatmentData(drugOrderList);
      }
    };

    const getTreatmentConfigs = async () => {
      const treatmentConfigs = await getConfigsForTreatments();
      setSelectedDrugOrder({
        patientId: patientId,
        scheduleFrequencies: treatmentConfigs.scheduleFrequencies,
        startTimeFrequencies: treatmentConfigs.startTimeFrequencies,
        enable24HourTimers: treatmentConfigs.enable24HourTimers,
        drugOrder: null,
      });
    };

    getActiveDrugOrdersAndTreatmentConfig().then(() => {
      getTreatmentConfigs().then(() => {
        setIsLoading(false);
      });
    });
  }, []);

  return (
    <>
      {isSliderOpen && (
        <DrugChartSlider
          title={AddToDrugChart}
          hostData={selectedDrugOrder}
          hostApi={DrugChartSliderActions}
        />
      )}
      {showWarningNotification && (
        <DrugChartSliderNotification
          hostData={{ notificationKind: "warning" }}
          hostApi={{ onClose: () => setShowWarningNotification(false) }}
        />
      )}
      {showSuccessNotification && (
        <DrugChartSliderNotification
          hostData={{ notificationKind: "success" }}
          hostApi={{ onClose: () => setShowSuccessNotification(false) }}
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
