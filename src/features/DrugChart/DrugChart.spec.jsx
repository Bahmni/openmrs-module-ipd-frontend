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
      {
        14: {
          administrationInfo: "Dr. John Doe [14:00]",
          minutes: 0,
          status: "Not-Administered",
        },
        17: {
          administrationInfo: "Dr. John Doe [17:10]",
          minutes: 0,
          status: "Administered",
        },
        21: {
          administrationInfo: "Dr. John Doe [21:00]",
          minutes: 0,
          status: "Pending",
        },
      },
    ]);
  });
});
