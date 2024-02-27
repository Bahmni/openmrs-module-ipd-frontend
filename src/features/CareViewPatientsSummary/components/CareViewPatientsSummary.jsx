import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { HospitalBed16 } from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { getSlotsForPatientsAndTime } from "../../CareViewSummary/utils/CareViewSummary";
import moment from "moment";
import Clock from "../../../icons/clock.svg";
import { epochTo24HourTimeFormat } from "../../../utils/DateTimeUtils";
import { getDashboardConfig } from "../../../utils/CommonUtils";
import SVGIcon from "../../SVGIcon/SVGIcon";
import {
  isAdministeredLateTask,
  isLateTask,
} from "../../DisplayControls/DrugChart/utils/DrugChartUtils";

export const CareViewPatientsSummary = (props) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const [configValue, setConfigValue] = useState([]);
  const { patientsSummary } = props;
  const timeFrame = 4; // need to make it configurable

  const getTimeInFuture = (offsetHours) => {
    const futureTime = new Date();
    futureTime.setHours(futureTime.getHours() + offsetHours);
    const futureTimeUnix = Math.floor(futureTime.getTime() / 1000);
    return futureTimeUnix.toString();
  };

  const fetchSlots = async (patients) => {
    const patientUuids = patients.map((patient) => patient.patientDetails.uuid);
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = getTimeInFuture(timeFrame);
    const response = await getSlotsForPatientsAndTime(
      patientUuids,
      currentTime,
      endTime
    );
    setSlotDetails(response.data);
  };

  const fetchConfig = async () => {
    const configData = await getDashboardConfig();
    const config = configData.data || {};
    setConfigValue(config);
  };

  const renderStatusIcon = (slot) => {
    const { drugChart = {} } = configValue;
    const { startTime, status, medicationAdministration } = slot;
    let administrationStatus = "Pending";
    if (medicationAdministration) {
      const { administeredDateTime } = medicationAdministration;
      if (status === "COMPLETED") {
        if (
          isAdministeredLateTask(startTime, administeredDateTime, drugChart)
        ) {
          administrationStatus = "Administered-Late";
        } else {
          administrationStatus = "Administered";
        }
      } else if (status === "NOT_DONE") {
        administrationStatus = "Not-Administered";
      }
    } else {
      if (slot.status === "STOPPED") {
        administrationStatus = "Stopped";
      } else if (isLateTask(startTime, drugChart)) {
        administrationStatus = "Late";
      }
    }
    return (
      <div className="status-icon">
        <SVGIcon iconType={administrationStatus} />
      </div>
    );
  };

  const getPreviousNearbyHourEpoch = (time) => {
    const currentMoment = moment.unix(time);
    const nearestHourMoment = currentMoment.startOf("hour");
    return nearestHourMoment.unix();
  };

  const getColumnData = (slot, startTime, endTime) => {
    const columnData = [];
    slot.currentSlots.forEach((slotItem) => {
      if (slotItem.startTime >= startTime && slotItem.startTime < endTime) {
        columnData.push(slotItem);
      }
    });
    return columnData;
  };

  const renderColumnData = (columnData) => {
    columnData.sort((a, b) => a.startTime - b.startTime);

    return columnData.map((slotItem) => {
      const { dose, doseUnits, route } = slotItem.order;
      return (
        <div
          className="slot-details item-padding"
          key={`${slotItem.uuid}`}
          style={{ minWidth: "650px" }}
        >
          <div className="logo">
            {renderStatusIcon(slotItem)}
            <Clock className="clock-icon" />
          </div>
          <span>{epochTo24HourTimeFormat(slotItem.startTime)}</span>
          <div className="drug-details-wrapper">
            <span>{slotItem.order.drug.display}</span>
            <div className="drug-details">
              {dose && <span className="drug-detail">{dose}</span>}
              {doseUnits && (
                <span className="drug-detail">{doseUnits?.display}</span>
              )}
              {route && (
                <span className="drug-detail">
                  {route?.display && `  |  ${route.display}`}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  const renderTableColumns = (uuid) => {
    const columns = [];
    const patientSlotDetail = slotDetails.find(
      (slotDetail) => slotDetail.patientUuid === uuid
    );

    const currentEpoch = 1708685200;
    const nearestHourEpoch = getPreviousNearbyHourEpoch(currentEpoch);

    for (let i = 0; i < timeFrame; i++) {
      const startTime = nearestHourEpoch + i * 3600;
      const endTime = startTime + 3600;

      if (patientSlotDetail) {
        const columnData = patientSlotDetail.prescribedOrderSlots.flatMap(
          (slot) => getColumnData(slot, startTime, endTime)
        );
        columns.push({ startTime, endTime, columnData });
      } else {
        columns.push({ startTime, endTime, columnData: [] });
      }
    }

    return columns.map(({ columnData }, index) => (
      <td className="slot-details-container" key={index}>
        {renderColumnData(columnData)}
      </td>
    ));
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (patientsSummary.length > 0) {
      fetchSlots(patientsSummary);
    }
  }, [patientsSummary]);

  return (
    <div>
      <table className={"care-view-patient-table"}>
        <tbody>
          {patientsSummary.map((patientSummary, idx) => {
            const { patientDetails, bedDetails } = patientSummary;
            const { person, uuid } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                <td className={"patient-details-container"}>
                  <div className={"care-view-patient-details"}>
                    <div className={"admission-details"}>
                      <HospitalBed16 />|<span>{bedDetails.bedNumber}</span>|
                      <Link href={"#"} inline={true}>
                        <span>{patientDetails.display.split(" ")[0]}</span>
                      </Link>
                    </div>
                    <div>
                      <FormattedMessage
                        id={"PATIENT"}
                        defaultMessage={"Patient"}
                      />
                      : <span>{person.display}</span>&nbsp;(
                      <span>{person.gender}</span>)
                      <span className={"separator"}>|</span>
                      <span>{person.age}</span>
                      <FormattedMessage
                        id={"AGE_YEARS_LABEL"}
                        defaultMessage={"yrs"}
                      />
                    </div>
                  </div>
                </td>
                {renderTableColumns(uuid)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

CareViewPatientsSummary.propTypes = {
  patientsSummary: propTypes.array,
};
