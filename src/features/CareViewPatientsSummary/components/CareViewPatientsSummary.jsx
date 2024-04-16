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
import { setCurrentShiftTimes, getPreviousShiftDetails } from "../../CareViewSummary/utils/CareViewSummary";
import { currentShiftHoursArray } from "../../DisplayControls/DrugChart/utils/DrugChartUtils";

export const CareViewPatientsSummary = ({
  patientsSummary,
  navHourEpoch,
  filterValue,
}) => {
  const [slotDetails, setSlotDetails] = useState([]);
  const [nonMedicationDetails, setNonMedicationDetails] = useState([]);
  const [previousShiftNonMedicationDetails, setPreviousShiftNonMedicationDetails] = useState([]);
  const { careViewConfig, ipdConfig } = useContext(CareViewContext);
  const { shiftDetails: shiftConfig = {} } = ipdConfig;
  const timeframeLimitInHours = careViewConfig.timeframeLimitInHours;
  const shiftDetails = currentShiftHoursArray(
    new Date(),
    shiftConfig
  );
  const shiftRangeArray = shiftDetails.rangeArray;
  const shiftIndex = shiftDetails.shiftIndex;
 

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

  const fetchPreviousShiftTasks = async (patients) => {
    const [startDateTime, endDateTime] =  setCurrentShiftTimes(
      shiftDetails
    );
    const previousShiftDetails =
    getPreviousShiftDetails(
      shiftRangeArray,
      shiftIndex,
      startDateTime,
      endDateTime
    );
    const patientUuids = patients.map((patient) => patient.patientDetails.uuid);
    const response = await getTasksForPatients(
      patientUuids,
      previousShiftDetails.startDateTime ,
      previousShiftDetails.endDateTime 
    );
    const groupedData = [];
    response.forEach(patientData => {
    const patientUuid = patientData.patientUuid;
    const patientTasks = [];
    patientData.tasks.forEach(task => {
      if (task.taskType.display === "nursing_activity_system" && task.status === "REQUESTED") {
        
          patientTasks.push({
              taskName: task.name,
              taskId: task.uuid 
          });
      }
    });
    groupedData.push({
      patient: patientUuid,
      tasks: patientTasks
    });
  });
    setPreviousShiftNonMedicationDetails(groupedData);
  }
 
  useEffect(() => { 
    if (patientsSummary.length > 0) {
      fetchPreviousShiftTasks(patientsSummary);
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
              visitDetails
            } = patientSummary;
            const { uuid } = patientDetails;
            const matchingShift = previousShiftNonMedicationDetails.find(shift => shift.patient === uuid);
            const tasks = matchingShift ? matchingShift.tasks : [];
            return (
              <tr key={idx} className={"patient-row-container"}>
                <PatientDetailsCell
                  bedDetails={bedDetails}
                  patientDetails={patientDetails}
                  careTeamDetails={careTeam}
                  navHourEpoch={navHourEpoch}
                  newTreatments={newTreatments}
                  visitDetails={visitDetails}
                  previousShiftPendingTasks={tasks}
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
