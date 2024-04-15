import React, { useContext, useEffect, useState, useMemo } from "react";
import "../styles/CareViewPatients.scss";
import { Pagination, Loading } from "carbon-components-react";
import PropTypes from "prop-types";
import {
  fetchPatientsList,
  fetchPatientsListBySearch,
} from "../utils/CareViewPatientsUtils";
import { CareViewContext } from "../../../context/CareViewContext";
import { CareViewPatientsSummary } from "../../CareViewPatientsSummary/components/CareViewPatientsSummary";
import { FormattedMessage } from "react-intl";
import { CareViewPatientsHeader } from "../components/CareViewPatientsHeader";
import { searchKeys } from "../utils/constants";
import {
  getPreviousNearbyHourEpoch,
  getTimeInFuture,
  getTimeInPast,
  epochTo24HourFormat,
  dateTimeToEpochInMilliSeconds,
} from "../../../utils/DateTimeUtils";
import { currentShiftHoursArray } from "../../DisplayControls/DrugChart/utils/DrugChartUtils";
import { items } from "../utils/constants";
import { WarningAlt20 } from "@carbon/icons-react";
import moment from "moment";
import { timeFormatFor24Hr } from "../../../constants";

export const CareViewPatients = () => {
  const {
    selectedWard,
    careViewConfig,
    refreshPatientList,
    ipdConfig,
    provider,
    headerSelected,
  } = useContext(CareViewContext);
  const { enable24HourTime = {} } = ipdConfig;
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [limit, setLimit] = useState(careViewConfig.defaultPageSize);
  const [patientList, setPatientList] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, updateSearchValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [filterValue, setFilterValue] = useState(items[0]);
  const currentEpoch = getPreviousNearbyHourEpoch(
    Math.floor(new Date().getTime() / 1000)
  );
  const timeframeLimitInHours = careViewConfig.timeframeLimitInHours;
  const [navHourEpoch, updateNavHourEpoch] = useState({
    startHourEpoch: currentEpoch,
    endHourEpoch: getTimeInFuture(currentEpoch, timeframeLimitInHours),
  });
  const [navButtonsDisabled, updateNavButtonsDisabled] = useState({
    previous: false,
    next: false,
  });
  const { currentShiftArray, rangeArray, shiftIndex } = useMemo(() => {
    return {
      currentShiftArray:
        ipdConfig.shiftDetails &&
        currentShiftHoursArray(new Date(), ipdConfig.shiftDetails)
          .currentShiftHoursArray,
      rangeArray:
        ipdConfig.shiftDetails &&
        currentShiftHoursArray(new Date(), ipdConfig.shiftDetails).rangeArray,
      shiftIndex:
        ipdConfig.shiftDetails &&
        currentShiftHoursArray(new Date(), ipdConfig.shiftDetails).shiftIndex,
    };
  }, [ipdConfig.shiftDetails]);

  const getPatientsList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchPatientsList(
        selectedWard.value,
        (currentPage - 1) * limit,
        limit,
        headerSelected,
        provider.uuid
      );
      if (response.status === 200) {
        const { admittedPatients, totalPatients } = response.data;
        setPatientList(admittedPatients);
        setTotalPatients(totalPatients);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      setPatientList([]);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientsListBySearch = async (offset = 1) => {
    try {
      setIsLoading(true);
      const response = await fetchPatientsListBySearch(
        selectedWard.value,
        searchKeys,
        searchValue,
        (offset - 1) * limit,
        limit
      );
      if (response.status === 200) {
        const { admittedPatients, totalPatients } = response.data;
        setPatientList(admittedPatients);
        setTotalPatients(totalPatients);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      setPatientList([]);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    updateSearchValue("");
    setIsSearched(false);
    getPatientsList();
  }, [selectedWard, refreshPatientList, headerSelected]);

  useEffect(() => {
    if (selectedWard.value) {
      if (isSearched) {
        getPatientsListBySearch(currentPage);
      } else {
        getPatientsList();
      }
    }
  }, [currentPage, limit]);

  const handlePaginationChange = (e) => {
    setCurrentPage(e.page);
    setLimit(e.pageSize);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchValue.length >= 3) {
        if (!isSearched) {
          setPreviousPage(currentPage);
        }
        setIsSearched(true);
        const isCurrentPageOne = currentPage === 1;
        setCurrentPage(1);
        /* So whenever the currentPage is 1. THe use effect was not making a search api call.
           To overcome that scenario added this below condition.
           Happens when the inital page is loaded
        */
        if (isCurrentPageOne) {
          getPatientsListBySearch(1);
        }
      } else {
        setIsSearched(false);
      }
    }
  };

  const handleClear = () => {
    updateSearchValue("");
    setIsSearched(false);
    const checkThePageForSame = currentPage === previousPage;
    setCurrentPage(previousPage);
    /* So whenever the currentPage and previousPage are same there was no api backend call being executed/called.
       For that scenario added this below condition.
    */
    if (checkThePageForSame) {
      getPatientsList();
    }
  };

  const handleNext = () => {
    if (currentShiftArray) {
      const startHour = epochTo24HourFormat(navHourEpoch.endHourEpoch);
      const startTime = navHourEpoch.endHourEpoch;
      const endTime = getTimeInFuture(
        navHourEpoch.endHourEpoch,
        timeframeLimitInHours
      );
      let newEndTime;
      const endHour = epochTo24HourFormat(endTime);
      let enableNext = true;
      if (!checkWithinCurrentShift(currentShiftArray, startHour, endHour)) {
        enableNext = false;
        updateNavButtonsDisabled({
          next: !enableNext,
          previous: false,
        });
        newEndTime =
          dateTimeToEpochInMilliSeconds(
            moment(rangeArray[shiftIndex].split("-")[1], timeFormatFor24Hr)
          ) / 1000;
      } else {
        updateNavButtonsDisabled({
          next: false,
          previous: false,
        });
      }
      if (!navButtonsDisabled.next) {
        updateNavHourEpoch({
          startHourEpoch: startTime,
          endHourEpoch: enableNext ? endTime : newEndTime,
        });
      }
    }
  };

  const checkWithinCurrentShift = (currentShiftArray, startHour, endHour) => {
    return (
      currentShiftArray.includes(startHour) &&
      currentShiftArray.includes(endHour)
    );
  };

  const handleNow = () => {
    if (currentShiftArray) {
      const currentMoment = moment();
      let startTimeString = currentShiftArray[0];
      startTimeString = currentShiftArray.find((time, index) => {
        return (
          currentMoment.diff(moment(time, timeFormatFor24Hr)) > 0 &&
          currentMoment.diff(
            moment(currentShiftArray[index + 1], timeFormatFor24Hr)
          ) < 0
        );
      });
      if (!startTimeString) {
        startTimeString = currentShiftArray[currentShiftArray.length - 1];
      }
      const currentEpoch = moment()
        .startOf("day")
        .add(startTimeString, "hours")
        .unix();
      const startTime = currentEpoch;
      const endTime = getTimeInFuture(currentEpoch, timeframeLimitInHours);
      const startHour = epochTo24HourFormat(startTime);
      const endHour = epochTo24HourFormat(endTime);
      const endShiftTime =
        dateTimeToEpochInMilliSeconds(
          moment(rangeArray[shiftIndex].split("-")[1], timeFormatFor24Hr)
        ) / 1000;
      let newEndTime;
      if (
        !currentShiftArray.includes(startHour) ||
        startHour == currentShiftArray[0]
      ) {
        updateNavButtonsDisabled({
          next: false,
          previous: true,
        });
      }
      if (!currentShiftArray.includes(endHour)) {
        updateNavButtonsDisabled({
          next: true,
          previous: false,
        });
        newEndTime = endShiftTime;
      }
      if (
        checkWithinCurrentShift(currentShiftArray, startHour, endHour) &&
        startHour != currentShiftArray[0]
      ) {
        updateNavButtonsDisabled({
          next: false,
          previous: false,
        });
      }
      updateNavHourEpoch({
        startHourEpoch: startTime,
        endHourEpoch: newEndTime ? newEndTime : endTime,
      });
    }
  };

  const handlePrevious = () => {
    if (currentShiftArray) {
      const startTime = getTimeInPast(
        navHourEpoch.startHourEpoch,
        timeframeLimitInHours
      );
      const startHour = epochTo24HourFormat(startTime);
      const endHour = epochTo24HourFormat(navHourEpoch.startHourEpoch);
      const endTime = navHourEpoch.startHourEpoch;
      let enablePrevious = true;
      let newStartTime;
      if (
        !checkWithinCurrentShift(currentShiftArray, startHour, endHour) ||
        startHour == currentShiftArray[0]
      ) {
        enablePrevious = false;
        updateNavButtonsDisabled({
          next: false,
          previous: !enablePrevious,
        });
        newStartTime = getTimeInPast(
          navHourEpoch.startHourEpoch,
          currentShiftArray.indexOf(endHour)
        );
      } else {
        updateNavButtonsDisabled({
          next: false,
          previous: false,
        });
      }
      if (!navButtonsDisabled.previous) {
        updateNavHourEpoch({
          startHourEpoch: enablePrevious ? startTime : newStartTime,
          endHourEpoch: endTime,
        });
      }
    }
  };

  const noSearchResultsForPatientsWardMessage = (
    <FormattedMessage
      id={"NO_SEARCH_RESULTS_PATIENTS_WARD_MESSAGE"}
      defaultMessage={"Patient not found, please update your search criteria"}
    />
  );

  const emptyResultsForPatientsWardMessage = (
    <FormattedMessage
      id={"NO_SEARCH_RESULTS_PATIENTS_WARD_MESSAGE"}
      defaultMessage={"No Patient found"}
    />
  );
  return (
    <div className="care-view-patients-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="care-view-patients">
          <CareViewPatientsHeader
            handleKeyPress={handleKeyPress}
            handleClear={handleClear}
            searchValue={searchValue}
            updateSearchValue={updateSearchValue}
            navHourEpoch={navHourEpoch}
            navButtonsDisabled={navButtonsDisabled}
            handleNow={handleNow}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            enable24HourTime={enable24HourTime}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
          {patientList.length > 0 ? (
            <>
              <CareViewPatientsSummary
                patientsSummary={patientList}
                navHourEpoch={navHourEpoch}
                filterValue={filterValue}
              />
              <div className={"patient-pagination"}>
                <Pagination
                  page={currentPage}
                  pageSize={limit}
                  onChange={handlePaginationChange}
                  pageSizes={careViewConfig.pageSizeOptions}
                  totalItems={totalPatients}
                  itemsPerPageText={"Patients per page"}
                />
              </div>
            </>
          ) : isSearched ? (
            <div className="no-search-results">
              <WarningAlt20 className={"warning-icon-20"} />
              <span className="no-search-results-span">
                {noSearchResultsForPatientsWardMessage}
              </span>
            </div>
          ) : (
            <div className="no-search-results">
              <WarningAlt20 className={"warning-icon-20"} />
              <span className="no-search-results-span">
                {emptyResultsForPatientsWardMessage}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CareViewPatients.propTypes = {
  callbacks: PropTypes.object,
};
