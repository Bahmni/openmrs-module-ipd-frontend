import React from "react";
import { render } from "@testing-library/react";
import DrugChartWrapper, { TransformDrugChartData } from "./DrugChartWrapper";

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
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690906550,
      },
      {
        id: 2,
        uuid: "738aa77d-03fc-438f-a87a-ae8a8867cyu721",
        orderId: 11,
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690916550,
      },
      {
        id: 3,
        uuid: "738aa77d-03fc-438f-a87a-a3ed8a8867c421",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1690918550,
      },
    ],
  },
];
describe("DrugChartWrapper", () => {
  it("matches snapshot", () => {
    const { container } = render(
      <DrugChartWrapper drugChartData={drugChartData} />
    );
    expect(container).toMatchSnapshot();
  });
});

describe("TransformDrugChartData", () => {
  it("should transform drug chart data", () => {
    const TransformedDrugChartData = TransformDrugChartData(drugChartData);
    expect(TransformedDrugChartData).toEqual([
      [
        {
          16: {
            administrationInfo: "",
            minutes: 15,
            status: "SCHEDULED",
          },
          19: {
            administrationInfo: "",
            minutes: 35,
            status: "SCHEDULED",
          },
        },
      ],
      [
        {
          administrationInfo: [],
          dosage: "25ml",
          drugName: "Paracetamol 120 mg/5 mL Suspension (Liquid)",
          drugRoute: "Oral",
          duration: "3 Day(s)",
        },
      ],
    ]);
  });
});
