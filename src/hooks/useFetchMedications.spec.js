/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import { renderHook } from "@testing-library/react-hooks";
import { useFetchMedications } from "./useFetchMedications";
import { testData } from "./useFetchMedicationMockData";

const mockFetchMedications = jest.fn();

jest.mock("../utils/DrugChartUtils/DrugChartUtils", () => ({
  fetchMedications: () => mockFetchMedications(),
}));

afterEach(() => {
  jest.resetAllMocks();
});

beforeEach(() => {
  mockFetchMedications.mockResolvedValue({
    data: testData,
  });
});

describe("useFetchMedications", () => {
  it("should return medications", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchMedications()
    );
    await waitForNextUpdate();

    expect(result.current.drugChartData).toEqual(testData);
  });

  it("should return loading state", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchMedications()
    );

    expect(result.current.isLoading).toEqual(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toEqual(false);
  });
});
