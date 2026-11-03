/**
 * Pure mappers for the write side of IPD medication administration
 * (legacy REST payloads -> FHIR R4 resources, FHIR responses -> legacy-compatible shape).
 * NO React, NO axios.
 */
import {
  FHIR_MA_SLOT_EXTENSION_URL,
  FHIR_NOTE_AMENDMENT_REASON_EXTENSION_URL,
  FHIR_TASK_URL,
} from "../constants";

const epochSecondsToIso = (epochSeconds) =>
  new Date(Number(epochSeconds) * 1000).toISOString();

const mapPerformers = (providers = []) =>
  providers.map((p) => ({
    function: { text: p.function, coding: [{ code: p.function }] },
    actor: { reference: `Practitioner/${p.providerUuid}` },
  }));

const mapNotes = (notes = []) =>
  notes.map((n) => ({
    authorReference: { reference: `Practitioner/${n.authorUuid}` },
    text: n.text,
  }));

export const mapScheduledPayloadToFhirMedicationAdministration = (item) => ({
  resourceType: "MedicationAdministration",
  status: item.status,
  subject: { reference: `Patient/${item.patientUuid}` },
  request: { reference: `MedicationRequest/${item.orderUuid}` },
  performer: mapPerformers(item.providers),
  note: mapNotes(item.notes),
  effectiveDateTime: epochSecondsToIso(item.administeredDateTime),
  extension: [{ url: FHIR_MA_SLOT_EXTENSION_URL, valueString: item.slotUuid }],
});

export const mapEmergencyPayloadToFhirMedicationAdministration = (
  payload,
  { id } = {}
) => {
  const dosage = {};
  if (payload.dose !== undefined && payload.dose !== null) {
    dosage.dose = {
      value: Number(payload.dose),
      ...(payload.doseUnits && { unit: payload.doseUnits }),
    };
  }
  if (payload.route) {
    dosage.route = { text: payload.route };
  }
  return {
    ...(id && { id }),
    resourceType: "MedicationAdministration",
    status: payload.status,
    category: { coding: [{ code: "emergency" }] },
    subject: { reference: `Patient/${payload.patientUuid}` },
    medicationReference: { reference: `Medication/${payload.drugUuid}` },
    performer: mapPerformers(payload.providers),
    note: mapNotes(payload.notes),
    effectiveDateTime: epochSecondsToIso(payload.administeredDateTime),
    dosage,
  };
};

const isSuccess = (status) => status >= 200 && status < 300;

/**
 * Normalises a FHIR create response into a legacy-compatible
 * object ({ status: 200, data }) on success; returns the response untouched
 * (so callers see the failing status) on failure.
 */
export const normaliseFhirCreateResponse = (response) => {
  if (!response || !isSuccess(response.status)) return response;
  return { ...response, status: 200 };
};

export const buildAmendmentPatch = ({
  authorUuid,
  recordedTime,
  text,
  statusReasonUuid,
}) => [
  {
    op: "add",
    path: "/note/-",
    value: {
      authorReference: { reference: `Practitioner/${authorUuid}` },
      time: epochSecondsToIso(recordedTime),
      text,
      extension: [
        {
          url: FHIR_NOTE_AMENDMENT_REASON_EXTENSION_URL,
          valueCodeableConcept: { coding: [{ code: statusReasonUuid }] },
        },
      ],
    },
  },
];

/**
 * Single place defining how an acknowledgement is sent to the backend.
 * Backend mechanism is still being decided (Task POST vs operation); change here only.
 */
export const buildAcknowledgementRequest = (
  medicationAdministrationUuid,
  { remarks }
) => ({
  url: FHIR_TASK_URL,
  body: {
    resourceType: "Task",
    status: "completed",
    intent: "order",
    focus: {
      reference: `MedicationAdministration/${medicationAdministrationUuid}`,
    },
    note: [{ text: remarks }],
  },
});
