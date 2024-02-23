import React, { useEffect, useState } from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { HospitalBed16 } from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import { getSlotsForPatientsAndTime } from "../../CareViewSummary/utils/CareViewSummary";

export const CareViewPatientsSummary = (props) => {
  const [setSlotDetails] = useState([]);
  const { patientsSummary } = props;

  const fetchSlots = async (patientUuids, currentTime, endTime) => {
    const response = await getSlotsForPatientsAndTime(
      patientUuids,
      currentTime,
      endTime
    );
    setSlotDetails(response.data);
  };

  useEffect(() => {
    if (patientsSummary.length > 0) {
      const patientUuids = patientsSummary.map(
        (patient) => patient.patientDetails.uuid
      );
      const currentTime = Math.floor(Date.now() / 1000);

      const getTimeInFuture = (offsetHours) => {
        const futureTime = new Date();
        futureTime.setHours(futureTime.getHours() + offsetHours);
        const futureTimeUnix = Math.floor(futureTime.getTime() / 1000);
        return futureTimeUnix.toString();
      };
      const endTime = getTimeInFuture(2);
      fetchSlots(patientUuids, currentTime, endTime);
    }
  }, [patientsSummary]);

  return (
    <div>
      <table className={"care-view-patient-table"}>
        <tbody>
          {patientsSummary.map((patientSummary, idx) => {
            const { patientDetails, bedDetails } = patientSummary;
            const { person } = patientDetails;
            return (
              <tr key={idx} className={"patient-row-container"}>
                <td className={"patient-details-container"}>
                  <div className={"care-view-patient-details"}>
                    <div>
                      <HospitalBed16 />
                      &nbsp;
                      <span>{bedDetails.bedNumber}</span>&nbsp;
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
                      <span>{person.gender}</span>)&nbsp;.
                      <span>{person.age}</span>
                      <FormattedMessage
                        id={"AGE_YEARS_LABEL"}
                        defaultMessage={"yrs"}
                      />
                    </div>
                  </div>
                </td>
                <td style={{ minWidth: "650px" }}></td>
                <td style={{ minWidth: "650px" }}></td>
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
