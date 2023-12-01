import React, { useEffect, useContext } from "react";
import { Link, DataTableSkeleton } from "carbon-components-react";
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
import DrugChartSlider from "../../../DrugChartSlider/components/DrugChartSlider";
import DrugChartSliderNotification from "../../../DrugChartSlider/components/DrugChartSliderNotification";
import { SliderContext } from "../../../../context/SliderContext";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { componentKeys } from "../../../../constants";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";
import TreatmentExpandableRow from "./TreatmentExpandableRow";

const Treatments = (props) => {
  const { patientId } = props;
  const {
    isSliderOpen,
    updateSliderOpen,
    sliderContentModified,
    setSliderContentModified,
  } = useContext(SliderContext);
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrugOrder, setSelectedDrugOrder] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [drugChartNotes, setDrugChartNotes] = useState("");
  const [additionalData, setAdditionalData] = useState([]);
  const updateTreatmentsSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        treatments: value,
      };
    });
  };
  var drugOrderList = {};
  const sliderCloseActions = {
    onCancel: () => {
      setShowWarningNotification(false);
      updateTreatmentsSlider(false);
    },
    onClose: () => {
      setShowWarningNotification(false);
    },
  };

  const DrugChartSliderActions = {
    onModalClose: () => {
      sliderContentModified.treatments
        ? setShowWarningNotification(true)
        : updateTreatmentsSlider(false);
    },
    onModalCancel: () => {
      sliderContentModified.treatments
        ? setShowWarningNotification(true)
        : updateTreatmentsSlider(false);
    },
    onModalSave: () => {
      setShowSuccessNotification(true);
      updateTreatmentsSlider(false);
      refreshDisplayControl([componentKeys.NURSING_TASKS]);
    },
  };

  const NoTreatmentsMessage = (
    <FormattedMessage
      id={"NO_TREATMENTS_MESSAGE"}
      defaultMessage={"No IPD Medication is prescribed for this patient yet"}
    />
  );

  const handleAddToDrugChartClick = (drugOrderId) => {
    setSliderContentModified((prevState) => ({
      ...prevState,
      treatments: false,
    }));
    setSelectedDrugOrder((prevState) => ({
      ...prevState,
      drugOrder: drugOrderList.visitDrugOrders.find(
        (drugOrder) => drugOrder.uuid === drugOrderId
      ),
    }));
    if (isSliderOpen.treatments) {
      return;
    }
    updateTreatmentsSlider(true);
    setDrugChartNotes("");
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
      .filter((drugOrder) => drugOrder.dateStopped === null)
      .map((drugOrder) => {
        return {
          id: drugOrder.uuid,
          startDate: formatDate(drugOrder.effectiveStartDate, "DD/MM/YYYY"),
          drugName: drugOrder.drug.name,
          dosageDetails: setDosingInstructions(drugOrder),
          prescribedBy: drugOrder.provider.name,
          actions: (
            <Link onClick={() => handleAddToDrugChartClick(drugOrder.uuid)}>
              {AddToDrugChart}
            </Link>
          ),
          additionalData: {
            instructions: drugOrder.instructions ? drugOrder.instructions : "",
            additionalInstructions: drugOrder.additionalInstructions
              ? drugOrder.additionalInstructions
              : "",
            recordedDate: formatDate(drugOrder.dateActivated, "DD/MM/YYYY"),
            recordedTime: formatDate(drugOrder.dateActivated, "HH:mm"),
          },
        };
      });

    const additionalMappedData = treatments.map((treatment) => {
      return {
        id: treatment.id,
        instructions: treatment.additionalData.instructions,
        additionalInstructions: treatment.additionalData.additionalInstructions,
        recordedDate: treatment.additionalData.recordedDate,
        recordedTime: treatment.additionalData.recordedTime,
        provider: treatment.prescribedBy,
      };
    });
    setTreatments(treatments);
    setAdditionalData(additionalMappedData);
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
      {isSliderOpen.treatments && (
        <DrugChartSlider
          title={AddToDrugChart}
          hostData={selectedDrugOrder}
          hostApi={DrugChartSliderActions}
          setDrugChartNotes={setDrugChartNotes}
          drugChartNotes={drugChartNotes}
        />
      )}
      {showWarningNotification && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage
              id="TREATMENTS_WARNING_TEXT"
              defaultMessage="You will lose the details entered. Do you want to continue?"
            />
          }
          label={""}
          primaryButtonText={<FormattedMessage id="NO" defaultMessage="No" />}
          secondaryButtonText={
            <FormattedMessage id="YES" defaultMessage="Yes" />
          }
          onSubmit={sliderCloseActions.onClose}
          onSecondarySubmit={sliderCloseActions.onCancel}
          onClose={sliderCloseActions.onClose}
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
        <ExpandableDataTable
          rows={treatments}
          headers={treatmentHeaders}
          additionalData={additionalData}
          component={(additionalData) => {
            return <TreatmentExpandableRow data={additionalData} />;
          }}
          useZebraStyles={true}
        />
      )}
    </>
  );
};

Treatments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Treatments;
