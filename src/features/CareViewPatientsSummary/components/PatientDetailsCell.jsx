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
  const [bookmark, setBookmark] = useState(true);
  const { shiftDetails: shiftConfig = {} } = ipdConfig;

  const getCurrentShiftTimes = (shiftConfig) => {
    const { currentShiftHoursArray: currentShift } = currentShiftHoursArray(
      new Date(),
      shiftConfig
    );
    const firstHour = currentShift[0];
    const lastHour = currentShift[currentShift.length - 1];

    let startDateTime = getDateTimeForHour(firstHour);
    let endDateTime = getDateTimeForHour(lastHour + 1);

    if (lastHour < firstHour) {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (currentHour > 12) {
        currentDate.setDate(currentDate.getDate() + 1);
        endDateTime = getDateTimeForHour(lastHour + 1, currentDate);
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
        startDateTime = getDateTimeForHour(firstHour, currentDate);
      }
    }

    return { startDateTime, endDateTime };
  };

  const getDateTimeForHour = (hour, date = new Date()) => {
    return getDateTime(date, hour) / 1000;
  };
  const handleBookmarkClick = async (uuid) => {
    const { startDateTime, endDateTime } = getCurrentShiftTimes(shiftConfig);
    const patientData = {
      patientUuid: uuid,
      careTeamParticipantsRequest: [
        {
          providerUuid: provider.uuid,
          startTime: startDateTime,
          endTime: endDateTime,
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
