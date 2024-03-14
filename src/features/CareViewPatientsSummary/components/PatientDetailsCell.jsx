import React, { useContext, useEffect, useState } from "react";
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
  const { patientDetails, bedDetails, careTeamDetails, nearestHourEpoch } =
    props;
  const { person, uuid } = patientDetails;
  const { ipdConfig, provider, handleRefreshPatientList } =
    useContext(CareViewContext);
  const [bookmark, setBookmark] = useState({});
  const { shiftDetails: shiftConfig = {} } = ipdConfig;

  const getBookmarkStatus = (careTeamDetailsData) => {
    const nearestHourEpochInMilliseconds = nearestHourEpoch * 1000;
    if (!careTeamDetailsData) {
      return {};
    }

    for (const participant of careTeamDetailsData.participants) {
      if (
        nearestHourEpochInMilliseconds >= participant.startTime &&
        nearestHourEpochInMilliseconds < participant.endTime
      ) {
        return participant;
      }
    }

    return {};
  };

  useEffect(() => {
    const participant = getBookmarkStatus(careTeamDetails);
    setBookmark(participant);
  }, []);

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
    const bookmarkData = {
      providerUuid: provider.uuid,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    const patientData = {
      patientUuid: uuid,
      careTeamParticipantsRequest: [bookmarkData],
    };

    if (Object.keys(bookmark).length !== 0) {
      const unBookmarkData = {
        uuid: bookmark.uuid,
        voided: true,
      };
      try {
        await bookmarkPatient({
          ...patientData,
          careTeamParticipantsRequest: [unBookmarkData],
        });
        setBookmark({});
      } catch (e) {
        handleRefreshPatientList();
      }
    } else {
      try {
        const response = await bookmarkPatient(patientData);
        const participant = getBookmarkStatus(response.data);
        setBookmark(participant);
      } catch (e) {
        handleRefreshPatientList();
      }
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
      {Object.keys(bookmark).length !== 0 ? (
        <div
          className={provider.uuid !== bookmark.provider.uuid && "bookmark"}
          onClick={() => handleBookmarkClick(uuid)}
        >
          <BookmarkFilled20 />
        </div>
      ) : (
        <div onClick={() => handleBookmarkClick(uuid)}>
          <BookmarkAdd20 />
        </div>
      )}
    </td>
  );
};

PatientDetailsCell.propTypes = {
  patientDetails: {
    person: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
  },
  bedDetails: propTypes.object.isRequired,
  careTeamDetails: propTypes.object.isRequired,
  nearestHourEpoch: propTypes.number.isRequired,
};
