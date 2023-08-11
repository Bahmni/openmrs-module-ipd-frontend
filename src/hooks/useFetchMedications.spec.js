import { renderHook } from "@testing-library/react-hooks";
import { useFetchMedications } from "./useFetchMedications";

const testData = [
  {
    scheduleId: 1,
    scheduleUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    scheduleServiceType: "Medication Administration",
    patientUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
    comment: "some comment",
    startDate: "2023-08-08T18:30:00.000Z",
    endDate: "2023-08-08T18:30:00.000Z",
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
        serviceType: "Medication Administration",
        status: "Not-Administered",
        startDateTime: "2023-08-08T08:30:00.000Z",
        endDateTime: "2023-08-08T09:30:00.000Z",
        notes: "some slot text",
      },
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 12,
        serviceType: "Medication Administration",
        status: "Administered",
        startDateTime: "2023-08-08T11:30:00.000Z",
        endDateTime: "2023-08-08T09:30:00.000Z",
        notes: "some slot text",
        admin: {
          administeredBy: "Dr. John Doe",
          administeredAt: "2023-08-08T11:35:00.000Z",
          adminid: "1234",
        },
      },
      {
        id: 3,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 12,
        serviceType: "Medication Administration",
        status: "Pending",
        startDateTime: "2023-08-08T14:30:00.000Z",
        endDateTime: "2023-08-08T09:30:00.000Z",
        notes: "some slot text",
      },
    ],
  },
];
// const mockFetchMedications = jest.fn();
jest.mock("../utils/DrugChartUtils", () => ({
  fetchMedications: jest.fn().mockResolvedValue({
    data: testData,
  }),
}));

// jest.mock("../utils/DrugChartUtils", () => ({
//     fetchMedications: mockFetchMedications,

// }));

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
