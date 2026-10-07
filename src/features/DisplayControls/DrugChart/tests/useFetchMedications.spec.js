import { renderHook, waitFor } from "@testing-library/react";
import { useFetchMedications } from "../hooks/useFetchMedications";
import { testData } from "./useFetchMedicationMockData";

const mockFetchMedications = jest.fn();

jest.mock("../utils/DrugChartUtils", () => ({
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
    const { result } = renderHook(() => useFetchMedications());
    await waitFor(() => expect(result.current.isLoading).toEqual(false));

    expect(result.current.drugChartData).toEqual(testData);
  });

  it("should return loading state", async () => {
    const { result } = renderHook(() => useFetchMedications());

    expect(result.current.isLoading).toEqual(true);
    await waitFor(() => expect(result.current.isLoading).toEqual(false));
  });

  it("should return error state", async () => {
    const errorMessage = "An error occurred during fetch";
    mockFetchMedications.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useFetchMedications());
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
