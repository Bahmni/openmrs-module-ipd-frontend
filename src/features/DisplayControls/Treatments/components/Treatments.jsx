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
} from "../utils/TreatmentsUtils";
import { requesterFunction, verifierFunction } from "../../../../constants";
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
import NotesIcon from "../../../../icons/notes.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";

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
          startDate: formatDate(drugOrder.effectiveStartDate, "DD/MM/YYYY"),
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
            recordedDate: formatDate(drugOrder.dateActivated, "DD/MM/YYYY"),
            recordedTime: formatDate(drugOrder.dateActivated, "HH:mm"),
            startTimeForSort: drugOrder.effectiveStartDate
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

  const modifyEmergencyTreatmentData = (emergencyMedications) => {
    const emergencyTreatments = emergencyMedications
      .map((medicationAdministration) => {
        const dosingInstructions = { emergency: true };
        const approver = medicationAdministration.providers.find(provider => provider.function === requesterFunction || provider.function === verifierFunction);
        const approverNotes = medicationAdministration.notes.find(notes => notes.author.uuid === approver?.provider.uuid);
        const approverName = approver?.provider.display.includes(" - ") ? approver?.provider.display.split(" - ")[1]: approver?.provider.display;
        return {
          id: medicationAdministration.uuid,
          startDate: formatDate(medicationAdministration.administeredDateTime, "DD/MM/YYYY"),
          drugName: <div className="notes-icon-div">
              {approverNotes && <NotesIcon className="notes-icon" />}
              <span className={`treatments-drug-name`} >
                {medicationAdministration.drug.display}
                <span>
                    <DisplayTags drugOrder={dosingInstructions} />
                </span>
              </span>
            </div>,
          dosageDetails: <div>{medicationAdministration.dose + " " +
              medicationAdministration.doseUnits?.display + " - " + medicationAdministration.route?.display}
            </div>,
          providerName: approverName,
          status: (
            <span>
              {approver.function === requesterFunction && (
                <FormattedMessage id="AWAITING" defaultMessage="Not acknowledged" />
              )}
              {approver.function === verifierFunction && (
                <FormattedMessage id="CONFIRMED" defaultMessage="Acknowledged" />
              )}
            </span>
          ),
          actions: null,
          additionalData: {
            approverName: approver?.function === verifierFunction ? approverName : null,
            approverNotes: approverNotes,
            startTimeForSort: medicationAdministration.administeredDateTime
          },
        };
      });
    const additionalMappedData = emergencyTreatments.map((treatment) => {
      return {
        id: treatment.id,
        approverNotes: treatment.additionalData.approverName ? treatment.additionalData.approverNotes?.text : null,
        approverAdditionalData: treatment.additionalData.approverName
        + " | " + formatDate(treatment.additionalData.approverNotes?.recordedTime, "DD/MM/YYYY")
        + " | " + formatDate(treatment.additionalData.approverNotes?.recordedTime, "HH:mm")
      };
    });
    setTreatments(prevtreatments => [...prevtreatments, ...emergencyTreatments]);
    setAdditionalData(prevData => [...prevData, ...additionalMappedData]);
  };

  useEffect(() => {
    const getActiveDrugOrdersAndTreatmentConfig = async () => {
      const allMedicationsList = await getAllDrugOrders(visitUuid);
      if (allMedicationsList.ipdDrugOrders.length > 0) {
        drugOrderList = updateDrugOrderList(allMedicationsList.ipdDrugOrders);
        modifyPrescribedTreatmentData(drugOrderList);
      }
      if (allMedicationsList.emergencyMedications && allMedicationsList.emergencyMedications.length > 0) {
        modifyEmergencyTreatmentData(allMedicationsList.emergencyMedications);
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
          rows={treatments.sort((a, b) => a.additionalData.startTimeForSort - b.additionalData.startTimeForSort)}
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