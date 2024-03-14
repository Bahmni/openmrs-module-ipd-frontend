import React, { useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { HospitalBed16 } from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { getIPDPatientDashboardUrl } from "../../../utils/CommonUtils";
import WarningIcon from "../../../icons/warning.svg";
import {
  getColumnData,
  getSlotsForPatients,
} from "../../CareViewSummary/utils/CareViewSummary";
import Clock from "../../../icons/clock.svg";
import { epochTo24HourTimeFormat } from "../../../utils/DateTimeUtils";
import { getAdministrationStatus } from "../../../utils/CommonUtils";
import SVGIcon from "../../SVGIcon/SVGIcon";
import { CareViewContext } from "../../../context/CareViewContext";

export const CareViewPatientsSummary = (props) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const { careViewConfig, ipdConfig } = useContext(CareViewContext);
  const { patientsSummary, navHourEpoch } = props;
  const timeframeLimitInHours = careViewConfig.timeframeLimitInHours;

  const fetchSlots = async (patients) => {
    const patientUuids = patients.map((patient) => patient.patientDetails.uuid);
    const response = await getSlotsForPatients(
      patientUuids,
      navHourEpoch.startHourEpoch,
      navHourEpoch.endHourEpoch
    );
    setSlotDetails(response);
  };

  useEffect(() => {
    if (patientsSummary.length > 0) {
      fetchSlots(patientsSummary);
    }
  }, [patientsSummary, navHourEpoch]);

  const renderStatusIcon = (slot) => {
    const { drugChart = {} } = ipdConfig;
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
            <div className="drug-details" data-testid="drug-details">
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
    const patientSlotDetail = slotDetails?.find(
      (slotDetail) => slotDetail.patientUuid === uuid
    );

    for (let i = 0; i < timeframeLimitInHours; i++) {
      const startTime = navHourEpoch.startHourEpoch + i * 3600;
      if (startTime < navHourEpoch.endHourEpoch) {
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
          data-testid="patient-details-header"
        ></td>
        {Array.from({ length: timeframeLimitInHours }, (_, i) => {
          const startTime = navHourEpoch.startHourEpoch + i * 3600;
          if (startTime < navHourEpoch.endHourEpoch) {
            let headerKey = `slot-details-header-${i}`;
            return (
              <td
                className="slot-details-header"
                key={headerKey}
                data-testid={headerKey}
              >
                <div className="time" data-testid={`time-frame-${i}`}>
                  {epochTo24HourTimeFormat(startTime, true)}
                </div>
              </td>
            );
          }
        })}
      </tr>
    );
  };

  const renderPatientDetailsCell = (
    visitDetails,
    bedDetails,
    patientDetails,
    newTreatments,
    person
  ) => {
    return (
      <td className={"patient-details-container"}>
        <div className={"care-view-patient-details"}>
          <div className={"admission-details"}>
            <HospitalBed16 />|<span>{bedDetails.bedNumber}</span>|
            <Link
              data-testid="identifier-ipd-dashboard"
              onClick={() => {
                console.log("Inside onclick function");
                return window.open(
                  getIPDPatientDashboardUrl(
                    patientDetails.uuid,
                    visitDetails.uuid
                  ),
                  "From Ward to IPD Dashboard"
                );
              }}
            >
              <span>{patientDetails.display.split(" ")[0]}</span>
            </Link>
          </div>
          <div>
            <FormattedMessage id={"PATIENT"} defaultMessage={"Patient"} />:{" "}
            <span>{person.display}</span>&nbsp;(
            <span>{person.gender}</span>)<span className={"separator"}>|</span>
            <span>{person.age}</span>
            <FormattedMessage id={"AGE_YEARS_LABEL"} defaultMessage={"yrs"} />
            {newTreatments > 0 && (
              <>
                <div className="treatments-notification">
                  <WarningIcon />
                  <span className="treatments-notification-span">
                    {newTreatments + " New treatment(s): "}
                    <>
                      <Link
                        data-testid="treatments-ipd-dashboard"
                        onClick={() => {
                          console.log("Inside treatments onclick function");
                          return window.open(
                            getIPDPatientDashboardUrl(
                              patientDetails.uuid,
                              visitDetails.uuid
                            ),
                            "From Ward to IPD Dashboard"
                          );
                        }}
                      >
                        {"Schedule Treatments"}
                      </Link>
                    </>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    );
  };

  return (
    <div className={"care-view-table-wrapper"}>
      <table className={"care-view-patient-table"}>
        <tbody>
          {renderHeaderRow()}
          {patientsSummary.map((patientSummary, idx) => {
            const { patientDetails, newTreatments, bedDetails, visitDetails } =
              patientSummary;
            const { person, uuid } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                {renderPatientDetailsCell(
                  visitDetails,
                  bedDetails,
                  patientDetails,
                  newTreatments,
                  person
                )}
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
  navHourEpoch: propTypes.object,
};
