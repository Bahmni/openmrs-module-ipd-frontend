import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import useScrollSync from "react-scroll-sync-hook";
import moment from "moment";
import Calendar from "../Calendar/Calendar";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import "./DrugChart.scss";
import DrugList from "../DrugList/DrugList";
import DrugChartLegend from "../DrugChartLegend/DrugChartLegend";
import { fetchMedications } from "../../utils/DrugChartUtils";
export const TransformDrugChartData = (drugChartData) => {
  const drugOrderData = [];
  const transformedDrugChartData = drugChartData.map((schedule) => {
    const { slots, order } = schedule;
    const slotData = {};
    const drugOrder = {
      drugName: order.drug.display,
      drugRoute: order.route.display,
      administrationInfo: [],
    };
    if (order.duration) {
      drugOrder.duration = order.duration + " " + order.durationUnits.display;
    }
    if (order.doseUnits.display !== "ml") {
      drugOrder.dosage = order.dose;
      drugOrder.doseType = order.doseUnits.display;
    } else {
      drugOrder.dosage = order.dose + order.doseUnits.display;
    }
    if (order.duration) {
      drugOrder.duration = order.duration + " " + order.durationUnits.display;
    }
    slots.forEach((slot) => {
      const { startDateTime, status } = slot;
      const startDateTimeObj = new Date(startDateTime);
      let adminInfo, administeredTime;
      if (slot.admin) {
        const { administeredBy, administeredAt } = slot.admin;
        administeredTime = moment(new Date(administeredAt)).format("HH:mm");
        adminInfo = administeredBy + " [" + administeredTime + "]";
      }
      const startHour = startDateTimeObj.getHours();
      const startMinutes = startDateTimeObj.getMinutes();
      slotData[startHour] = {
        minutes: startMinutes,
        status: status,
        administrationInfo: adminInfo,
      };
      if (status === "Administered" || status === "Administered-Late") {
        drugOrder.administrationInfo.push({
          kind: status,
          time: administeredTime,
        });
      }
    });
    drugOrderData.push(drugOrder);
    return slotData;
  });
  return [transformedDrugChartData, drugOrderData];
};
export const GetUTCEpochForDate = (viewDate) => {
  const utcTimeEpoch = moment.utc(viewDate).unix();
  return utcTimeEpoch;
};
export default function DrugChart(props) {
  const { patientId, viewDate } = props;
  console.log("DrugChart: patientId: ", patientId);
  console.log("DrugChart: viewDate: ", viewDate);
  const forDate = GetUTCEpochForDate(viewDate);
  const leftPane = useRef(null);
  const rightPane = useRef(null);
  const { registerPane, unregisterPane } = useScrollSync({
    vertical: true,
  });
  useEffect(() => {
    if (leftPane.current) {
      registerPane(leftPane.current);
    }
    if (rightPane.current) {
      registerPane(rightPane.current);
    }
    return () => {
      if (leftPane.current) {
        unregisterPane(leftPane.current);
      }
      if (rightPane.current) {
        unregisterPane(rightPane.current);
      }
    };
  }, [leftPane, rightPane, registerPane, unregisterPane]);
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
    {
      scheduleId: 2,
      scheduleUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      patientUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      scheduleServiceType: "Medication Administration",
      comment: "some comment",
      scheduleStartDate: "2023-08-08T18:30:00.000Z",
      scheduleEndDate: "2023-08-08T18:30:00.000Z",
      order: {
        drug: {
          display: "Ibuprofen 400 mg Tablet",
        },
        route: {
          uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
          display: "Oral",
        },
        dose: 4,
        doseUnits: {
          uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
          display: "Tablet(s)",
        },
      },
      slots: [
        {
          id: 3,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 11,
          serviceType: "Medication Administration",
          status: "Administered-Late",
          startDateTime: "2023-08-08T08:30:00.000Z",
          endDateTime: "2023-08-08T09:30:00.000Z",
          notes: "some slot text",
          admin: {
            administeredBy: "Dr. John Doe",
            administeredAt: "2023-08-08T08:45:00.000Z",
            adminid: "1234",
          },
        },
        {
          id: 4,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 12,
          serviceType: "Medication Administration",
          status: "Late",
          startDateTime: "2023-08-08T02:30:00.000Z",
          endDateTime: "2023-08-08T03:30:00.000Z",
          notes: "some slot text",
          admin: {
            administeredBy: "Dr. John Doe",
            administeredAt: "2023-08-08T08:30:00.000Z",
            adminid: "1234",
          },
        },
      ],
    },
    {
      scheduleId: 3,
      scheduleUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      patientUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      scheduleServiceType: "Medication Administration",
      comment: "some comment",
      scheduleStartDate: "2023-08-08T18:30:00.000Z",
      scheduleEndDate: "2023-08-08T18:30:00.000Z",
      order: {
        drug: {
          display: "Amoxicillin/Clavulanic Acid 1000 mg Tablet (Tablet)",
        },
        route: {
          uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
          display: "Oral",
        },
        dose: "4",
        doseUnits: {
          uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
          display: "Tablet(s)",
        },
        duration: 2,
        durationUnits: {
          uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
          display: "Day(s)",
        },
      },
      slots: [
        {
          id: 3,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 11,
          serviceType: "Medication Administration",
          status: "Administered",
          startDateTime: "2023-08-08T06:30:00.000Z",
          endDateTime: "2023-08-08T09:30:00.000Z",
          notes: "some slot text",
          admin: {
            administeredBy: "Dr. John Doe",
            administeredAt: "2023-08-08T06:30:00.000Z",
            adminid: "1234",
          },
        },
        {
          id: 4,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 12,
          serviceType: "Medication Administration",
          status: "Late",
          startDateTime: "2023-08-08T04:30:00.000Z",
          endDateTime: "2023-08-08T05:30:00.000Z",
          notes: "some slot text",
        },
      ],
    },
    {
      scheduleId: 4,
      scheduleUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      scheduleServiceType: "Medication Administration",
      patientUuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
      comment: "some comment",
      startDate: "2023-08-08T18:30:00.000Z",
      endDate: "2023-08-08T18:30:00.000Z",
      order: {
        drug: {
          display: "Isoflurane 250 mL Inhalation Anesthetic Liquid (Liquid)",
        },
        route: {
          uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
          display: "Oral",
        },
        dose: 30,
        doseUnits: {
          uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
          display: "ml",
        },
        duration: 4,
        durationUnits: {
          uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
          display: "Day(s)",
        },
      },
      dose: 2,
      doseUnits: {
        uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
        display: "Tablet(s)",
      },
      slots: [
        {
          id: 1,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 13,
          serviceType: "Medication Administration",
          status: "Administered-Late",
          startDateTime: "2023-08-08T10:45:00.000Z",
          endDateTime: "2023-08-08T09:30:00.000Z",
          notes: "some slot text",
          admin: {
            administeredBy: "Dr. John Doe",
            administeredAt: "2023-08-08T10:50:00.000Z",
            adminid: "1234",
          },
        },
        {
          id: 2,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 12,
          serviceType: "Medication Administration",
          status: "Administered",
          startDateTime: "2023-08-08T13:35:00.000Z",
          endDateTime: "2023-08-08T09:30:00.000Z",
          notes: "some slot text",
          admin: {
            administeredBy: "Dr. John Doe",
            administeredAt: "2023-08-08T13:40:00.000Z",
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
        },
      ],
    },
  ];
  useEffect(async () => {
    const newDrugChartData = await fetchMedications(patientId, forDate);

    console.log("newDrugChartData: ", newDrugChartData);
  });
  const transformedDrugchartData = TransformDrugChartData(drugChartData);
  return (
    <div className="drug-chart-dashboard">
      <div className="drug-chart">
        <div className="drug-chart-left-panel" ref={leftPane}>
          <div className="header" />
          <DrugList drugDetails={transformedDrugchartData[1]} />
        </div>
        <div className="drug-chart-content" ref={rightPane}>
          <CalendarHeader />
          <Calendar calendarData={transformedDrugchartData[0]} />
        </div>
      </div>
      <DrugChartLegend />
    </div>
  );
}
DrugChart.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
