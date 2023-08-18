import { fetchMedications } from "./DrugChartUtils";
import axios from "axios";
import { mockResponse } from "./DrugChartUtilsMockData";

jest.mock("axios");

describe("DrugChartUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should make axios get call with url", async () => {
    axios.get.mockImplementation(() => Promise.resolve(mockResponse));

    const patientUuid = "test-uuid";
    const forDate = "1690906550";
    const expectedUrl = `/openmrs/ws/rest/v1/ipd/schedule/type/medication?patientUuid=${patientUuid}&forDate=${forDate}`;
    await fetchMedications(patientUuid, forDate);
    expect(axios.get).toHaveBeenCalledWith(expectedUrl);
  });

  it("should return response data", async () => {
    axios.get.mockImplementation(() => Promise.resolve(mockResponse));
    const patientUuid = "test-uuid";
    const forDate = "1690906550";
    const response = await fetchMedications(patientUuid, forDate);
    expect(response).toEqual(mockResponse);
  });
  it("should reject with error", async () => {
    const error = new Error("Error while fetching medications");
    axios.get.mockRejectedValue(error);
    const patientUuid = "test-uuid";
    const forDate = "1690906550";
    try {
      await fetchMedications(patientUuid, forDate);
    } catch (e) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(e).toEqual(error);
    }
  });
});
