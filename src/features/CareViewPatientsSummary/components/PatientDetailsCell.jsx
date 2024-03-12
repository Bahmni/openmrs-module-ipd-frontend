import React, { useContext, useState } from "react";
import { bookmarkPatient } from "../../CareViewPatients/utils/CareViewPatientsUtils";
import {
  BookmarkAdd20,
  BookmarkFilled20,
  HospitalBed16,
} from "@carbon/icons-react";
import { Link } from "carbon-components-react";
import { FormattedMessage } from "react-intl";
import propTypes from "prop-types";
import PropTypes from "prop-types";
import { CareViewContext } from "../../../context/CareViewContext";
import {
  currentShiftHoursArray,
  getDateTime,
} from "../../DisplayControls/DrugChart/utils/DrugChartUtils";

export const PatientDetailsCell = (props) => {
  const { patientDetails, bedDetails } = props;
  const { person, uuid } = patientDetails;
  const { ipdConfig, provider } = useContext(CareViewContext);
  const { shiftDetails: shiftConfig = {} } = ipdConfig;

  const [bookmark, setBookmark] = useState(true);
  const handleBookmarkClick = async (uuid) => {
    const shiftDetails = currentShiftHoursArray(new Date(), shiftConfig);

    const patientData = {
      patientUuid: uuid,
      careTeamParticipantsRequest: [
        {
          providerUuid: provider.uuid,
          startTime:
            getDateTime(new Date(), shiftDetails.currentShiftHoursArray[0]) /
            1000,
          endTime:
            getDateTime(
              new Date(),
              shiftDetails.currentShiftHoursArray[
                shiftDetails.currentShiftHoursArray.length - 1
              ] + 1
            ) / 1000,
        },
      ],
    };
    const response = await bookmarkPatient(patientData);
    if (response.status === 200) {
      setBookmark(!bookmark);
    }
  };

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
      <div onClick={() => handleBookmarkClick(uuid)}>
        {bookmark ? <BookmarkAdd20 /> : <BookmarkFilled20 />}
      </div>
    </td>
  );
};

PatientDetailsCell.propTypes = {
  patientDetails: {
    person: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
  },
  bedDetails: propTypes.object.isRequired,
};
