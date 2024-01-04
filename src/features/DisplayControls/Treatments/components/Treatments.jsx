import React, { useEffect, useContext } from "react";
import { Link, DataTableSkeleton } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  getAllDrugOrders,
  treatmentHeaders,
  getConfigsForTreatments,
  updateDrugOrderList,
} from "../utils/TreatmentsUtils";
import "../styles/Treatments.scss";
import DrugChartSlider from "../../../DrugChartSlider/components/DrugChartSlider";
import { SliderContext } from "../../../../context/SliderContext";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { componentKeys } from "../../../../constants";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";
import TreatmentExpandableRow from "./TreatmentExpandableRow";
import NotesIcon from "../../../../icons/notes.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import Notification from "../../../../components/Notification/Notification";

const Treatments = (props) => {
  const { patientId } = props;
  const {
    isSliderOpen,
    updateSliderOpen,
    sliderContentModified,
    setSliderContentModified,
    visitUuid,
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
      refreshDisplayControl([componentKeys.DRUG_CHART]);
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
      drugOrder: drugOrderList.ipdDrugOrders.find(
        (drugOrderObject) => drugOrderObject.drugOrder.uuid === drugOrderId
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

  const isIPDDrugOrder = (drugOrderObject) => {
    return drugOrderObject.drugOrder.careSetting === "INPATIENT";
  };

  const setDosingInstructions = (drugOrder) => {
    return (
      <div className={drugOrder.dateStopped && "strike-through"}>
        {drugOrder.dosingInstructions.dose +
          " " +
          drugOrder.dosingInstructions.doseUnits +
          " - " +
          drugOrder.dosingInstructions.route +
          " - " +
          drugOrder.dosingInstructions.frequency +
          " - for " +
          drugOrder.duration +
          " " +
          drugOrder.durationUnits}
      </div>
    );
  };

  const modifyTreatmentData = (drugOrders) => {
    console.log("ipdDrugOrders in modifyTreatmentData", drugOrders);
    const treatments = drugOrders.ipdDrugOrders
      .filter((drugOrderObject) => isIPDDrugOrder(drugOrderObject))
      .map((drugOrderObject) => {
        const drugOrder = drugOrderObject.drugOrder;
        return {
          id: drugOrder.uuid,
          startDate: formatDate(drugOrder.effectiveStartDate, "DD/MM/YYYY"),
          drugName: getDrugName(drugOrderObject),
          dosageDetails: setDosingInstructions(drugOrder),
          providerName: drugOrder?.provider?.name,
          status: (
            <span className={drugOrder.dateStopped && "red-text"}>
              {drugOrder.dateStopped && (
                <FormattedMessage id="STOPPED" defaultMessage="Stopped" />
              )}
            </span>
          ),
          actions: !drugOrder.dateStopped && (
            <Link onClick={() => handleAddToDrugChartClick(drugOrder.uuid)}>
              {AddToDrugChart}
            </Link>
          ),
          additionalData: {
            instructions: drugOrderObject.instructions
              ? drugOrderObject.instructions
              : "",
            additionalInstructions: drugOrderObject.additionalInstructions
              ? drugOrderObject.additionalInstructions
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
        provider: treatment.providerName,
      };
    });
    setTreatments(treatments);
    setAdditionalData(additionalMappedData);
  };
  const getDrugName = (drugOrderObject) => {
    const drugOrder = drugOrderObject.drugOrder;
    if (
      drugOrder.drug &&
      (drugOrderObject.instructions || drugOrderObject.additionalInstructions)
    ) {
      return (
        <div className="notes-icon-div">
          <NotesIcon className="notes-icon" />
          <span
            className={`treatments-drug-name ${
              drugOrder.dateStopped && "strike-through"
            }`}
          >
            {drugOrder.drug.name}
            <span>
              <DisplayTags drugOrder={drugOrder.dosingInstructions} />
            </span>
          </span>
        </div>
      );
    } else if (drugOrder.drug) return drugOrder.drug.name;
    return drugOrder.freeTextAnswer;
  };

  useEffect(() => {
    const getActiveDrugOrdersAndTreatmentConfig = async () => {
      drugOrderList = await getAllDrugOrders(visitUuid);
      if (drugOrderList.ipdDrugOrders.length > 0) {
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
        <Notification
          hostData={{
            notificationKind: "success",
            messageId: "DRUG_CHART_MODAL_SAVE_MESSAGE",
          }}
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
