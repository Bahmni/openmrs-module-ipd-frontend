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
import WarningIcon from "../../../icons/warning.svg";
import { getIPDPatientDashboardUrl } from "../../../utils/CommonUtils";

export const PatientDetailsCell = ({
  patientDetails,
  bedDetails,
  careTeamDetails,
  navHourEpoch,
  newTreatments,
  visitDetails,
  previousShiftPendingTasks
}) => {
  const { person, uuid } = patientDetails;
  const {
    ipdConfig,
    provider,
    handleRefreshPatientList,
    handleRefreshSummary,
  } = useContext(CareViewContext);
  const [bookmark, setBookmark] = useState({});
  const { shiftDetails: shiftConfig = {} } = ipdConfig;
  const nurse = bookmark?.provider;
  const formattedNurseName = nurse?.display.includes(" - ")
    ? nurse?.display.split(" - ")[1]
    : nurse?.display;
  const nurseName = nurse && formattedNurseName;
  const isBookmarked = Object.keys(bookmark).length !== 0;

  const getBookmarkStatus = (careTeamDetailsData) => {
    const nearestHourEpochInMilliseconds = navHourEpoch.startHourEpoch * 1000;
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
        handleRefreshPatientList();
      } else {
        const response = await bookmarkPatient(patientData);
        const participant = getBookmarkStatus(response.data);
        setBookmark(participant);
      }
      handleRefreshSummary();
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
          <Link
            href={getIPDPatientDashboardUrl(
              patientDetails.uuid,
              visitDetails.uuid,
              "careViewDashboard"
            )}
            data-testid="identifier-ipd-dashboard"
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
          {(newTreatments > 0 || previousShiftPendingTasks.length > 0) && (
            <>
              <div className="treatments-notification">
                <div className="warning_icon">
                  <WarningIcon /> </div>
                <div className="treatments-notification-span">
                 { newTreatments > 0 && <div>&bull; { newTreatments + " New treatment(s): "}
                  <>
                    <Link
                      href={getIPDPatientDashboardUrl(
                        patientDetails.uuid,
                        visitDetails?.uuid,
                        "careViewDashboard"
                      )}
                      data-testid="treatments-ipd-dashboard"
                    >
                      <FormattedMessage
                        id={"SCHEDULE_TREATMENTS"}
                        defaultMessage={"Schedule Treatments"}
                      />
                    </Link>
                  </>
                  </div>}
                  { previousShiftPendingTasks.length > 0 &&
                  <div> &bull;{" Previous Pending: "} {
                    previousShiftPendingTasks.map((task, index) => (
                      <span key={task.taskId}>
                        {index === previousShiftPendingTasks.length - 1 ? (
                          <span>{task.taskName}</span>
                        ) : (
                          <span>{task.taskName + ", "}</span>
                        )}
                      </span>
                    ))
                  }</div>
                  }
                </div>
              </div>
            </>
          )}
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
          className={provider.uuid !== nurse?.uuid && "bookmark-disabled"}
          onClick={() => handleBookmarkClick(uuid)}
          data-testid="bookmark-filled-icon"
        >
          <BookmarkFilled20 />
        </div>
      ) : (
        <div
          data-testid="bookmark-add-icon"
          onClick={() => handleBookmarkClick(uuid)}
        >
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
  navHourEpoch: propTypes.object.isRequired,
  visitDetails: propTypes.object.isRequired,
  newTreatments: propTypes.number.isRequired,
};
