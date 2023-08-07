import React from "react";
import { render } from "@testing-library/react";
import DrugChart, { TransformDrugChartData } from "./DrugChart";

const mockCalendar = jest.fn();
jest.mock("../CalendarHeader/CalendarHeader", () => {
  return function CalendarHeader() {
    return <div>CalendarHeader</div>;
  };
});

jest.mock("../Calendar/Calendar", () => {
  return function Calendar(props) {
    mockCalendar(props);
    return <div>Calendar</div>;
  };
});

const drugChartData = [
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
        admin: {
          administeredBy: "Dr. John Doe",
          administeredAt: "2023-08-08T08:30:00.000Z",
          adminid: "1234",
        },
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
          administeredAt: "2023-08-08T11:40:00.000Z",
          adminid: "1234",
        },
      },
      {
        id: 3,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
        orderId: 12,
        serviceType: "Medication Administration",
        status: "Pending",
        startDateTime: "2023-08-08T15:30:00.000Z",
        endDateTime: "2023-08-08T09:30:00.000Z",
        notes: "some slot text",
        admin: {
          administeredBy: "Dr. John Doe",
          administeredAt: "2023-08-08T15:30:00.000Z",
          adminid: "1234",
        },
      },
    ],
  },
];
describe("DrugChart", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<DrugChart patientId="test-id" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("TransformDrugChartData", () => {
  it("should transform drug chart data", () => {
    const TransformedDrugChartData = TransformDrugChartData(drugChartData);
    expect(TransformedDrugChartData).toEqual([
      [
        {
          11: {
            administrationInfo: "Dr. John Doe [11:40]",
            minutes: 30,
            status: "Administered",
          },
          15: {
            administrationInfo: "Dr. John Doe [15:30]",
            minutes: 30,
            status: "Pending",
          },
          8: {
            administrationInfo: "Dr. John Doe [08:30]",
            minutes: 30,
            status: "Not-Administered",
          },
        },
      ],
      [
        {
          administrationInfo: [
            {
              kind: "Administered",
              time: "11:40",
            },
          ],
          dosage: "25ml",
          drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
          drugRoute: "Oral",
          duration: "3 Day(s)",
        },
      ],
    ]);
  });
});
