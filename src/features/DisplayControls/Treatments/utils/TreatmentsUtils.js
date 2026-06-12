import React from "react";
import {
  DASHBORAD_CONFIG_URL,
  BAHMNI_ENCOUNTER_URL,
  ENCOUNTER_TYPE_URL,
  MEDICATIONS_BASE_URL,
  requesterFunction,
  verifierFunction,
  defaultDateTimeFormat,
  defaultDateFormat,
} from "../../../../constants";
import axios from "axios";
import { FormattedMessage } from "react-intl";
import NoteIcon from "../../../../icons/note.svg";
import NotesIcon from "../../../../icons/notes.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { TooltipCarbon } from "bahmni-carbon-ui";
import { formatDate } from "../../../../utils/DateTimeUtils";
import {
  parseFhirDosages,
  parseFlatAdminInstructions,
  isVariableDoseOrder,
  fromUcumDurationUnit,
  LOADING_DOSE_DURATION_DISPLAY,
} from "../../../../utils/FhirDosingUtils";
import { isIPDrugOrder } from "../../../../utils/CommonUtils";
import moment from "moment";

export const treatmentHeaders = [
  {
    header: (
      <FormattedMessage
        id={"TREATMENTS_DATE_COLUMN_HEADER"}
        defaultMessage={`Start Date`}
      />
    ),
    key: "startDate",
    isSortable: true,
  },
  {
    header: (
      <FormattedMessage
        id={"TREATMENTS_DRUG_COLUMN_HEADER"}
        defaultMessage={`Drug Name`}
      />
    ),
    key: "drugName",
    isSortable: false,
  },
  {
    header: (
      <FormattedMessage
        id={"TREATMENTS_DOSAGE_COLUMN_HEADER"}
        defaultMessage={`Dosage Details`}
      />
    ),
    key: "dosageDetails",
    isSortable: false,
  },
  {
    header: (
      <FormattedMessage id={"STATUS_COLUMN_HEADER"} defaultMessage={`Status`} />
    ),
    key: "status",
    isSortable: false,
  },
  {
    header: (
      <FormattedMessage
        id={"PROVIDER_COLUMN_HEADER"}
        defaultMessage={`Provider Name`}
      />
    ),
    key: "providerName",
    isSortable: true,
  },
  {
    header: (
      <FormattedMessage
        id={"ACTIONS_COLUMN_HEADER"}
        defaultMessage={`Actions`}
      />
    ),
    key: "actions",
    isSortable: false,
  },
];

export const getConfigsForTreatments = async () => {
  try {
    const response = await axios.get(DASHBORAD_CONFIG_URL, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const treatmentConfig = {
      enable24HourTimers: response.data.config.enable24HourTimers,
      startTimeFrequencies: response.data.config.drugChartStartTimeFrequencies,
      scheduleFrequencies: response.data.config.drugChartScheduleFrequencies,
      prnFrequencyIntervalInMinutes:
        response.data.config.prnFrequencyIntervalInMinutes || {},
    };
    return treatmentConfig;
  } catch (error) {
    return error;
  }
};

export const getSlotsForAnOrderAndServiceType = async (
  patientUuid,
  orderUuids,
  serviceType
) => {
  try {
    const response = await axios.get(MEDICATIONS_BASE_URL, {
      params: { patientUuid, orderUuids, serviceType },
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateDrugOrderList = (drugOrderList) => {
  drugOrderList.forEach((ipdDrugOrder) => {
    ipdDrugOrder.uniformDosingType = {
      dose: ipdDrugOrder.drugOrder.dosingInstructions.dose,
      doseUnits: ipdDrugOrder.drugOrder.dosingInstructions.doseUnits,
      frequency: ipdDrugOrder.drugOrder.dosingInstructions.frequency,
    };
    ipdDrugOrder.route = ipdDrugOrder.drugOrder.dosingInstructions.route;
    ipdDrugOrder.durationUnit = ipdDrugOrder.drugOrder.durationUnits;
    const adminInstructionsStr =
      ipdDrugOrder.drugOrder.dosingInstructions.administrationInstructions;
    if (isVariableDoseOrder(ipdDrugOrder.drugOrder.dosingInstructionType)) {
      const fhirDosages = parseFhirDosages(adminInstructionsStr) || [];
      ipdDrugOrder.fhirDosages = fhirDosages;
      ipdDrugOrder.instructions = "";
      ipdDrugOrder.additionalInstructions = "";
      ipdDrugOrder.rate = null;
      ipdDrugOrder.additives = null;

      const { quantity, quantityUnits, doseUnits } =
        ipdDrugOrder.drugOrder.dosingInstructions;
      const displayDose = quantity || null;
      const displayUnits = quantityUnits || doseUnits || null;

      ipdDrugOrder.drugOrder.dosingInstructions.dose = displayDose;
      ipdDrugOrder.drugOrder.dosingInstructions.doseUnits = displayUnits;
      ipdDrugOrder.drugOrder.dosingInstructions.frequency = null;
      ipdDrugOrder.uniformDosingType = {
        dose: displayDose,
        doseUnits: displayUnits,
        frequency: null,
      };
    } else {
      const administrationInstructions =
        parseFlatAdminInstructions(adminInstructionsStr);
      ipdDrugOrder.instructions = administrationInstructions.instructions || "";
      ipdDrugOrder.additionalInstructions =
        administrationInstructions.additionalInstructions || "";
      ipdDrugOrder.rate = administrationInstructions.rate || null;
      ipdDrugOrder.additives = administrationInstructions.additives || null;
      ipdDrugOrder.isDischargeMedication =
        administrationInstructions.isDischargeMedication || false;
    }
  });
  return drugOrderList;
};

export const isMedicationCourseEndedBeforeAdmission = (
  drugOrder,
  admissionDate
) => {
  const { autoExpireDate, effectiveStartDate, careSetting } = drugOrder;

  if (careSetting === "OUTPATIENT") {
    if (!autoExpireDate) return false;
    return new Date(autoExpireDate) < new Date();
  }

  if (new Date(effectiveStartDate) >= new Date(admissionDate)) return false;
  if (!autoExpireDate) return false;
  return new Date(autoExpireDate) < new Date(admissionDate);
};

export const shouldIncludeInIPDDashboard = (
  drugOrderObject,
  allMedicinesInPrescriptionAvailableForIPD
) => {
  if (!allMedicinesInPrescriptionAvailableForIPD)
    return isIPDrugOrder(drugOrderObject.drugOrder);
  return !(
    !isIPDrugOrder(drugOrderObject.drugOrder) &&
    drugOrderObject.isDischargeMedication
  );
};

export const AddToDrugChart = (
  <FormattedMessage
    id={"ADD_TO_DRUG_CHART"}
    defaultMessage={"Add to Drug Chart"}
  />
);

export const AddToTasks = (
  <FormattedMessage id={"ADD_TO_TASKS"} defaultMessage={"Add to Tasks"} />
);

export const EditDrugChart = (
  <FormattedMessage id={"EDIT_DRUG_CHART"} defaultMessage={"Edit Drug Chart"} />
);

export const StopDrugChart = (
  <FormattedMessage id={"STOP_DRUG"} defaultMessage={"Stop drug"} />
);

export const NoTreatmentsMessage = (
  <FormattedMessage
    id={"NO_TREATMENTS_MESSAGE"}
    defaultMessage={"No IPD Medication is prescribed for this patient yet"}
  />
);

export const isDrugOrderStoppedWithoutAdministration = (drugOrderObject) => {
  return (
    drugOrderObject.drugOrder.dateStopped &&
    (!drugOrderObject.drugOrderSchedule ||
      !drugOrderObject.drugOrderSchedule?.medicationAdministrationStarted)
  );
};

export const setDosingInstructions = (drugOrder) => {
  if (isVariableDoseOrder(drugOrder.dosingInstructionType)) {
    return (
      <div className={drugOrder.dateStopped ? "strike-through" : ""}>
        <FormattedMessage
          id="VARIABLE_DOSAGE_PROTOCOL"
          defaultMessage="Variable Dosage Protocol"
        />
      </div>
    );
  }

  let dosingInstructions =
    drugOrder.dosingInstructions.dose +
    " " +
    drugOrder.dosingInstructions.doseUnits +
    (drugOrder.dosingInstructions.route !== null
      ? " - " + drugOrder.dosingInstructions.route
      : "");

  if (drugOrder.dosingInstructions.frequency) {
    dosingInstructions += " - " + drugOrder.dosingInstructions.frequency;
  }

  if (drugOrder.duration) {
    dosingInstructions +=
      " - for " + drugOrder.duration + " " + drugOrder.durationUnits;
  }
  return (
    <div className={drugOrder.dateStopped && "strike-through"}>
      {dosingInstructions}
    </div>
  );
};

export const getDrugName = (drugOrderObject) => {
  const drugOrder = drugOrderObject.drugOrder;
  const drugNonCoded = drugOrder.drugNonCoded || null;
  const hasNoteContent =
    drugOrder.drug &&
    (drugOrderObject.instructions ||
      drugOrderObject.additionalInstructions ||
      drugOrderObject.rate ||
      drugOrderObject.additives ||
      drugOrder.orderReasonConcept ||
      drugOrder.orderReasonText);

  const noteTooltipContent = hasNoteContent ? (
    <div>
      {drugOrderObject.instructions && (
        <>Instructions:&nbsp;{drugOrderObject.instructions}</>
      )}
      {drugOrderObject.additionalInstructions && (
        <>
          {drugOrderObject.instructions && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Additional Instructions:&nbsp;{drugOrderObject.additionalInstructions}
        </>
      )}
      {drugOrderObject.rate && (
        <>
          {(drugOrderObject.instructions ||
            drugOrderObject.additionalInstructions) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Rate:&nbsp;{drugOrderObject.rate} ml/hr
        </>
      )}
      {drugOrderObject.additives && (
        <>
          {(drugOrderObject.instructions ||
            drugOrderObject.additionalInstructions ||
            drugOrderObject.rate) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Additives:&nbsp;{drugOrderObject.additives}
        </>
      )}
      {getStopReason(drugOrder) && (
        <>
          {(drugOrderObject.instructions ||
            drugOrderObject.additionalInstructions) && (
            <>
              <br />
              <div className="tooltip-content-separater" />
            </>
          )}
          Stopped Notes:&nbsp;{getStopReason(drugOrder)}
        </>
      )}
    </div>
  ) : null;

  const drugNameValue = (
    <div className={hasNoteContent ? "notes-icon-div" : "no-notes-icon-div"}>
      <span
        className={`treatments-drug-name ${
          drugOrder.dateStopped && "strike-through"
        }`}
      >
        <span>
          {drugNonCoded !== null ? drugNonCoded : drugOrder.drug.name}
        </span>
        {hasNoteContent && (
          <TooltipCarbon
            icon={() => <NoteIcon data-testid="notes-icon" />}
            content={noteTooltipContent}
          />
        )}
      </span>
      <div className={"display-tags"}>
        <DisplayTags drugOrder={drugOrder.dosingInstructions} />
      </div>
    </div>
  );

  return drugOrder.drug || drugNonCoded !== null
    ? drugNameValue
    : drugOrder.freeTextAnswer;
};

export const stopDrugOrders = async (payload) => {
  try {
    return await axios.post(BAHMNI_ENCOUNTER_URL, payload, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEncounterType = async (encounterType) => {
  try {
    const response = await axios.get(
      ENCOUNTER_TYPE_URL.replace("{encounterType}", encounterType)
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const modifyEmergencyTreatmentData = (emergencyMedications) => {
  const emergencyTreatments = emergencyMedications.map(
    (medicationAdministration) => {
      const dosingInstructions = { emergency: true };
      const approver = medicationAdministration.providers.find(
        (provider) =>
          provider.function === requesterFunction ||
          provider.function === verifierFunction
      );
      const approverNotes = medicationAdministration.notes.find(
        (notes) => notes.author.uuid === approver?.provider.uuid
      );
      const approverName = approver?.provider.display.includes(" - ")
        ? approver?.provider.display.split(" - ")[1]
        : approver?.provider.display;
      return {
        id: medicationAdministration.uuid,
        startDate: formatDate(
          medicationAdministration.administeredDateTime,
          defaultDateFormat
        ),
        drugName: (
          <div className="notes-icon-div">
            <span className={`treatments-drug-name`}>
              {medicationAdministration.drug.display}
              {approverNotes && approver?.function === verifierFunction && (
                <NotesIcon className="notes-icon" />
              )}
            </span>
            <span>
              <DisplayTags drugOrder={dosingInstructions} />
            </span>
          </div>
        ),
        dosageDetails: (
          <div>
            {medicationAdministration.dose +
              " " +
              medicationAdministration.doseUnits?.display +
              " - " +
              medicationAdministration.route?.display}
          </div>
        ),
        providerName: approverName,
        status: (
          <span>
            {approver?.function === requesterFunction && (
              <div className="red-text">
                <FormattedMessage
                  id="AWAITING_ACKNOWLEDGEMENT"
                  defaultMessage="Not acknowledged"
                />
              </div>
            )}
            {approver?.function === verifierFunction && (
              <FormattedMessage
                id="CONFIRMED_ACKNOWLEDGEMENT"
                defaultMessage="Acknowledged"
              />
            )}
          </span>
        ),
        actions: null,
        additionalData: {
          approverName:
            approver?.function === verifierFunction ? approverName : null,
          approverNotes: approverNotes,
          startTimeForSort: medicationAdministration.administeredDateTime,
        },
      };
    }
  );
  return emergencyTreatments;
};

export const mapAdditionalDataForEmergencyTreatments = (
  emergencyTreatments
) => {
  return emergencyTreatments.map((treatment) => {
    return {
      id: treatment.id,
      approverNotes: treatment.additionalData.approverName
        ? treatment.additionalData.approverNotes?.text
        : null,
      approverAdditionalData:
        treatment.additionalData.approverName +
        " | " +
        formatDate(
          treatment.additionalData.approverNotes?.recordedTime,
          defaultDateTimeFormat
        ),
    };
  });
};

export const getPRNIntervalInMinutes = (frequency, configMap = {}) => {
  if (configMap && configMap[frequency] !== undefined) {
    return configMap[frequency];
  }
  return 0;
};

export const isPRNEligibleForNextDose = (
  lastAdministrationTime,
  frequency,
  configMap = {}
) => {
  const intervalMinutes = getPRNIntervalInMinutes(frequency, configMap);
  if (!intervalMinutes || !lastAdministrationTime) return true;
  const minutesSinceLast = (Date.now() / 1000 - lastAdministrationTime) / 60;
  return minutesSinceLast >= intervalMinutes;
};

export const getStopReason = (drugOrder) => {
  const conceptName = drugOrder.orderReasonConcept
    ? drugOrder.orderReasonConcept.name
    : "";
  const notes = drugOrder.orderReasonText || "";
  const stopReason = conceptName + (conceptName && notes ? ": " : "") + notes;

  return stopReason.trim() !== "" ? stopReason : null;
};

export const buildStageDrugOrder = (
  drugOrderObject,
  dosage,
  stageInfo,
  drugOrderSchedule = null,
  stageStartDate = null
) => {
  const dr = dosage.doseAndRate?.[0];
  const { fhirDosages: _fhirDosages, ...drugOrderWithoutVdpData } = drugOrderObject;
  return {
    ...drugOrderWithoutVdpData,
    drugOrderSchedule,
    uniformDosingType: {
      frequency: stageInfo.frequency,
      dose: dr?.doseQuantity?.value || null,
      doseUnits: dr?.doseQuantity?.unit || null,
    },
    route: dosage.route?.text || drugOrderObject.route || null,
    instructions: stageInfo.instructions || "",
    additionalInstructions: stageInfo.additionalInstructions || "",
    rate: stageInfo.rate || null,
    additives: stageInfo.additives || null,
    durationDisplayValue: stageInfo.isLoadingDose ? 1 : null,
    durationDisplayUnits: stageInfo.isLoadingDose ? LOADING_DOSE_DURATION_DISPLAY : null,
    drugOrder: {
      ...drugOrderObject.drugOrder,
      duration: stageInfo.durationDays || 0,
      durationUnits: fromUcumDurationUnit(dosage.timing?.repeat?.durationUnit),
      ...(stageStartDate != null && { scheduledDate: stageStartDate }),
    },
    variableDosageSequence: dosage.sequence,
  };
};

export const getActiveStageIndex = (fhirDosages, stageSchedules, startDates) => {
  const scheduleBySequence = new Map(
    (stageSchedules || []).map((s) => [s.variableDosageSequence, s])
  );

  const getSchedule = (index) => scheduleBySequence.get(fhirDosages[index].sequence);
  const isScheduled = (schedule) => schedule?.isScheduled === true;
  const isAttended = (schedule) => schedule?.allAttended === true;
  const isActive = (schedule) => isScheduled(schedule) && !isAttended(schedule);

  let stageToAddToDrugChart = -1;

  for (let i = 0; i < fhirDosages.length; i++) {
    const schedule = getSchedule(i);

    if (isScheduled(schedule)) {
      if (!isAttended(schedule)) return -1;
      stageToAddToDrugChart = -1;
      continue;
    }

    if (i > 0) {
      const prevSchedule = getSchedule(i - 1);
      if (isActive(prevSchedule)) return -1;
      if (!isScheduled(prevSchedule) && startDates[i - 1] >= startDates[i]) break;
    }
    if (moment().valueOf() < startDates[i]) break;

    stageToAddToDrugChart = i;
  }

  return stageToAddToDrugChart;
};
