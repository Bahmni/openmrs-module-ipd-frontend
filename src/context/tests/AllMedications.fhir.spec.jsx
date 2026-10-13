/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  AllMedicationsContext,
  AllMedicationsContextProvider,
} from "../AllMedications";
import { IPDContext } from "../IPDContext";
import {
  FHIR_MEDICATION_REQUEST_URL,
  FHIR_MEDICATION_ADMIN_EMERGENCY_URL,
} from "../../constants";

const VISIT_UUID = "visit-uuid-test-001";

// IPDContext with FHIR migration enabled
const mockIpdContextFhir = {
  config: { config: { enableIpdFhirMigration: true } },
};

const mrBundle = {
  resourceType: "Bundle",
  entry: [
    {
      resource: {
        resourceType: "MedicationRequest",
        id: "mr-uuid-fixture-001",
        status: "active",
        medicationCodeableConcept: { text: "Amoxicillin 500mg" },
        subject: { reference: "Patient/patient-uuid-001" },
        encounter: { reference: "Encounter/encounter-uuid-001" },
        authoredOn: "2024-03-10T06:00:00.000Z",
        requester: {
          reference: "Practitioner/pract-uuid-001",
          display: "Dr. House",
        },
        dosageInstruction: [
          {
            doseAndRate: [{ doseQuantity: { value: 500, unit: "mg" } }],
            route: { coding: [{ display: "Oral" }] },
            timing: { code: { coding: [{ display: "Three times daily" }] } },
            asNeededBoolean: false,
          },
        ],
        dispenseRequest: {
          validityPeriod: {
            start: "2024-03-10T06:00:00.000Z",
            end: "2024-03-17T06:00:00.000Z",
          },
          quantity: { value: 21, unit: "Cap" },
          expectedSupplyDuration: { value: 7, unit: "days" },
        },
      },
    },
  ],
};

const maBundle = {
  resourceType: "Bundle",
  entry: [
    {
      resource: {
        resourceType: "MedicationAdministration",
        id: "ma-uuid-fixture-001",
        status: "completed",
        medicationCodeableConcept: { text: "Morphine 5mg" },
        subject: { reference: "Patient/patient-uuid-001" },
        context: { reference: "Encounter/encounter-uuid-001" },
        effectiveDateTime: "2024-03-10T08:30:00.000Z",
        performer: [
          {
            actor: {
              reference: "Practitioner/pract-uuid-001",
              display: "Nurse Joy",
            },
          },
        ],
        dosage: {
          text: "5mg IV",
          dose: { value: 5, unit: "mg" },
          route: { coding: [{ display: "Intravenous" }] },
        },
      },
    },
  ],
};

const emptyBundle = { resourceType: "Bundle", entry: [] };

function TestHarness({ visitUuid, captured }) {
  const medications = useContext(AllMedicationsContext);
  captured.current = medications;
  useEffect(() => {
    medications.getAllDrugOrders(visitUuid);
  }, []); // eslint-disable-line
  return (
    <div data-testid="harness">
      <span data-testid="loading">{String(medications.isLoading)}</span>
      <span data-testid="has-data">{String(medications.data !== null)}</span>
      <span data-testid="has-error">{String(medications.error !== null)}</span>
    </div>
  );
}

function renderWithFhirProvider(visitUuid) {
  const captured = { current: null };
  const utils = render(
    <IPDContext.Provider value={mockIpdContextFhir}>
      <AllMedicationsContextProvider>
        <TestHarness visitUuid={visitUuid} captured={captured} />
      </AllMedicationsContextProvider>
    </IPDContext.Provider>
  );
  return { ...utils, captured };
}

describe("AllMedicationsContextProvider — FHIR path (enableIpdFhirMigration: true)", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.restore();
  });

  it("on success: hits both FHIR URLs and populates ipdDrugOrders + emergencyMedications", async () => {
    mock.onGet(FHIR_MEDICATION_REQUEST_URL(VISIT_UUID)).reply(200, mrBundle);
    mock
      .onGet(FHIR_MEDICATION_ADMIN_EMERGENCY_URL(VISIT_UUID))
      .reply(200, maBundle);

    const { getByTestId, captured } = renderWithFhirProvider(VISIT_UUID);

    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("has-data").textContent).toBe("true");
    });

    const { data, isLoading, error } = captured.current;
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
    expect(Array.isArray(data.ipdDrugOrders)).toBe(true);
    expect(data.ipdDrugOrders).toHaveLength(1);
    expect(data.ipdDrugOrders[0].drugOrder.uuid).toBe("mr-uuid-fixture-001");
    expect(Array.isArray(data.emergencyMedications)).toBe(true);
    expect(data.emergencyMedications).toHaveLength(1);
    expect(data.emergencyMedications[0].uuid).toBe("ma-uuid-fixture-001");
  });

  it("on MedicationRequest failure: sets error, isLoading=false", async () => {
    mock.onGet(FHIR_MEDICATION_REQUEST_URL(VISIT_UUID)).reply(500);
    mock
      .onGet(FHIR_MEDICATION_ADMIN_EMERGENCY_URL(VISIT_UUID))
      .reply(200, maBundle);

    const { getByTestId, captured } = renderWithFhirProvider(VISIT_UUID);

    await waitFor(() =>
      expect(getByTestId("has-error").textContent).toBe("true")
    );
    expect(captured.current.isLoading).toBe(false);
    expect(captured.current.error).not.toBeNull();
    expect(captured.current.data).toBeNull();
  });

  it("on MedicationAdministration failure: sets error, isLoading=false", async () => {
    mock.onGet(FHIR_MEDICATION_REQUEST_URL(VISIT_UUID)).reply(200, mrBundle);
    mock.onGet(FHIR_MEDICATION_ADMIN_EMERGENCY_URL(VISIT_UUID)).reply(403);

    const { getByTestId, captured } = renderWithFhirProvider(VISIT_UUID);

    await waitFor(() =>
      expect(getByTestId("has-error").textContent).toBe("true")
    );
    expect(captured.current.isLoading).toBe(false);
    expect(captured.current.error).not.toBeNull();
    expect(captured.current.data).toBeNull();
  });

  it("on both success with empty bundles: returns empty arrays, no error", async () => {
    mock.onGet(FHIR_MEDICATION_REQUEST_URL(VISIT_UUID)).reply(200, emptyBundle);
    mock
      .onGet(FHIR_MEDICATION_ADMIN_EMERGENCY_URL(VISIT_UUID))
      .reply(200, emptyBundle);

    const { getByTestId, captured } = renderWithFhirProvider(VISIT_UUID);

    await waitFor(() =>
      expect(getByTestId("has-data").textContent).toBe("true")
    );
    expect(captured.current.error).toBeNull();
    expect(captured.current.data.ipdDrugOrders).toEqual([]);
    expect(captured.current.data.emergencyMedications).toEqual([]);
  });
});
