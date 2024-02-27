import React, { useEffect, useContext } from "react";
import { Link, DataTableSkeleton, TextArea } from "carbon-components-react";
import { Title } from "bahmni-carbon-ui";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  treatmentHeaders,
  getConfigsForTreatments,
  updateDrugOrderList,
  AddToDrugChart,
  AddToTasks,
  EditDrugChart,
  StopDrugChart,
  NoTreatmentsMessage,
  isIPDDrugOrder,
  setDosingInstructions,
  getDrugName,
  stopDrugOrders,
  getEncounterType,
  modifyEmergencyTreatmentData,
  mapAdditionalDataForEmergencyTreatments,
  isDrugOrderStoppedWithoutAdministration,
  getStopReason,
  getSlotsForAnOrderAndServiceType,
} from "../utils/TreatmentsUtils";
import { getCookies } from "../../../../utils/CommonUtils";
import { defaultDateTimeFormat, serviceType } from "../../../../constants";
import "../styles/Treatments.scss";
import DrugChartSlider from "../../../DrugChartSlider/components/DrugChartSlider";
import { SliderContext } from "../../../../context/SliderContext";
import { IPDContext } from "../../../../context/IPDContext";
import { formatDate } from "../../../../utils/DateTimeUtils";
import { componentKeys } from "../../../../constants";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import RefreshDisplayControl from "../../../../context/RefreshDisplayControl";
import ExpandableDataTable from "../../../../components/ExpandableDataTable/ExpandableDataTable";
import TreatmentExpandableRow from "./TreatmentExpandableRow";
import Notification from "../../../../components/Notification/Notification";
import { AllMedicationsContext } from "../../../../context/AllMedications";
import moment from "moment";

const Treatments = (props) => {
  const { patientId } = props;
  const {
    isSliderOpen,
    updateSliderOpen,
    sliderContentModified,
    setSliderContentModified,
    visitUuid,
    visitSummary,
    provider,
  } = useContext(SliderContext);
  const { config } = useContext(IPDContext);
  const { enable24HourTime = {} } = config;
  const refreshDisplayControl = useContext(RefreshDisplayControl);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDrugOrder, setSelectedDrugOrder] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [drugChartNotes, setDrugChartNotes] = useState("");
  const [additionalData, setAdditionalData] = useState([]);
  const [showEditMessage, setShowEditMessage] = useState(false);
  const allMedications = useContext(AllMedicationsContext);
  const { isReadMode } = useContext(IPDContext);
  const [showStopDrugChartModal, setShowStopDrugChartModal] = useState(false);
  const [stopReason, setStopReason] = useState("");
  const [isStopButtonDisabled, setStopButtonDisabled] = useState(true);
  const [stopDrugOrder, setStopDrugOrder] = useState({});
  const [showStopDrugSuccessNotification, setShowStopDrugSuccessNotification] =
    useState(false);
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
    isReadMode || visitSummary?.admissionDetails === null;
  const sliderCloseActions = {
    onCancel: () => {
      setShowWarningNotification(false);
      updateTreatmentsSlider(false);
    },
    onClose: () => {
      setShowWarningNotification(false);
    },
  };

  const stopDrugModalCloseActions = {
    onClose: () => {
      setShowStopDrugChartModal(false);
      setStopReason("");
      setStopButtonDisabled(true);
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
    showEditDrugChartLink,
    drugOrdernotes
  ) => {
    if (isAddToDrugChartDisabled) {
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
      setDrugChartNotes(drugOrdernotes);
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
    if (!showEditDrugChartLink) setDrugChartNotes("");
  };

  const handleStopDrugChartClick = (drugOrderId) => {
    const stoppedDrugOrder = drugOrderList.find(
      (drugOrderObject) => drugOrderObject.drugOrder.uuid === drugOrderId
    );

    setStopDrugOrder(() => {
      return {
        ...stoppedDrugOrder.drugOrder,
        drugOrder: stoppedDrugOrder.drugOrder,
        action: "DISCONTINUE",
        dateActivated: null,
        dateStopped: moment(),
        scheduledDate: moment(),
        previousOrderUuid: stoppedDrugOrder.drugOrder.uuid,
      };
    });
    setShowStopDrugChartModal(true);
  };

  const handleStopDrugChartModalSubmit = async () => {
    const cookies = getCookies();
    const { uuid: locationUuid } = JSON.parse(cookies["bahmni.user.location"]);
    const { uuid: encounterTypeUuid } = await getEncounterType("Consultation");

    const StopDrugOrderPayload = {
      drugOrders: [{ ...stopDrugOrder, orderReasonText: stopReason }],
      patientUuid: patientId,
      providers: [provider],
      visitType: "IPD",
      visitUuid: visitUuid,
      encounterTypeUuid: encounterTypeUuid,
      locationUuid,
    };

    const response = await stopDrugOrders(StopDrugOrderPayload);
    response.status === 200 ? saveStopDrugOrder() : null;
  };

  const saveStopDrugOrder = () => {
    setShowStopDrugChartModal(false);
    setShowStopDrugSuccessNotification(true);
  };

  const getActions = (
    showEditDrugChartLink,
    showStopDrugChartLink,
    drugOrder,
    drugOrderSchedule
  ) => {
    if (!showEditDrugChartLink && !showStopDrugChartLink) {
      return {
        link: (
          <Link
            disabled={isAddToDrugChartDisabled}
            onClick={() =>
              handleEditAndAddToDrugChartClick(
                drugOrder.uuid,
                showEditDrugChartLink,
                drugOrderSchedule?.notes
              )
            }
          >
            {!drugOrder.dosingInstructions?.asNeeded
              ? AddToDrugChart
              : AddToTasks}
          </Link>
        ),
        isScheduled: !drugOrder.dosingInstructions?.asNeeded ? false : true,
      };
    } else if (!showStopDrugChartLink) {
      return {
        link: (
          <Link
            disabled={isReadMode}
            onClick={() =>
              handleEditAndAddToDrugChartClick(
                drugOrder.uuid,
                showEditDrugChartLink,
                drugOrderSchedule?.notes
              )
            }
          >
            {EditDrugChart}
          </Link>
        ),
        isScheduled: true,
      };
    } else {
      return {
        link: drugOrderSchedule?.pendingSlotsAvailable && (
          <Link
            disabled={isReadMode}
            onClick={() => handleStopDrugChartClick(drugOrder.uuid)}
          >
            {StopDrugChart}
          </Link>
        ),
        isScheduled: true,
      };
    }
  };

  const modifyPrescribedTreatmentData = async (drugOrders) => {
    const prescribedTreatments = await Promise.all(
      drugOrders
        .filter((drugOrderObject) => isIPDDrugOrder(drugOrderObject))
        .filter(
          (drugOrderObject) =>
            !isDrugOrderStoppedWithoutAdministration(drugOrderObject)
        )
        .map(async (drugOrderObject) => {
          let showEditDrugChartLink;
          let showStopDrugChartLink;
          if (drugOrderObject.drugOrder.dosingInstructions.asNeeded) {
            const placeholderSlot = await getSlotsForAnOrderAndServiceType(
              patientId,
              drugOrderObject.drugOrder.uuid,
              serviceType.AS_NEEDED_PLACEHOLDER
            );
            if (placeholderSlot.length > 0) {
              showEditDrugChartLink = false;
              showStopDrugChartLink = true;
            }
          } else if (drugOrderObject.drugOrderSchedule != null) {
            showStopDrugChartLink = drugOrderObject.drugOrderSchedule
              .medicationAdministrationStarted
              ? true
              : false;
            showEditDrugChartLink = !showStopDrugChartLink;
          } else {
            showEditDrugChartLink = false;
          }

          const drugOrder = drugOrderObject.drugOrder;
          const actionsObjectValue =
            !drugOrder.dateStopped &&
            getActions(
              showEditDrugChartLink,
              showStopDrugChartLink,
              drugOrder,
              drugOrderObject.drugOrderSchedule
            );

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
            actions: actionsObjectValue.link,
            additionalData: {
              instructions: drugOrderObject.instructions
                ? drugOrderObject.instructions
                : "",
              additionalInstructions: drugOrderObject.additionalInstructions
                ? drugOrderObject.additionalInstructions
                : "",
              recordedDateTime: formatDate(
                drugOrder.dateActivated,
                defaultDateTimeFormat
              ),
              startTimeForSort: drugOrder.effectiveStartDate,
              stopReason: getStopReason(drugOrder),
              stopperAdditionalData:
                drugOrderObject.provider.name +
                " | " +
                formatDate(drugOrder.dateStopped, defaultDateTimeFormat),
              isScheduled: actionsObjectValue?.isScheduled,
            },
          };
        })
    );

    const additionalMappedData = prescribedTreatments.map((treatment) => {
      return {
        id: treatment.id,
        instructions: treatment.additionalData.instructions,
        additionalInstructions: treatment.additionalData.additionalInstructions,
        recordedDateTime: treatment.additionalData.recordedDateTime,
        provider: treatment.providerName,
        stopReason: treatment.additionalData.stopReason,
        stopperAdditionalData: treatment.additionalData.stopperAdditionalData,
        isNotScheduled: !(treatment.additionalData.isScheduled ?? true),
      };
    });
    setAdditionalData(additionalMappedData);
    return prescribedTreatments;
  };

  useEffect(() => {
    allMedications.getAllDrugOrders(visitUuid);
  }, []);

  const getTreatmentConfigs = async () => {
    const treatmentConfigs = await getConfigsForTreatments();
    setSelectedDrugOrder({
      patientId: patientId,
      scheduleFrequencies: treatmentConfigs.scheduleFrequencies,
      startTimeFrequencies: treatmentConfigs.startTimeFrequencies,
      enable24HourTimers: enable24HourTime,
      drugOrder: null,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    const setMedicationsData = async () => {
      if (allMedications.data) {
        let allTreatments = [];
        const allMedicationsList = { ...allMedications.data };
        if (allMedicationsList.ipdDrugOrders.length > 0) {
          drugOrderList = updateDrugOrderList(allMedicationsList.ipdDrugOrders);
          const allPrescribedTreatmentData =
            await modifyPrescribedTreatmentData(drugOrderList);
          allTreatments = [...allPrescribedTreatmentData];
        }
        if (
          allMedicationsList.emergencyMedications &&
          allMedicationsList.emergencyMedications.length > 0
        ) {
          const emergencyTreatments = modifyEmergencyTreatmentData(
            allMedicationsList.emergencyMedications
          );
          allTreatments = [...allTreatments, ...emergencyTreatments];
          setAdditionalData((prevData) => [
            ...prevData,
            ...mapAdditionalDataForEmergencyTreatments(emergencyTreatments),
          ]);
        }
        allTreatments.sort(
          (a, b) =>
            a.additionalData.startTimeForSort -
            b.additionalData.startTimeForSort
        );
        setTreatments(allTreatments);
        getTreatmentConfigs();
      }
    };

    setMedicationsData();
  }, [allMedications.data]);

  return (
    <>
      {showStopDrugChartModal && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage id="STOP_DRUG" defaultMessage="Stop drug" />
          }
          label={""}
          primaryButtonText={
            <FormattedMessage id="STOP_DRUG" defaultMessage="Stop drug" />
          }
          secondaryButtonText={
            <FormattedMessage
              id="STOP_DRUG_CANCEL_TEXT"
              defaultMessage="Cancel"
            />
          }
          primaryButtonDisabled={isStopButtonDisabled}
          onSubmit={!isStopButtonDisabled && handleStopDrugChartModalSubmit}
          onSecondarySubmit={stopDrugModalCloseActions.onClose}
          onClose={stopDrugModalCloseActions.onClose}
          // eslint-disable-next-line react/no-children-prop
          children={
            <>
              <FormattedMessage
                id="STOP_DRUG_CONFIRMATION_TEXT"
                defaultMessage="Are you sure you want to stop this drug? You will not be able to reverse this decision"
              />
              <div className="stop-drug-reason-text">
                <TextArea
                  labelText={
                    <Title text={"Please mention a reason"} isRequired={true} />
                  }
                  rows={1}
                  id="stop-drug-reason-text"
                  required
                  onChange={(event) => {
                    setStopReason(event.target.value);
                    setStopButtonDisabled(event.target.value.trim() === "");
                  }}
                />
              </div>
            </>
          }
        />
      )}
      {showStopDrugSuccessNotification && (
        <Notification
          hostData={{
            notificationKind: "success",
            messageId: "STOP_DRUG_SUCCESS_NOTIFICATION",
          }}
          hostApi={{
            onClose: () => {
              setShowStopDrugSuccessNotification(false);
              refreshDisplayControl([
                componentKeys.NURSING_TASKS,
                componentKeys.DRUG_CHART,
                componentKeys.TREATMENTS,
              ]);
            },
          }}
        />
      )}
      {isSliderOpen.treatments && (
        <DrugChartSlider
          title={
            !selectedDrugOrder.drugOrder.drugOrder.dosingInstructions?.asNeeded
              ? AddToDrugChart
              : AddToTasks
          }
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
              : !selectedDrugOrder.drugOrder.drugOrder.dosingInstructions
                  ?.asNeeded
              ? "DRUG_CHART_MODAL_SAVE_MESSAGE"
              : "DRUG_CHART_MODAL_SAVE_MESSAGE_PRN",
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
