import React, { useContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import {
  getSlotsForPatients,
  getTasksForPatients,
} from "../../CareViewSummary/utils/CareViewSummary";
import { CareViewContext } from "../../../context/CareViewContext";
import { PatientDetailsCell } from "./PatientDetailsCell";
import { SlotDetailsCell } from "./SlotDetailsCell";
import { Header } from "./Header";

export const CareViewPatientsSummary = ({
  patientsSummary,
  navHourEpoch,
  filterValue,
}) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const [nonMedicationDetails, setNonMedicationDetails] = useState([]);
  const { careViewConfig } = useContext(CareViewContext);
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

  const fetchTasks = async (patients) => {
    const patientUuids = patients.map((patient) => patient.patientDetails.uuid);
    const response = await getTasksForPatients(
      patientUuids,
      navHourEpoch.startHourEpoch * 1000,
      navHourEpoch.endHourEpoch * 1000
    );
    setNonMedicationDetails(response);
  };

  useEffect(() => {
    if (patientsSummary.length > 0) {
      fetchSlots(patientsSummary);
      fetchTasks(patientsSummary);
    }
  }, [patientsSummary, navHourEpoch]);

  return (
    <div className={"care-view-table-wrapper"}>
      <table className={"care-view-patient-table"}>
        <tbody>
          <Header
            timeframeLimitInHours={timeframeLimitInHours}
            navHourEpoch={navHourEpoch}
          />
          {patientsSummary.map((patientSummary, idx) => {
            const {
              patientDetails,
              bedDetails,
              careTeam,
              newTreatments,
              visitDetails,
            } = patientSummary;
            const { uuid } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                <PatientDetailsCell
                  bedDetails={bedDetails}
                  patientDetails={patientDetails}
                  careTeamDetails={careTeam}
                  navHourEpoch={navHourEpoch}
                  newTreatments={newTreatments}
                  visitDetails={visitDetails}
                />
                <SlotDetailsCell
                  slotDetails={slotDetails}
                  uuid={uuid}
                  timeframeLimitInHours={timeframeLimitInHours}
                  navHourEpoch={navHourEpoch}
                  nonMedicationDetails={nonMedicationDetails}
                  filterValue={filterValue}
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
  navHourEpoch: propTypes.object,
  filterValue: propTypes.object,
};
