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
import { ALL_DRUG_ORDERS_URL } from "../../constants";

const VISIT_UUID = "visit-uuid-test-001";

const restResponse = {
  ipdDrugOrders: [
    {
      drugOrder: { uuid: "rest-drug-order-001", drug: { name: "Paracetamol" } },
    },
  ],
  emergencyMedications: [],
};

const mockIpdContext = {
  config: { config: { enableIpdFhirMigration: false } },
};

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

function renderWithProvider(visitUuid) {
  const captured = { current: null };
  const utils = render(
    <IPDContext.Provider value={mockIpdContext}>
      <AllMedicationsContextProvider>
        <TestHarness visitUuid={visitUuid} captured={captured} />
      </AllMedicationsContextProvider>
    </IPDContext.Provider>
  );
  return { ...utils, captured };
}

describe("AllMedicationsContextProvider — REST path (enableIpdFhirMigration: false)", () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    mock.restore();
  });

  it("renders with initial state: no loading, no data, no error", () => {
    const captured = { current: null };
    render(
      <IPDContext.Provider value={mockIpdContext}>
        <AllMedicationsContextProvider>
          <TestHarness visitUuid={VISIT_UUID} captured={captured} />
        </AllMedicationsContextProvider>
      </IPDContext.Provider>
    );
    expect(captured.current).not.toBeNull();
    expect(typeof captured.current.getAllDrugOrders).toBe("function");
  });

  it("on success: hits REST URL and sets data directly from response", async () => {
    mock.onGet(ALL_DRUG_ORDERS_URL(VISIT_UUID)).reply(200, restResponse);
    const { getByTestId, captured } = renderWithProvider(VISIT_UUID);
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("has-data").textContent).toBe("true");
    });
    expect(captured.current.isLoading).toBe(false);
    expect(captured.current.error).toBeNull();
    expect(captured.current.data).toEqual(restResponse);
  });

  it("on REST 500 failure: sets error, isLoading=false, data remains null", async () => {
    mock
      .onGet(ALL_DRUG_ORDERS_URL(VISIT_UUID))
      .reply(500, { message: "Server error" });
    const { getByTestId, captured } = renderWithProvider(VISIT_UUID);
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("has-error").textContent).toBe("true");
    });
    expect(captured.current.isLoading).toBe(false);
    expect(captured.current.error).not.toBeNull();
    expect(captured.current.data).toBeNull();
  });

  it("on REST 403 Forbidden: sets error, isLoading=false, data remains null", async () => {
    mock
      .onGet(ALL_DRUG_ORDERS_URL(VISIT_UUID))
      .reply(403, { message: "Forbidden" });
    const { getByTestId, captured } = renderWithProvider(VISIT_UUID);
    await waitFor(() => {
      expect(getByTestId("loading").textContent).toBe("false");
      expect(getByTestId("has-error").textContent).toBe("true");
    });
    expect(captured.current.isLoading).toBe(false);
    expect(captured.current.error).not.toBeNull();
    expect(captured.current.data).toBeNull();
  });
});
