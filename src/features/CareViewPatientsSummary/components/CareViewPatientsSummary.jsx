import React, { useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { getSlotsForPatients } from "../../CareViewSummary/utils/CareViewSummary";
import {
  getPreviousNearbyHourEpoch,
  getTimeInFuture,
} from "../../../utils/DateTimeUtils";
import { CareViewContext } from "../../../context/CareViewContext";
import { PatientDetailsCell } from "./PatientDetailsCell";
import { SlotDetailsCell } from "./SlotDetailsCell";
import { Header } from "./Header";

export const CareViewPatientsSummary = (props) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const { careViewConfig } = useContext(CareViewContext);
  const { patientsSummary } = props;
  const timeframeLimitInHours = careViewConfig.timeframeLimitInHours;
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
    setSlotDetails(response);
  };

  useEffect(() => {
    if (patientsSummary.length > 0) {
      fetchSlots(patientsSummary);
    }
  }, [patientsSummary]);

  return (
    <div className={"care-view-table-wrapper"}>
      <table className={"care-view-patient-table"}>
        <tbody>
          <Header
            timeframeLimitInHours={timeframeLimitInHours}
            nearestHourEpoch={nearestHourEpoch}
          />
          {patientsSummary.map((patientSummary, idx) => {
            const { patientDetails, bedDetails } = patientSummary;
            const { uuid } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                <PatientDetailsCell
                  bedDetails={bedDetails}
                  patientDetails={patientDetails}
                />
                <SlotDetailsCell
                  slotDetails={slotDetails}
                  uuid={uuid}
                  timeframeLimitInHours={timeframeLimitInHours}
                  nearestHourEpoch={nearestHourEpoch}
                />
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
