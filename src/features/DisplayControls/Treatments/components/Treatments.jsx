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
  AddToDrugChart,
  EditDrugChart,
  NoTreatmentsMessage,
  isIPDDrugOrder,
  setDosingInstructions,
  getDrugName,
  modifyEmergencyTreatmentData,
  mapAdditionalDataForEmergencyTreatments,
} from "../utils/TreatmentsUtils";
import { defaultDateTimeFormat } from "../../../../constants";
import "../styles/Treatments.scss";
import DrugChartSlider from "../../../DrugChartSlider/components/DrugChartSlider";
import { SliderContext } from "../../../../context/SliderContext";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { componentKeys } from "../../../../constants";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";
import TreatmentExpandableRow from "./TreatmentExpandableRow";
import Notification from "../../../../components/Notification/Notification";

const Treatments = (props) => {
  const { patientId } = props;
  const {
    isSliderOpen,
    updateSliderOpen,
    sliderContentModified,
    setSliderContentModified,
    visitUuid,
    visitSummary,
  } = useContext(SliderContext);
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrugOrder, setSelectedDrugOrder] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [drugChartNotes, setDrugChartNotes] = useState("");
  const [additionalData, setAdditionalData] = useState([]);
  const [showEditMessage, setShowEditMessage] = useState(false);
  const updateTreatmentsSlider = (value) => {
    updateSliderOpen((prev) => {
      return {
        ...prev,
        treatments: value,
      };
    });
  };
  let drugOrderList = {};
  const isAddToDrugChartDisabled =
    visitSummary.admissionDetails === null ? true : false;
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
    },
  };

  const handleEditAndAddToDrugChartClick = (
    drugOrderId,
    isEditDisabled,
    showEditDrugChartLink
  ) => {
    if (isEditDisabled || isAddToDrugChartDisabled) {
      updateSliderOpen((prev) => {
        return {
          ...prev,
          treatments: false,
        };
      });
      return;
    }

    if (showEditDrugChartLink) {
      setShowEditMessage(true);
    }

    setSliderContentModified((prevState) => ({
      ...prevState,
      treatments: false,
    }));
    setSelectedDrugOrder((prevState) => ({
      ...prevState,
      drugOrder: drugOrderList.find(
        (drugOrderObject) => drugOrderObject.drugOrder.uuid === drugOrderId
      ),
    }));
    if (isSliderOpen.treatments) {
      return;
    }
    updateTreatmentsSlider(true);
    setDrugChartNotes("");
  };


  const modifyPrescribedTreatmentData = (drugOrders) => {
    const treatments = drugOrders
      .filter((drugOrderObject) => isIPDDrugOrder(drugOrderObject))
      .map((drugOrderObject) => {
        let isEditDisabled;
        let showEditDrugChartLink;
        if (drugOrderObject.drugOrderSchedule != null) {
          showEditDrugChartLink = true;
          isEditDisabled = drugOrderObject.drugOrderSchedule
            .medicationAdministrationStarted
            ? true
            : false;
        } else {
          showEditDrugChartLink = false;
        }
        const drugOrder = drugOrderObject.drugOrder;
        return {
          id: drugOrder.uuid,
          startDate: formatDate(drugOrder.effectiveStartDate),
          drugName: getDrugName(drugOrderObject),
          dosageDetails: setDosingInstructions(drugOrder),
          providerName: drugOrderObject.provider.name,
          status: (
            <span className={drugOrder.dateStopped && "red-text"}>
              {drugOrder.dateStopped && (
                <FormattedMessage id="STOPPED" defaultMessage="Stopped" />
              )}
            </span>
          ),
          actions:
            !drugOrder.dateStopped &&
            (!showEditDrugChartLink ? (
              <Link
                disabled={isAddToDrugChartDisabled}
                onClick={() =>
                  handleEditAndAddToDrugChartClick(
                    drugOrder.uuid,
                    isEditDisabled,
                    showEditDrugChartLink
                  )
                }
              >
                {AddToDrugChart}
              </Link>
            ) : (
              <Link
                disabled={isEditDisabled || isAddToDrugChartDisabled}
                onClick={() =>
                  handleEditAndAddToDrugChartClick(
                    drugOrder.uuid,
                    isEditDisabled,
                    showEditDrugChartLink
                  )
                }
              >
                {EditDrugChart}
              </Link>
            )),
          additionalData: {
            instructions: drugOrderObject.instructions
              ? drugOrderObject.instructions
              : "",
            additionalInstructions: drugOrderObject.additionalInstructions
              ? drugOrderObject.additionalInstructions
              : "",
            recordedDateTime: formatDate(drugOrder.dateActivated, defaultDateTimeFormat),
            startTimeForSort: drugOrder.effectiveStartDate
          },
        };
      });

    const additionalMappedData = treatments.map((treatment) => {
      return {
        id: treatment.id,
        instructions: treatment.additionalData.instructions,
        additionalInstructions: treatment.additionalData.additionalInstructions,
        recordedDateTime: treatment.additionalData.recordedDateTime,
        provider: treatment.providerName,
      };
    });
    setAdditionalData(additionalMappedData);
    return treatments;
  };

  useEffect(() => {
    const getActiveDrugOrdersAndTreatmentConfig = async () => {
      const allMedicationsList = await getAllDrugOrders(visitUuid);
      let allTreatments = [];
      if (allMedicationsList.ipdDrugOrders.length > 0) {
        drugOrderList = updateDrugOrderList(allMedicationsList.ipdDrugOrders);
        allTreatments = [...modifyPrescribedTreatmentData(drugOrderList)];
      }
      if (allMedicationsList.emergencyMedications && allMedicationsList.emergencyMedications.length > 0) {
        const emergencyTreatments = modifyEmergencyTreatmentData(allMedicationsList.emergencyMedications);
        allTreatments = [...allTreatments, ...emergencyTreatments];
        setAdditionalData(prevData => [...prevData, ...mapAdditionalDataForEmergencyTreatments(emergencyTreatments)]);
      }
      allTreatments.sort((a, b) => a.additionalData.startTimeForSort - b.additionalData.startTimeForSort);
      setTreatments(allTreatments);
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
            messageId: showEditMessage
              ? "DRUG_CHART_MODAL_EDIT_MESSAGE"
              : "DRUG_CHART_MODAL_SAVE_MESSAGE",
          }}
          hostApi={{
            onClose: () => {
              setShowSuccessNotification(false);
              refreshDisplayControl([
                componentKeys.NURSING_TASKS,
                componentKeys.DRUG_CHART,
                componentKeys.TREATMENTS,
              ]);
            },
          }}
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