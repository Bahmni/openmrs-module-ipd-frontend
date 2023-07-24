import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Calendar from "../Calendar/Calendar";
import CalendarHeader from "../CalendarHeader/CalendarHeader";
import "./DrugChart.scss";

export const TransformDrugChartData = (drugChartData) => {
  const transformedDrugChartData = drugChartData.map((schedule) => {
    const { slots } = schedule;
    const slotData = {};
    slots.forEach((slot) => {
      const { startDateTime, status } = slot;
      const startDateTimeObj = new Date(startDateTime);
      let adminInfo;
      if (slot.admin) {
        const { administeredBy, administeredAt } = slot.admin;
        const administeredTime = moment(new Date(administeredAt)).format(
          "HH:mm"
        );

        adminInfo = administeredBy + " [" + administeredTime + "]";
      }

      const startHour = startDateTimeObj.getHours();
      const startMinutes = startDateTimeObj.getMinutes();
      slotData[startHour] = {
        minutes: startMinutes,
        status: status,
        administrationInfo: adminInfo,
      };
    });
    return slotData;
  });
  return transformedDrugChartData;
};

export default function DrugChart(props) {
  const { patientId, viewDate = new Date() } = props;
  console.log("DrugChart: patientId: ", patientId);
  console.log("DrugChart: viewDate: ", viewDate);

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
            administeredAt: "2023-08-08T08:30:00.000Z",
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
            administeredAt: "2023-08-08T08:30:00.000Z",
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
      slots: [
        {
          id: 1,
          uuid: "738aa77d-03fc-438f-a87a-ae8a8867c421",
          orderId: 13,
          serviceType: "Medication Administration",
          status: "Not-Administered",
          startDateTime: "2023-08-08T10:45:00.000Z",
          endDateTime: "2023-08-08T09:30:00.000Z",
          notes: "some slot text",
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
  const transformedDrugchartData = TransformDrugChartData(drugChartData);

  return (
    <div className="drug-chart">
      <div className="drug-chart-left-panel"></div>
      <div className="drug-chart-content">
        <CalendarHeader />
        <Calendar calendarData={transformedDrugchartData} />
      </div>
    </div>
  );
}

DrugChart.propTypes = {
  patientId: PropTypes.string.isRequired,
  viewDate: PropTypes.instanceOf(Date),
};
