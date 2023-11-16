import {
  fetchMedicationNursingTasks,
  GetUTCEpochForDate,
  ExtractMedicationNursingTasksData,
} from "../utils/NursingTasksUtils";
import axios from "axios";
import {
  mockResponse,
  mockNursingTasksResponse,
  mockExtractedMedicationNursingTasksData,
} from "./NursingTasksUtilsMockData";

jest.mock("axios");

describe("NursingTasksUtils", () => {
  describe("fetchMedicationNursingTasks", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should make axios get call with url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));

      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      const expectedUrl = `/openmrs/ws/rest/v1/ipd/schedule/type/medication?patientUuid=${patientUuid}&forDate=${forDate}`;
      await fetchMedicationNursingTasks(patientUuid, forDate);
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return response data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      const response = await fetchMedicationNursingTasks(patientUuid, forDate);
      expect(response).toEqual(mockResponse.data);
    });
    it("should reject with error", async () => {
      const error = new Error("Error while fetching medications");
      axios.get.mockRejectedValue(error);
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      try {
        await fetchMedicationNursingTasks(patientUuid, forDate);
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e).toEqual(error);
      }
    });
  });

  describe("GetUTCEpochForDate", () => {
    it("should return UTC epoch for date", () => {
      const date = "2021-08-31";
      const expectedEpoch = 1630368000;
      const epoch = GetUTCEpochForDate(date);
      expect(epoch).toEqual(expectedEpoch);
    });
  });

  describe("ExtractMedicationNursingTasksData", () => {
    it("should return extracted data", () => {
      const medicationNursingTasksData = mockNursingTasksResponse;
      const expectedData = mockExtractedMedicationNursingTasksData;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData
      );
      expect(extractedData).toEqual(expectedData);
    });
  });
});
