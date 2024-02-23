import React from "react";
import propTypes from "prop-types";
import "../styles/CareViewPatientsSummary.scss";
import { HospitalBed16 } from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";

export const CareViewPatientsSummary = (props) => {
  const { patientsSummary } = props;
  return (
    <table className={"care-view-patient-table"}>
      <tbody>
        {patientsSummary.map((patientSummary, idx) => {
          const { patientDetails, bedDetails } = patientSummary;
          const { person } = patientDetails;
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
              <td style={{ minWidth: "650px" }}></td>
              <td style={{ minWidth: "650px" }}></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

CareViewPatientsSummary.propTypes = {
  patientsSummary: propTypes.array,
};
