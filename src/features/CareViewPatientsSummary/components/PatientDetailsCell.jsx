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
import { getCurrentShiftTimes } from "../../../utils/DateTimeUtils";

export const PatientDetailsCell = (props) => {
  const { patientDetails, bedDetails, careTeamDetails, nearestHourEpoch } =
    props;
  const { person, uuid } = patientDetails;
  const { ipdConfig, provider, handleRefreshPatientList } =
    useContext(CareViewContext);
  const [bookmark, setBookmark] = useState({});
  const { shiftDetails: shiftConfig = {} } = ipdConfig;
  const nurse = bookmark?.provider;
  const formattedNurseName = nurse?.display.includes(" - ")
    ? nurse?.display.split(" - ")[1]
    : nurse?.display;
  const nurseName = nurse && formattedNurseName;
  const isBookmarked = Object.keys(bookmark).length !== 0;

  const getBookmarkStatus = (careTeamDetailsData) => {
    const nearestHourEpochInMilliseconds = nearestHourEpoch * 1000;
    if (!careTeamDetailsData || !careTeamDetailsData.participants) return {};

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
  const handleBookmarkClick = async (uuid) => {
    const { startDateTime, endDateTime } = getCurrentShiftTimes(shiftConfig);
    const bookmarkData = {
      providerUuid: provider.uuid,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    const unBookmarkData = {
      uuid: bookmark.uuid,
      voided: true,
    };

    const patientData = {
      patientUuid: uuid,
      careTeamParticipantsRequest: [bookmarkData],
    };

    try {
      if (isBookmarked) {
        await bookmarkPatient({
          ...patientData,
          careTeamParticipantsRequest: [unBookmarkData],
        });
        setBookmark({});
      } else {
        const response = await bookmarkPatient(patientData);
        const participant = getBookmarkStatus(response.data);
        setBookmark(participant);
      }
    } catch (e) {
      handleRefreshPatientList();
    }
  };

  useEffect(() => {
    const participant = getBookmarkStatus(careTeamDetails);
    setBookmark(participant);
  }, []);

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
        {isBookmarked && (
          <div>
            <FormattedMessage id={"NURSE"} defaultMessage={"Nurse"} />:{" "}
            <span>{nurseName}</span>
          </div>
        )}
      </div>
      {isBookmarked ? (
        <div
          className={provider.uuid !== nurse?.uuid && "bookmark"}
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
