/**
 * Pure data-transformation functions that map FHIR R4 Bundles to the
 * DTO shape expected by AllMedicationsContext consumers (Treatments.jsx,
 * DrugChartView.jsx).
 *
 * NO React, NO axios — pure JS only.
 */
import {
  FHIR_DOSING_INSTRUCTION_TYPE,
  fromUcumDurationUnit,
  parseFhirDosages,
} from "./FhirDosingUtils";
import { FHIR_MEDICATION_REQUEST_DATE_STOPPED_EXTENSION_URL } from "../constants";

const getReferenceUuid = (reference) => reference?.split("/")?.pop() ?? null;

const parseDate = (value) => (value ? Date.parse(value) : null);

const getExtensionValue = (resource, url) =>
  (resource?.extension ?? []).find((extension) => extension?.url === url)
    ?.valueDateTime ?? null;

const getConcept = (codeableConcept) => {
  const coding = codeableConcept?.coding?.[0];
  const name = coding?.display || null;
  if (!name) return null;
  return {
    uuid: coding?.code ?? null,
    name,
  };
};

/**
 * Maps a FHIR R4 MedicationRequest Bundle to the ipdDrugOrders array shape.
 *
 * @param {object|null|undefined} bundle - FHIR Bundle with MedicationRequest entries
 * @returns {Array} Array of { drugOrder, drugOrderSchedule, provider } objects
 */
export const mapMedicationRequestBundleToIpdDrugOrders = (bundle) => {
  if (!bundle || !bundle.entry || bundle.entry.length === 0) {
    return [];
  }

  return bundle.entry
    .filter(
      (entry) =>
        entry &&
        entry.resource &&
        entry.resource.resourceType === "MedicationRequest"
    )
    .map((entry) => {
      const mr = entry.resource;
      const dosage = mr.dosageInstruction?.[0] ?? {};
      const repeat = dosage.timing?.repeat ?? {};

      const medicationReference = mr.medicationReference;
      const medicationCodeableConcept = mr.medicationCodeableConcept;
      const drugNonCoded =
        !medicationReference && medicationCodeableConcept?.text
          ? medicationCodeableConcept.text
          : null;

      const drugName =
        medicationReference?.display ||
        medicationCodeableConcept?.text ||
        medicationCodeableConcept?.coding?.[0]?.display ||
        null;

      const drugUuid = getReferenceUuid(medicationReference?.reference);

      const authoredOnMs = parseDate(mr.authoredOn);
      const validityStart = parseDate(mr.dispenseRequest?.validityPeriod?.start);
      const scheduledDate = parseDate(dosage.timing?.event?.[0]);
      const dateStopped = parseDate(
        getExtensionValue(
          mr,
          FHIR_MEDICATION_REQUEST_DATE_STOPPED_EXTENSION_URL
        )
      );
      // FHIR2 does not emit autoExpireDate today; boundsPeriod.end is the
      // forward-compatible location if the backend starts sending it.
      const autoExpireDate = parseDate(repeat.boundsPeriod?.end);

      // dosage.text carries the persisted dosing-instructions JSON: a flat
      // object for regular orders, a Dosage[] array for variable-dose orders.
      const administrationInstructions = dosage.text ?? null;
      const isVariableDose =
        parseFhirDosages(administrationInstructions) !== null;

      // FHIR2 only emits statusReason, and only for a discontinuation order;
      // it carries the stop reason the REST contract exposes.
      const stopReason = mr.statusReason ?? null;

      return {
        drugOrder: {
          uuid: mr.id,
          orderNumber: mr.identifier?.[0]?.value ?? null,
          dateActivated: validityStart ?? authoredOnMs,
          effectiveStartDate: scheduledDate ?? validityStart ?? authoredOnMs,
          dateStopped,
          scheduledDate,
          autoExpireDate,
          drug: {
            uuid: drugUuid,
            name: drugName,
            form: null,
            strength: null,
            concept: null,
          },
          drugNonCoded,
          dosingInstructionType: isVariableDose
            ? FHIR_DOSING_INSTRUCTION_TYPE
            : null,
          dosingInstructions: {
            dose: dosage.doseAndRate?.[0]?.doseQuantity?.value ?? null,
            doseUnits: dosage.doseAndRate?.[0]?.doseQuantity?.unit ?? null,
            route:
              dosage.route?.coding?.[0]?.display || dosage.route?.text || null,
            frequency:
              dosage.timing?.code?.coding?.[0]?.display ||
              dosage.timing?.code?.text ||
              null,
            quantity: mr.dispenseRequest?.quantity?.value ?? null,
            quantityUnits: mr.dispenseRequest?.quantity?.unit ?? null,
            asNeeded: dosage.asNeededBoolean ?? false,
            administrationInstructions,
          },
          duration: repeat.duration ?? null,
          durationUnits: repeat.durationUnit
            ? fromUcumDurationUnit(repeat.durationUnit)
            : null,
          // FHIR2 does not expose careSetting, sortWeight or orderGroup.
          // Treatments sorts by effectiveStartDate, so ordering is preserved.
          careSetting: null,
          action: mr.status ?? null,
          // The REST contract exposes the discontinuation reason as
          // orderReasonConcept/orderReasonText; FHIR carries it in statusReason.
          orderReasonConcept: getConcept(stopReason),
          orderReasonText: stopReason?.text ?? null,
          orderer: mr.requester?.display ?? null,
          encounterUuid: getReferenceUuid(mr.encounter?.reference),
          patientUuid: getReferenceUuid(mr.subject?.reference),
          commentToFulfiller: mr.note?.[0]?.text ?? null,
          voided: false,
        },
        drugOrderSchedule: null,
        provider: {
          name: mr.requester?.display ?? null,
          uuid: getReferenceUuid(mr.requester?.reference),
        },
      };
    });
};

/**
 * Maps a FHIR R4 MedicationAdministration Bundle to the emergencyMedications
 * array shape.
 *
 * @param {object|null|undefined} bundle - FHIR Bundle with MedicationAdministration entries
 * @returns {Array} Array of emergency medication objects
 */
export const mapMedicationAdministrationBundleToEmergencyMeds = (bundle) => {
  if (!bundle || !bundle.entry || bundle.entry.length === 0) {
    return [];
  }

  return bundle.entry
    .filter(
      (entry) =>
        entry &&
        entry.resource &&
        entry.resource.resourceType === "MedicationAdministration"
    )
    .map((entry) => {
      const ma = entry.resource;

      const drugDisplayName =
        ma.medicationReference?.display ||
        ma.medicationCodeableConcept?.text ||
        ma.medicationCodeableConcept?.coding?.[0]?.display ||
        null;

      const drugUuid = getReferenceUuid(ma.medicationReference?.reference);

      return {
        uuid: ma.id,
        patientUuid: getReferenceUuid(ma.subject?.reference),
        encounterUuid: getReferenceUuid(ma.context?.reference),
        orderUuid: getReferenceUuid(ma.request?.reference),
        providers: (ma.performer ?? []).map((p) => {
          const actorUuid = getReferenceUuid(p.actor?.reference);
          return {
            uuid: actorUuid,
            provider: {
              uuid: actorUuid,
              display: p.actor?.display ?? null,
            },
            function:
              p.function?.coding?.[0]?.display || p.function?.text || null,
          };
        }),
        notes: (ma.note ?? []).map((n) => ({
          text: n.text ?? null,
          author: {
            uuid: getReferenceUuid(n.authorReference?.reference),
            display: n.authorReference?.display ?? null,
          },
          recordedTime: parseDate(n.time),
        })),
        status: ma.status ?? null,
        statusReason:
          ma.statusReason?.[0]?.text ||
          ma.statusReason?.[0]?.coding?.[0]?.display ||
          null,
        drug: {
          uuid: drugUuid,
          // "display" is used by TreatmentsUtils.js and DrugChartUtils.js consumers
          display: drugDisplayName,
          name: drugDisplayName,
        },
        dosingInstructions: ma.dosage?.text ?? null,
        dose: ma.dosage?.dose?.value ?? null,
        doseUnits: { display: ma.dosage?.dose?.unit ?? null },
        route: {
          display:
            ma.dosage?.route?.coding?.[0]?.display ||
            ma.dosage?.route?.text ||
            null,
        },
        site: {
          display:
            ma.dosage?.site?.coding?.[0]?.display ||
            ma.dosage?.site?.text ||
            null,
        },
        administeredDateTime: parseDate(ma.effectiveDateTime),
      };
    });
};
