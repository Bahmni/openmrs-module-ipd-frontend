import { fetchMedications } from "./DrugChartUtils";
import axios from "axios";

jest.mock("axios");

const mockResponse = {
  data: {
    id: 1,
    uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    serviceType: "Medication Administration",
    comment: "some comment",
    startDate: 1690906304,
    endDate: 1691165503,
    patient: {
      uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    },
    order: {
      drug: {
        display: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
      },
      route: {
        uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
        display: "Oral",
      },
      dose: 25,
      doseUnits: {
        uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
        display: "ml",
      },
      duration: 3,
      durationUnits: {
        uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
        display: "Day(s)",
      },
    },
    slots: [
      {
        id: 1,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
      },
    ],
  },
};

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
