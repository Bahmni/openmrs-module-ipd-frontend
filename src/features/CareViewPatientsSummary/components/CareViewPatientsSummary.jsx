import React, { useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { HospitalBed16 } from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { getSlotsForPatients } from "../../CareViewSummary/utils/CareViewSummary";
import Clock from "../../../icons/clock.svg";
import {
  epochTo24HourTimeFormat,
  getPreviousNearbyHourEpoch,
  getTimeInFuture,
} from "../../../utils/DateTimeUtils";
import {
  getAdministrationStatus,
  getDashboardConfig,
} from "../../../utils/CommonUtils";
import SVGIcon from "../../SVGIcon/SVGIcon";
import { CareViewContext } from "../../../context/CareViewContext";

export const CareViewPatientsSummary = (props) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const [configValue, setConfigValue] = useState({});
  const { dashboardConfig } = useContext(CareViewContext);
  const { patientsSummary } = props;
  const timeframeLimitInHours = dashboardConfig.timeframeLimitInHours;
  const currentEpoch = Math.floor(new Date().getTime() / 1000);
  const nearestHourEpoch = getPreviousNearbyHourEpoch(currentEpoch);

  const fetchSlots = async (patients) => {
    const patientUuids = patients.map((patient) => patient.patientDetails.uuid);
    const currentTime = getPreviousNearbyHourEpoch(
      Math.floor(Date.now() / 1000)
    );
    const endTime = getTimeInFuture(currentTime, timeframeLimitInHours);
    const response = await getSlotsForPatients(
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

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (patientsSummary.length > 0) {
      fetchSlots(patientsSummary);
    }
  }, [patientsSummary]);

  const renderStatusIcon = (slot) => {
    const { drugChart = {} } = configValue;
    const { startTime, status, medicationAdministration } = slot;
    let administrationStatus = getAdministrationStatus(
      medicationAdministration,
      status,
      startTime,
      drugChart,
      slot
    );
    return (
      <div className="status-icon">
        <SVGIcon iconType={administrationStatus} />
      </div>
    );
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
        <div className="slot-details" key={`${slotItem.uuid}`}>
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

  const renderSlotDetailsCell = (uuid) => {
    const columns = [];
    const patientSlotDetail = slotDetails.find(
      (slotDetail) => slotDetail.patientUuid === uuid
    );

    for (let i = 0; i < timeframeLimitInHours; i++) {
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

  const renderHeaderRow = () => {
    return (
      <tr className="patient-row-container">
        <td
          className="patient-details-container"
          key="patient-details-header"
        ></td>
        {Array.from({ length: timeframeLimitInHours }, (_, i) => {
          const startTime = nearestHourEpoch + i * 3600;
          return (
            <td className="slot-details-header" key={`time-frame-header-${i}`}>
              <div className="time">
                {epochTo24HourTimeFormat(startTime, true)}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  const renderPatientDetailsCell = (bedDetails, patientDetails, person) => {
    return (
      <td className={"patient-details-container"}>
        <div className={"care-view-patient-details"}>
          <div className={"admission-details"}>
            <HospitalBed16 />|<span>{bedDetails.bedNumber}</span>|
            <Link href={"#"} inline={true}>
              <span>{patientDetails.display.split(" ")[0]}</span>
            </Link>
          </div>
          <div>
            <FormattedMessage id={"PATIENT"} defaultMessage={"Patient"} />:{" "}
            <span>{person.display}</span>&nbsp;(
            <span>{person.gender}</span>)<span className={"separator"}>|</span>
            <span>{person.age}</span>
            <FormattedMessage id={"AGE_YEARS_LABEL"} defaultMessage={"yrs"} />
          </div>
        </div>
      </td>
    );
  };

  return (
    <div>
      <table className={"care-view-patient-table"}>
        <tbody>
          {renderHeaderRow()}
          {patientsSummary.map((patientSummary, idx) => {
            const { patientDetails, bedDetails } = patientSummary;
            const { person, uuid } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                {renderPatientDetailsCell(bedDetails, patientDetails, person)}
                {renderSlotDetailsCell(uuid)}
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
