/**
 * Pure data-transformation functions that map FHIR R4 Bundles to the
 * DTO shape expected by AllMedicationsContext consumers (Treatments.jsx,
 * DrugChartView.jsx).
 *
 * NO React, NO axios — pure JS only.
 */

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

      const drugName =
        dosage.medicationCodeableConcept?.text ||
        mr.medicationCodeableConcept?.text ||
        mr.medicationCodeableConcept?.coding?.[0]?.display ||
        null;

      const authoredOnMs = mr.authoredOn ? Date.parse(mr.authoredOn) : null;
      const validityStart = mr.dispenseRequest?.validityPeriod?.start
        ? Date.parse(mr.dispenseRequest.validityPeriod.start)
        : null;
      const validityEnd = mr.dispenseRequest?.validityPeriod?.end
        ? Date.parse(mr.dispenseRequest.validityPeriod.end)
        : null;

      return {
        drugOrder: {
          uuid: mr.id,
          orderNumber: mr.identifier?.[0]?.value ?? null,
          dateActivated: authoredOnMs,
          effectiveStartDate: validityStart ?? authoredOnMs,
          dateStopped: validityEnd,
          scheduledDate: null,
          autoExpireDate: null,
          drug: {
            uuid: null,
            name: drugName,
            form: null,
            strength: null,
            concept: null,
          },
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
            administrationInstructions: null,
          },
          duration: mr.dispenseRequest?.expectedSupplyDuration?.value ?? null,
          durationUnits:
            mr.dispenseRequest?.expectedSupplyDuration?.unit ?? null,
          careSetting: null,
          action: mr.status ?? null,
          orderReasonText: mr.reasonCode?.[0]?.text ?? null,
          orderer: mr.requester?.display ?? null,
          encounterUuid: mr.encounter?.reference?.split("/")?.pop() ?? null,
          patientUuid: mr.subject?.reference?.split("/")?.pop() ?? null,
          commentToFulfiller: mr.note?.[0]?.text ?? null,
          voided: false,
        },
        drugOrderSchedule: null,
        provider: {
          name: mr.requester?.display ?? null,
          uuid: mr.requester?.reference?.split("/")?.pop() ?? null,
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
        ma.medicationCodeableConcept?.text ||
        ma.medicationCodeableConcept?.coding?.[0]?.display ||
        null;

      return {
        uuid: ma.id,
        patientUuid: ma.subject?.reference?.split("/")?.pop() ?? null,
        encounterUuid: ma.context?.reference?.split("/")?.pop() ?? null,
        orderUuid: ma.request?.reference?.split("/")?.pop() ?? null,
        providers: (ma.performer ?? []).map((p) => ({
          uuid: p.actor?.reference?.split("/")?.pop() ?? null,
          provider: { display: p.actor?.display ?? null },
          function:
            p.function?.coding?.[0]?.display || p.function?.text || null,
        })),
        notes: (ma.note ?? []).map((n) => ({
          text: n.text ?? null,
          author: n.authorReference?.display ?? null,
          time: n.time ? Date.parse(n.time) : null,
        })),
        status: ma.status ?? null,
        statusReason:
          ma.statusReason?.[0]?.text ||
          ma.statusReason?.[0]?.coding?.[0]?.display ||
          null,
        drug: {
          uuid: null,
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
        administeredDateTime: ma.effectiveDateTime
          ? Date.parse(ma.effectiveDateTime)
          : null,
      };
    });
};
