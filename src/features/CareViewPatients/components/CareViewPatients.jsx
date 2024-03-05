import React, { useContext, useEffect, useState } from "react";
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
import WarningIcon from "../../../icons/warning.svg";

export const CareViewPatients = () => {
  const { selectedWard, careViewConfig } =
    useContext(CareViewContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [limit, setLimit] = useState(careViewConfig.defaultPageSize);
  const [patientList, setPatientList] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, updateSearchValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const getPatientsList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchPatientsList(
        selectedWard.value,
        (currentPage - 1) * limit,
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
  }, [selectedWard]);

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

  const noSearchResultsForPatientsWardMessage = (
    <FormattedMessage
      id={"NO_SEARCH_RESULTS_PATIENTS_WARD_MESSAGE"}
      defaultMessage={"Patient not found, please update your search criteria"}
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
          />
          {patientList.length > 0 ? (
            <CareViewPatientsSummary patientsSummary={patientList} />
          ) : isSearched ? (
            <div className="no-search-results">
              <WarningIcon />
              <span className="no-search-results-span">
                {noSearchResultsForPatientsWardMessage}
              </span>
            </div>
          ) : (
            <></>
          )}
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
        </div>
      )}
    </div>
  );
};

CareViewPatients.propTypes = {
  callbacks: PropTypes.object,
};
