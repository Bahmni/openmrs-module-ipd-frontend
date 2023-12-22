import {
  fetchMedications,
  TransformDrugChartData,
  currentShiftHoursArray,
} from "../utils/DrugChartUtils";
import axios from "axios";
import { mockResponse } from "./DrugChartUtilsMockData";
import { drugChartData } from "./DrugChartUtilsMockData";
import MockDate from "mockdate";

jest.mock("axios");

describe("DrugChartUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe("fetchMedications", () => {
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

  describe("TransformDrugChartData", () => {
    it.skip("should transform drug chart data", () => {
      const TransformedDrugChartData = TransformDrugChartData(drugChartData);
      expect(TransformedDrugChartData).toEqual([
        [
          {
            16: {
              administrationInfo: "",
              minutes: 15,
              status: "Late",
            },
            19: {
              administrationInfo: "",
              minutes: 35,
              status: "Late",
            },
          },
        ],
        [
          {
            administrationInfo: [],
            dosage: "25ml",
            dosingInstructions: '{"Before meals"}',
            drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
            drugRoute: "Oral",
            duration: "3 Day(s)",
            uuid: "9d7437a9-3f10-11e4-abcd-0800271c1b75",
          },
        ],
      ]);
    });
  });

  it("should test currentShiftHoursArray method", () => {
    // mock current date to 19 December 2023 16:59:39 IST
    MockDate.set(1702985379);
    expect(currentShiftHoursArray()).toEqual([16, 17, 18, 19, 20, 21, 22, 23]);
  });
});
