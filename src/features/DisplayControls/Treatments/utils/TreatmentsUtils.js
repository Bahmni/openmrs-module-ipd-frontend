import React from "react";
import {
  CLINICAL_CONFIG_URL,
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
import NotesIcon from "../../../../icons/notes.svg";
import DisplayTags from "../../../../components/DisplayTags/DisplayTags";
import { formatDate } from "../../../../utils/DateTimeUtils";

export const treatmentHeaders = [
  {
    header: "Start Date",
    key: "startDate",
    isSortable: true,
  },
  {
    header: "Drug Name",
    key: "drugName",
    isSortable: false,
  },
  {
    header: "Dosage Details",
    key: "dosageDetails",
    isSortable: false,
  },
  {
    header: "Status",
    key: "status",
    isSortable: false,
  },
  {
    header: "Provider Name",
    key: "providerName",
    isSortable: true,
  },
  {
    header: "Actions",
    key: "actions",
    isSortable: false,
  },
];

export const getConfigsForTreatments = async () => {
  try {
    const response = await axios.get(CLINICAL_CONFIG_URL, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const treatmentConfig = {
      enable24HourTimers: response.data.config.enable24HourTimers,
      startTimeFrequencies: response.data.config.drugChartStartTimeFrequencies,
      scheduleFrequencies: response.data.config.drugChartScheduleFrequencies,
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
    const administrationInstructions = JSON.parse(
      ipdDrugOrder.drugOrder.dosingInstructions.administrationInstructions
    );
    ipdDrugOrder.instructions = administrationInstructions.instructions
      ? administrationInstructions.instructions
      : "";
    ipdDrugOrder.additionalInstructions =
      administrationInstructions.additionalInstructions
        ? administrationInstructions.additionalInstructions
        : "";
  });
  return drugOrderList;
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

export const isIPDDrugOrder = (drugOrderObject) => {
  return drugOrderObject.drugOrder.careSetting === "INPATIENT";
};

export const isDrugOrderStoppedWithoutAdministration = (drugOrderObject) => {
  return (
    drugOrderObject.drugOrder.dateStopped &&
    (!drugOrderObject.drugOrderSchedule ||
      !drugOrderObject.drugOrderSchedule?.medicationAdministrationStarted)
  );
};

export const setDosingInstructions = (drugOrder) => {
  let dosingInstructions =
    drugOrder.dosingInstructions.dose +
    " " +
    drugOrder.dosingInstructions.doseUnits +
    " - " +
    drugOrder.dosingInstructions.route;

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
  const isNotesIconDiv =
    drugOrder.drug &&
    (drugOrderObject.instructions ||
      drugOrderObject.additionalInstructions ||
      drugOrder.orderReasonConcept ||
      drugOrder.orderReasonText);

  const drugNameValue = (
    <div className={isNotesIconDiv ? "notes-icon-div" : "no-notes-icon-div"}>
      <span
        className={`treatments-drug-name ${
          drugOrder.dateStopped && "strike-through"
        }`}
      >
      <span>{drugNonCoded !== null ? drugNonCoded : drugOrder.drug.name}</span>
        {isNotesIconDiv && (
          <NotesIcon className="notes-icon" data-testid="notes-icon" />
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
                  id="AWAITING"
                  defaultMessage="Not acknowledged"
                />
              </div>
            )}
            {approver?.function === verifierFunction && (
              <FormattedMessage id="CONFIRMED" defaultMessage="Acknowledged" />
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

export const getStopReason = (drugOrder) => {
  const conceptName = drugOrder.orderReasonConcept
    ? drugOrder.orderReasonConcept.name
    : "";
  const notes = drugOrder.orderReasonText || "";
  const stopReason = conceptName + (conceptName && notes ? ": " : "") + notes;

  return stopReason.trim() !== "" ? stopReason : null;
};
