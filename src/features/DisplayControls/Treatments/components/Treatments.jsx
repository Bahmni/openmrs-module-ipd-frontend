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
  setDosingInstructions,
  getDrugName,
  stopDrugOrders,
  getEncounterType,
  modifyEmergencyTreatmentData,
  mapAdditionalDataForEmergencyTreatments,
  isDrugOrderStoppedWithoutAdministration,
  getStopReason,
  getSlotsForAnOrderAndServiceType,
  isPRNEligibleForNextDose,
  isMedicationCourseEndedBeforeAdmission,
  shouldIncludeInIPDDashboard,
  buildStageDrugOrder,
  getDischargeRevisedOrderUuids,
  isSupersededByDischargeRevision,
  getActiveStageIndex,
  getMedicationIndicators,
} from "../utils/TreatmentsUtils";
import { getCookies, isUserPrivileged } from "../../../../utils/CommonUtils";
import {
  isVariableDoseOrder,
  fhirDosageToDisplayStage,
  computeStageStartDates,
} from "../../../../utils/FhirDosingUtils";
import {
  ForbiddenErrorMessage,
  GenericErrorMessage,
  PRIVILEGE_CONSTANTS,
  defaultDateTimeFormat,
  errorCodes,
  serviceType,
} from "../../../../constants";
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
import { MedicationIndicatorsContext } from "../../../../context/MedicationIndicatorsContext";
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
  const { config, handleAuditEvent, currentUser } = useContext(IPDContext);
  const {
    enable24HourTime = {},
    addDispensedMedicationToDrugChart = false,
    allMedicinesInPrescriptionAvailableForIPD = true,
  } = config;
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
  const { setMedicationIndicators } = useContext(MedicationIndicatorsContext);
  const { isReadMode } = useContext(IPDContext);
  const [showStopDrugChartModal, setShowStopDrugChartModal] = useState(false);
  const [stopReason, setStopReason] = useState("");
  const [isStopButtonDisabled, setStopButtonDisabled] = useState(true);
  const [stopDrugOrder, setStopDrugOrder] = useState({});
  const [showStopDrugSuccessNotification, setShowStopDrugSuccessNotification] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleStageAddToDrugChart = (drugOrderId, stageIndex) => {
    if (isAddToDrugChartDisabled) return;
    const drugOrderObject = drugOrderList.find(
      (o) => o.drugOrder.uuid === drugOrderId
    );
    if (!drugOrderObject) return;
    const fhirDosages = drugOrderObject.fhirDosages || [];
    const dosage = fhirDosages[stageIndex];
    if (!dosage) return;
    const stageInfo = fhirDosageToDisplayStage(dosage);
    const startDates = computeStageStartDates(
      fhirDosages,
      drugOrderObject.drugOrder.effectiveStartDate
    );
    const stageStartDate = startDates[stageIndex];

    setShowEditMessage(false);
    setSliderContentModified((prev) => ({ ...prev, treatments: false }));
    setSelectedDrugOrder((prev) => ({
      ...prev,
      drugOrder: buildStageDrugOrder(
        drugOrderObject,
        dosage,
        stageInfo,
        null,
        stageStartDate
      ),
    }));
    if (!isSliderOpen.treatments) {
      updateTreatmentsSlider(true);
    }
    setDrugChartNotes("");
  };

  const handleStageEditDrugChart = (drugOrderId, stageIndex) => {
    if (isReadMode) return;
    const drugOrderObject = drugOrderList.find(
      (o) => o.drugOrder.uuid === drugOrderId
    );
    if (!drugOrderObject) return;
    const fhirDosages = drugOrderObject.fhirDosages || [];
    const dosage = fhirDosages[stageIndex];
    if (!dosage) return;
    const stageInfo = fhirDosageToDisplayStage(dosage);
    const stageSchedules =
      drugOrderObject.drugOrderSchedule?.stageSchedules || [];
    const stageStatus = stageSchedules.find(
      (s) => s.variableDosageSequence === dosage.sequence
    );
    const startDates = computeStageStartDates(
      fhirDosages,
      drugOrderObject.drugOrder.effectiveStartDate
    );
    const stageStartDate = startDates[stageIndex];

    const stageSpecificSchedule = stageStatus
      ? {
          slotStartTime: stageStatus.slotStartTime,
          firstDaySlotsStartTime: stageStatus.firstDaySlotsStartTime || null,
          dayWiseSlotsStartTime: stageStatus.dayWiseSlotsStartTime || null,
          remainingDaySlotsStartTime:
            stageStatus.remainingDaySlotsStartTime || null,
          notes: stageStatus.notes,
          medicationAdministrationStarted: stageStatus.administrationStarted,
          pendingSlotsAvailable: stageStatus.pendingSlotsAvailable,
          allSlotsAttended: stageStatus.allAttended,
        }
      : null;

    setShowEditMessage(true);
    setDrugChartNotes(stageStatus?.notes || "");
    setSliderContentModified((prev) => ({ ...prev, treatments: false }));
    setSelectedDrugOrder((prev) => ({
      ...prev,
      drugOrder: buildStageDrugOrder(
        drugOrderObject,
        dosage,
        stageInfo,
        stageSpecificSchedule,
        stageStartDate
      ),
    }));
    if (!isSliderOpen.treatments) {
      updateTreatmentsSlider(true);
    }
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
    handleAuditEvent("STOP_SCHEDULED_MEDICATION_TASK");
  };

  const getActions = (
    showEditDrugChartLink,
    showStopDrugChartLink,
    drugOrder,
    drugOrderSchedule,
    drugOrderAttributes,
    drugOrderObject
  ) => {
    const isOrderDispensed =
      drugOrderAttributes != null &&
      drugOrderAttributes.some(
        (attribute) =>
          attribute.name === "Dispensed" && attribute.value === "true"
      );
    if (
      !isUserPrivileged(currentUser, PRIVILEGE_CONSTANTS.EDIT_MEDICATION_TASKS)
    ) {
      return {};
    }
    if (!showEditDrugChartLink && !showStopDrugChartLink) {
      const isPRNDisabled =
        drugOrder.dosingInstructions?.asNeeded &&
        (drugOrderObject?.prnHasPendingPlaceholder ||
          !drugOrderObject?.prnEligible ||
          (drugOrder.autoExpireDate &&
            new Date() > new Date(drugOrder.autoExpireDate)));
      const isMedicationCompleted =
        !drugOrder.dosingInstructions?.asNeeded &&
        (drugOrderObject?.drugOrderSchedule?.allSlotsAttended ||
          (drugOrder.autoExpireDate &&
            new Date() > new Date(drugOrder.autoExpireDate)));
      const isButtonDisabled =
        isAddToDrugChartDisabled ||
        moment().valueOf() <= drugOrder.effectiveStartDate ||
        (!isOrderDispensed && addDispensedMedicationToDrugChart) ||
        isPRNDisabled ||
        isMedicationCompleted;
      return {
        link: (
          <Link
            disabled={isButtonDisabled}
            onClick={() => {
              if (!isButtonDisabled) {
                handleEditAndAddToDrugChartClick(
                  drugOrder.uuid,
                  showEditDrugChartLink,
                  drugOrderSchedule?.notes
                );
              }
            }}
          >
            {!drugOrder.dosingInstructions?.asNeeded
              ? AddToDrugChart
              : AddToTasks}
          </Link>
        ),
        isScheduled: drugOrder.dosingInstructions?.asNeeded,
        isButtonDisabled,
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

  const modifyPrescribedTreatmentData = async (drugOrders, prnInterval) => {
    const admissionDate = visitSummary?.startDateTime;
    const dischargeRevisedUuids = getDischargeRevisedOrderUuids(drugOrders);
    drugOrders = drugOrders.filter((drugOrderObject) => {
      if (
        isSupersededByDischargeRevision(drugOrderObject, dischargeRevisedUuids)
      ) {
        return false;
      }
      if (
        isMedicationCourseEndedBeforeAdmission(
          drugOrderObject.drugOrder,
          admissionDate
        )
      ) {
        return false;
      }
      return shouldIncludeInIPDDashboard(
        drugOrderObject,
        allMedicinesInPrescriptionAvailableForIPD
      );
    });
    const prescribedTreatments = await Promise.all(
      drugOrders
        .filter(
          (drugOrderObject) =>
            !isDrugOrderStoppedWithoutAdministration(drugOrderObject)
        )
        .map(async (drugOrderObject) => {
          let showEditDrugChartLink;
          let showStopDrugChartLink;
          if (drugOrderObject.drugOrder.dosingInstructions.asNeeded) {
            const [placeholderSlots, adminSlots] = await Promise.all([
              getSlotsForAnOrderAndServiceType(
                patientId,
                drugOrderObject.drugOrder.uuid,
                serviceType.AS_NEEDED_PLACEHOLDER
              ),
              getSlotsForAnOrderAndServiceType(
                patientId,
                drugOrderObject.drugOrder.uuid,
                serviceType.AS_NEEDED_MEDICATION_REQUEST
              ),
            ]);
            const lastAdminTime =
              adminSlots.length > 0
                ? Math.max(...adminSlots.map((s) => s.startTime))
                : null;
            const frequency =
              drugOrderObject.drugOrder.dosingInstructions.frequency;
            drugOrderObject.prnHasPendingPlaceholder = placeholderSlots.some(
              (s) => s.status === "SCHEDULED" && !s.medicationAdministration
            );
            drugOrderObject.prnEligible = isPRNEligibleForNextDose(
              lastAdminTime,
              frequency,
              prnInterval
            );
          } else if (drugOrderObject.drugOrderSchedule != null) {
            showStopDrugChartLink =
              !!drugOrderObject.drugOrderSchedule
                .medicationAdministrationStarted;
            showEditDrugChartLink = !showStopDrugChartLink;
          } else {
            showEditDrugChartLink = false;
          }

          const drugOrder = drugOrderObject.drugOrder;
          const isVariableDose = isVariableDoseOrder(
            drugOrder.dosingInstructionType
          );
          const stageSchedules = isVariableDose
            ? drugOrderObject.drugOrderSchedule?.stageSchedules || []
            : [];
          const actionsObjectValue =
            !drugOrder.dateStopped &&
            getActions(
              showEditDrugChartLink,
              showStopDrugChartLink,
              drugOrder,
              drugOrderObject.drugOrderSchedule,
              drugOrderObject.drugOrderAttributes,
              drugOrderObject
            );
          const hasScheduleEditPrivilege = isUserPrivileged(
            currentUser,
            PRIVILEGE_CONSTANTS.EDIT_MEDICATION_TASKS
          );
          const totalFhirStages = isVariableDose
            ? (drugOrderObject.fhirDosages || []).length
            : 0;
          const isAnyStageScheduled = stageSchedules.some((s) => s.isScheduled);
          const isAllStagesAttended =
            isAnyStageScheduled &&
            stageSchedules.length === totalFhirStages &&
            stageSchedules.every((s) => s.allAttended);
          const isInProgress =
            !drugOrder.dateStopped &&
            isAnyStageScheduled &&
            !isAllStagesAttended;
          const addToDrugChartEnabled = isVariableDose
            ? !drugOrder.dateStopped &&
              !isAddToDrugChartDisabled &&
              hasScheduleEditPrivilege &&
              getActiveStageIndex(
                drugOrderObject.fhirDosages || [],
                stageSchedules,
                computeStageStartDates(
                  drugOrderObject.fhirDosages || [],
                  drugOrder.effectiveStartDate
                )
              ) >= 0
            : !showEditDrugChartLink &&
              !showStopDrugChartLink &&
              !!actionsObjectValue?.link &&
              !actionsObjectValue?.isButtonDisabled &&
              !drugOrder.dosingInstructions?.asNeeded;
          const getStatus = () => {
            if (drugOrder.dateStopped) {
              return (
                <span className={"red-text"}>
                  <FormattedMessage id="STOPPED" defaultMessage="Stopped" />
                </span>
              );
            }
            if (isVariableDose) {
              if (isAllStagesAttended) {
                return (
                  <FormattedMessage
                    id={"COMPLETED"}
                    defaultMessage={"Completed"}
                  />
                );
              }
              if (isInProgress) {
                return (
                  <FormattedMessage
                    id={"IN_PROGRESS"}
                    defaultMessage={"In Progress"}
                  />
                );
              }
              return null;
            }
            if (drugOrder.dosingInstructions?.asNeeded) {
              if (
                drugOrder.autoExpireDate &&
                new Date() > new Date(drugOrder.autoExpireDate)
              ) {
                return (
                  <FormattedMessage
                    id={"COMPLETED"}
                    defaultMessage={"Completed"}
                  />
                );
              }
            } else if (drugOrderObject.drugOrderSchedule?.allSlotsAttended) {
              return (
                <FormattedMessage
                  id={"COMPLETED"}
                  defaultMessage={"Completed"}
                />
              );
            }
          };
          return {
            id: drugOrder.uuid,
            startDate: formatDate(drugOrder.effectiveStartDate),
            drugName: getDrugName(drugOrderObject),
            dosageDetails: setDosingInstructions(
              drugOrder,
              drugOrderObject.intradayDose
            ),
            providerName: drugOrderObject.provider.name,
            status: getStatus(),
            actions: isVariableDose ? null : actionsObjectValue.link,
            isExpanded: true,
            addToDrugChartEnabled,
            additionalData: {
              instructions: drugOrderObject.instructions
                ? drugOrderObject.instructions
                : "",
              additionalInstructions: drugOrderObject.additionalInstructions
                ? drugOrderObject.additionalInstructions
                : "",
              rate: drugOrderObject.rate ? drugOrderObject.rate : null,
              additives: drugOrderObject.additives
                ? drugOrderObject.additives
                : null,
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
              isVariableDose,
              fhirDosages: isVariableDose
                ? drugOrderObject.fhirDosages || []
                : [],
              effectiveStartDate: drugOrder.effectiveStartDate,
              stageSchedules,
              isAddToDrugChartDisabled,
              isReadMode,
              hasScheduleEditPrivilege: isUserPrivileged(
                currentUser,
                PRIVILEGE_CONSTANTS.EDIT_MEDICATION_TASKS
              ),
              onAddToDrugChart:
                isVariableDose && !drugOrder.dateStopped
                  ? (stageIndex) =>
                      handleStageAddToDrugChart(drugOrder.uuid, stageIndex)
                  : undefined,
              onEditDrugChart: isVariableDose
                ? (stageIndex) =>
                    handleStageEditDrugChart(drugOrder.uuid, stageIndex)
                : undefined,
              onStopDrugChart:
                isVariableDose &&
                showStopDrugChartLink &&
                stageSchedules.some((s) => s.pendingSlotsAvailable)
                  ? () => handleStopDrugChartClick(drugOrder.uuid)
                  : undefined,
              isInProgress: isVariableDose ? isInProgress : undefined,
              isCompleted: isVariableDose ? isAllStagesAttended : undefined,
              dateStopped: isVariableDose ? !!drugOrder.dateStopped : undefined,
            },
          };
        })
    );

    const additionalMappedData = prescribedTreatments.map((treatment) => {
      return {
        id: treatment.id,
        instructions: treatment.additionalData.instructions,
        additionalInstructions: treatment.additionalData.additionalInstructions,
        rate: treatment.additionalData.rate,
        additives: treatment.additionalData.additives,
        recordedDateTime: treatment.additionalData.recordedDateTime,
        provider: treatment.providerName,
        stopReason: treatment.additionalData.stopReason,
        stopperAdditionalData: treatment.additionalData.stopperAdditionalData,
        isNotScheduled: treatment.additionalData.isVariableDose
          ? !treatment.additionalData.stageSchedules?.some((s) => s.isScheduled)
          : !(treatment.additionalData.isScheduled ?? true),
        isVariableDose: treatment.additionalData.isVariableDose,
        fhirDosages: treatment.additionalData.fhirDosages,
        effectiveStartDate: treatment.additionalData.effectiveStartDate,
        stageSchedules: treatment.additionalData.stageSchedules,
        isAddToDrugChartDisabled:
          treatment.additionalData.isAddToDrugChartDisabled,
        isReadMode: treatment.additionalData.isReadMode,
        hasScheduleEditPrivilege:
          treatment.additionalData.hasScheduleEditPrivilege,
        onAddToDrugChart: treatment.additionalData.onAddToDrugChart,
        onEditDrugChart: treatment.additionalData.onEditDrugChart,
        onStopDrugChart: treatment.additionalData.onStopDrugChart,
        isInProgress: treatment.additionalData.isInProgress,
        isCompleted: treatment.additionalData.isCompleted,
        dateStopped: treatment.additionalData.dateStopped,
      };
    });
    setAdditionalData(additionalMappedData);
    return prescribedTreatments;
  };

  useEffect(() => {
    allMedications.getAllDrugOrders(visitUuid);
  }, []);

  useEffect(() => {
    const setMedicationsData = async () => {
      if (allMedications.data) {
        const treatmentConfigs = await getConfigsForTreatments();
        const prnInterval =
          treatmentConfigs.prnFrequencyIntervalInMinutes || {};
        setSelectedDrugOrder({
          patientId: patientId,
          scheduleFrequencies: treatmentConfigs.scheduleFrequencies,
          startTimeFrequencies: treatmentConfigs.startTimeFrequencies,
          enable24HourTimers: enable24HourTime,
          drugOrder: null,
        });

        let allTreatments = [];
        const allMedicationsList = { ...allMedications.data };
        if (allMedicationsList.ipdDrugOrders.length > 0) {
          drugOrderList = updateDrugOrderList(allMedicationsList.ipdDrugOrders);
          const allPrescribedTreatmentData =
            await modifyPrescribedTreatmentData(drugOrderList, prnInterval);
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
        setIsLoading(false);
      } else if (
        allMedications.error.response.status === errorCodes.FORBIDDEN
      ) {
        setIsLoading(false);
        setErrorMessage(ForbiddenErrorMessage);
      } else {
        setIsLoading(false);
        setErrorMessage(GenericErrorMessage);
      }
    };

    setMedicationsData();
  }, [allMedications.data, allMedications.error]);

  useEffect(() => {
    setMedicationIndicators(getMedicationIndicators(treatments));
  }, [treatments, setMedicationIndicators]);

  useEffect(() => {
    return () => setMedicationIndicators({ regularCount: 0, vdpCount: 0 });
  }, [setMedicationIndicators]);

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
        <div className="no-treatments">
          {errorMessage ? errorMessage : NoTreatmentsMessage}
        </div>
      ) : (
        <ExpandableDataTable
          rows={treatments}
          headers={treatmentHeaders}
          additionalData={additionalData}
          component={(additionalData) => {
            return <TreatmentExpandableRow data={additionalData} />;
          }}
          useZebraStyles={true}
          isExpandable={(data) => !!data.isVariableDose}
        />
      )}
    </>
  );
};

Treatments.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default Treatments;
