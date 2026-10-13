import {
  mapMedicationRequestBundleToIpdDrugOrders,
  mapMedicationAdministrationBundleToEmergencyMeds,
} from "../fhirMedicationMapper";

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

const makeMedicationRequestBundle = (entries = []) => ({
  resourceType: "Bundle",
  id: "bundle-mr-001",
  type: "searchset",
  entry: entries,
});

const makeMedicationAdministrationBundle = (entries = []) => ({
  resourceType: "Bundle",
  id: "bundle-ma-001",
  type: "searchset",
  entry: entries,
});

const fullMedicationRequestEntry = {
  resource: {
    resourceType: "MedicationRequest",
    id: "mr-uuid-001",
    identifier: [{ value: "ORD-001" }],
    status: "active",
    medicationCodeableConcept: {
      text: "Paracetamol 500mg",
      coding: [{ display: "Paracetamol" }],
    },
    subject: { reference: "Patient/patient-uuid-001" },
    encounter: { reference: "Encounter/encounter-uuid-001" },
    authoredOn: "2024-01-15T08:00:00.000Z",
    requester: {
      reference: "Practitioner/practitioner-uuid-001",
      display: "Dr. Jane Smith",
    },
    dosageInstruction: [
      {
        route: { coding: [{ display: "Oral" }], text: "By mouth" },
        timing: {
          code: {
            coding: [{ display: "Twice daily" }],
            text: "BID",
          },
        },
        doseAndRate: [
          {
            doseQuantity: { value: 500, unit: "mg" },
          },
        ],
        asNeededBoolean: false,
      },
    ],
    dispenseRequest: {
      validityPeriod: {
        start: "2024-01-15T08:00:00.000Z",
        end: "2024-01-22T08:00:00.000Z",
      },
      quantity: { value: 14, unit: "Tab" },
      expectedSupplyDuration: { value: 7, unit: "days" },
    },
    reasonCode: [{ text: "Fever management" }],
    note: [{ text: "Take with food" }],
  },
};

const fullMedicationAdministrationEntry = {
  resource: {
    resourceType: "MedicationAdministration",
    id: "ma-uuid-001",
    status: "completed",
    medicationCodeableConcept: {
      text: "Morphine 10mg",
      coding: [{ display: "Morphine" }],
    },
    subject: { reference: "Patient/patient-uuid-002" },
    context: { reference: "Encounter/encounter-uuid-002" },
    request: { reference: "MedicationRequest/mr-uuid-002" },
    effectiveDateTime: "2024-01-15T10:30:00.000Z",
    performer: [
      {
        actor: {
          reference: "Practitioner/performer-uuid-001",
          display: "Nurse Alice",
        },
        function: {
          coding: [{ display: "Performer" }],
          text: "Performer",
        },
      },
    ],
    note: [
      {
        text: "Patient tolerated well",
        authorReference: { display: "Nurse Alice" },
        time: "2024-01-15T10:35:00.000Z",
      },
    ],
    dosage: {
      text: "10mg IV push",
      dose: { value: 10, unit: "mg" },
      route: {
        coding: [{ display: "Intravenous" }],
        text: "IV",
      },
      site: {
        coding: [{ display: "Left arm" }],
        text: "Left arm",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Tests: mapMedicationRequestBundleToIpdDrugOrders
// ---------------------------------------------------------------------------

describe("mapMedicationRequestBundleToIpdDrugOrders", () => {
  it("returns [] for null bundle", () => {
    expect(mapMedicationRequestBundleToIpdDrugOrders(null)).toEqual([]);
  });

  it("returns [] for undefined bundle", () => {
    expect(mapMedicationRequestBundleToIpdDrugOrders(undefined)).toEqual([]);
  });

  it("returns [] for bundle with empty entry array", () => {
    const bundle = makeMedicationRequestBundle([]);
    expect(mapMedicationRequestBundleToIpdDrugOrders(bundle)).toEqual([]);
  });

  it("maps a single MedicationRequest with all fields populated", () => {
    const bundle = makeMedicationRequestBundle([fullMedicationRequestEntry]);
    const result = mapMedicationRequestBundleToIpdDrugOrders(bundle);

    expect(result).toHaveLength(1);
    const item = result[0];

    // drugOrder top-level identity
    expect(item.drugOrder.uuid).toBe("mr-uuid-001");
    expect(item.drugOrder.orderNumber).toBe("ORD-001");
    expect(item.drugOrder.action).toBe("active");
    expect(item.drugOrder.voided).toBe(false);

    // drug name
    expect(item.drugOrder.drug.name).toBe("Paracetamol 500mg");

    // dosing instructions
    expect(item.drugOrder.dosingInstructions.dose).toBe(500);
    expect(item.drugOrder.dosingInstructions.doseUnits).toBe("mg");
    expect(item.drugOrder.dosingInstructions.route).toBe("Oral");
    expect(item.drugOrder.dosingInstructions.frequency).toBe("Twice daily");
    expect(item.drugOrder.dosingInstructions.asNeeded).toBe(false);
    expect(item.drugOrder.dosingInstructions.quantity).toBe(14);
    expect(item.drugOrder.dosingInstructions.quantityUnits).toBe("Tab");

    // dates (parsed to millis)
    expect(item.drugOrder.dateActivated).toBe(
      Date.parse("2024-01-15T08:00:00.000Z")
    );
    expect(item.drugOrder.effectiveStartDate).toBe(
      Date.parse("2024-01-15T08:00:00.000Z")
    );
    expect(item.drugOrder.dateStopped).toBe(
      Date.parse("2024-01-22T08:00:00.000Z")
    );

    // duration
    expect(item.drugOrder.duration).toBe(7);
    expect(item.drugOrder.durationUnits).toBe("days");

    // reason + notes
    expect(item.drugOrder.orderReasonText).toBe("Fever management");
    expect(item.drugOrder.commentToFulfiller).toBe("Take with food");

    // orderer / references
    expect(item.drugOrder.orderer).toBe("Dr. Jane Smith");
    expect(item.drugOrder.patientUuid).toBe("patient-uuid-001");
    expect(item.drugOrder.encounterUuid).toBe("encounter-uuid-001");

    // provider
    expect(item.provider.name).toBe("Dr. Jane Smith");
    expect(item.provider.uuid).toBe("practitioner-uuid-001");

    // drugOrderSchedule is null (FHIR MedicationRequest doesn't carry slot info)
    expect(item.drugOrderSchedule).toBeNull();
  });

  it("handles missing optional fields gracefully without throwing", () => {
    const minimalEntry = {
      resource: {
        resourceType: "MedicationRequest",
        id: "mr-minimal-001",
        status: "active",
      },
    };
    const bundle = makeMedicationRequestBundle([minimalEntry]);

    let result;
    expect(() => {
      result = mapMedicationRequestBundleToIpdDrugOrders(bundle);
    }).not.toThrow();

    expect(result).toHaveLength(1);
    const item = result[0];
    expect(item.drugOrder.uuid).toBe("mr-minimal-001");
    expect(item.drugOrder.orderNumber).toBeNull();
    expect(item.drugOrder.drug.name).toBeNull();
    expect(item.drugOrder.dosingInstructions.dose).toBeNull();
    expect(item.drugOrder.dosingInstructions.route).toBeNull();
    expect(item.drugOrder.dosingInstructions.frequency).toBeNull();
    expect(item.drugOrder.dateActivated).toBeNull();
    expect(item.drugOrder.effectiveStartDate).toBeNull();
    expect(item.drugOrder.dateStopped).toBeNull();
    expect(item.drugOrder.orderer).toBeNull();
    expect(item.drugOrder.patientUuid).toBeNull();
    expect(item.drugOrder.encounterUuid).toBeNull();
    expect(item.provider.name).toBeNull();
    expect(item.provider.uuid).toBeNull();
  });

  it("skips non-MedicationRequest entries", () => {
    const nonMrEntry = {
      resource: {
        resourceType: "MedicationAdministration",
        id: "should-be-skipped",
      },
    };
    const bundle = makeMedicationRequestBundle([
      nonMrEntry,
      fullMedicationRequestEntry,
    ]);
    const result = mapMedicationRequestBundleToIpdDrugOrders(bundle);

    expect(result).toHaveLength(1);
    expect(result[0].drugOrder.uuid).toBe("mr-uuid-001");
  });
});

// ---------------------------------------------------------------------------
// Tests: mapMedicationAdministrationBundleToEmergencyMeds
// ---------------------------------------------------------------------------

describe("mapMedicationAdministrationBundleToEmergencyMeds", () => {
  it("returns [] for null bundle", () => {
    expect(mapMedicationAdministrationBundleToEmergencyMeds(null)).toEqual([]);
  });

  it("returns [] for undefined bundle", () => {
    expect(mapMedicationAdministrationBundleToEmergencyMeds(undefined)).toEqual(
      []
    );
  });

  it("returns [] for bundle with empty entry array", () => {
    const bundle = makeMedicationAdministrationBundle([]);
    expect(mapMedicationAdministrationBundleToEmergencyMeds(bundle)).toEqual(
      []
    );
  });

  it("maps a MedicationAdministration with performers, notes, and dosage", () => {
    const bundle = makeMedicationAdministrationBundle([
      fullMedicationAdministrationEntry,
    ]);
    const result = mapMedicationAdministrationBundleToEmergencyMeds(bundle);

    expect(result).toHaveLength(1);
    const item = result[0];

    // identity
    expect(item.uuid).toBe("ma-uuid-001");
    expect(item.status).toBe("completed");
    expect(item.patientUuid).toBe("patient-uuid-002");
    expect(item.encounterUuid).toBe("encounter-uuid-002");
    expect(item.orderUuid).toBe("mr-uuid-002");

    // drug
    expect(item.drug.display).toBe("Morphine 10mg");
    expect(item.drug.name).toBe("Morphine 10mg");
    expect(item.drug.uuid).toBeNull();

    // dosing
    expect(item.dose).toBe(10);
    expect(item.doseUnits.display).toBe("mg");
    expect(item.route.display).toBe("Intravenous");
    expect(item.site.display).toBe("Left arm");
    expect(item.dosingInstructions).toBe("10mg IV push");

    // administered date (millis)
    expect(item.administeredDateTime).toBe(
      Date.parse("2024-01-15T10:30:00.000Z")
    );

    // performers
    expect(item.providers).toHaveLength(1);
    expect(item.providers[0].provider.display).toBe("Nurse Alice");
    expect(item.providers[0].uuid).toBe("performer-uuid-001");
    expect(item.providers[0].function).toBe("Performer");

    // notes
    expect(item.notes).toHaveLength(1);
    expect(item.notes[0].text).toBe("Patient tolerated well");
    expect(item.notes[0].author).toBe("Nurse Alice");
    expect(item.notes[0].time).toBe(Date.parse("2024-01-15T10:35:00.000Z"));
  });

  it("handles missing optional fields gracefully without throwing", () => {
    const minimalEntry = {
      resource: {
        resourceType: "MedicationAdministration",
        id: "ma-minimal-001",
        status: "completed",
      },
    };
    const bundle = makeMedicationAdministrationBundle([minimalEntry]);

    let result;
    expect(() => {
      result = mapMedicationAdministrationBundleToEmergencyMeds(bundle);
    }).not.toThrow();

    expect(result).toHaveLength(1);
    const item = result[0];
    expect(item.uuid).toBe("ma-minimal-001");
    expect(item.patientUuid).toBeNull();
    expect(item.encounterUuid).toBeNull();
    expect(item.orderUuid).toBeNull();
    expect(item.drug.display).toBeNull();
    expect(item.drug.name).toBeNull();
    expect(item.dose).toBeNull();
    expect(item.doseUnits.display).toBeNull();
    expect(item.route.display).toBeNull();
    expect(item.site.display).toBeNull();
    expect(item.administeredDateTime).toBeNull();
    expect(item.providers).toEqual([]);
    expect(item.notes).toEqual([]);
    expect(item.statusReason).toBeNull();
  });

  it("skips non-MedicationAdministration entries", () => {
    const nonMaEntry = {
      resource: {
        resourceType: "MedicationRequest",
        id: "should-be-skipped",
      },
    };
    const bundle = makeMedicationAdministrationBundle([
      nonMaEntry,
      fullMedicationAdministrationEntry,
    ]);
    const result = mapMedicationAdministrationBundleToEmergencyMeds(bundle);

    expect(result).toHaveLength(1);
    expect(result[0].uuid).toBe("ma-uuid-001");
  });
});
