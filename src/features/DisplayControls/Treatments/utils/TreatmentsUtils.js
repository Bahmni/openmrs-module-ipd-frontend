import React from "react";
import {
  CLINICAL_CONFIG_URL,
  BAHMNI_ENCOUNTER_URL,
  ENCOUNTER_TYPE_URL,
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

export const getDrugName = (drugOrderObject) => {
  const drugOrder = drugOrderObject.drugOrder;
  if (
    drugOrder.drug &&
    (drugOrderObject.instructions ||
      drugOrderObject.additionalInstructions ||
      drugOrder.orderReasonConcept ||
      drugOrder.orderReasonText)
  ) {
    return (
      <div className="notes-icon-div">
        <NotesIcon className="notes-icon" data-testid="notes-icon" />
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
  } else if (drugOrder.drug) {
    return (
      <span
        className={`treatments-drug-name ${
          drugOrder.dateStopped && "strike-through"
        }`}
      >
        {drugOrder.drug.name}
      </span>
    );
  }
  return drugOrder.freeTextAnswer;
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
            {approverNotes && <NotesIcon className="notes-icon" />}
            <span className={`treatments-drug-name`}>
              {medicationAdministration.drug.display}
              <span>
                <DisplayTags drugOrder={dosingInstructions} />
              </span>
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