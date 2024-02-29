import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewPatients.scss";
import { Dropdown, Pagination, Loading, Search } from "carbon-components-react";
import PropTypes from "prop-types";
import {
  fetchPatientsList,
  fetchPatientsListBySearch,
} from "../utils/CareViewPatientsUtils";
import { CareViewContext } from "../../../context/CareViewContext";
import { CareViewPatientsSummary } from "../../CareViewPatientsSummary/components/CareViewPatientsSummary";
import { IPD_WARD_SEARCH_PLACEHOLDER_TEXT } from "../../../constants";
import { FormattedMessage } from "react-intl";

export const CareViewPatients = () => {
  const { selectedWard, dashboardConfig } = useContext(CareViewContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(dashboardConfig.defaultPageSize);
  const [patientList, setPatientList] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, updateSearchValue] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const searchKeys = ["bedNumber", "patientIdentifier", "patientName"];
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

  const getPatientsListBySearch = async () => {
    try {
      setIsLoading(true);
      const response = await fetchPatientsListBySearch(
        selectedWard.value,
        searchKeys,
        searchValue,
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
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [selectedWard]);

  useEffect(() => {
    if (selectedWard.value) {
      if (isSearched) {
        getPatientsListBySearch();
      } else {
        getPatientsList();
      }
    }
  }, [selectedWard, currentPage, limit]);

  const handlePaginationChange = (e) => {
    setCurrentPage(e.page);
    setLimit(e.pageSize);
  };

  const handleSearchOnChange = (e) => {
    updateSearchValue(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchValue.length >= 3) {
        setCurrentPage(1);
        setIsSearched(true);
        getPatientsListBySearch();
      } else {
        setIsSearched(false);
      }
    }
  };
  const handleClear = () => {
    updateSearchValue("");
    setIsSearched(false);
    if (selectedWard.value) {
      getPatientsList();
    }
  };

  const noSearchResultsForPatientsWardMessage = (
    <FormattedMessage
      id={"NO_SEARCH_RESULTS_PATIENTS_WARD_MESSAGE"}
      defaultMessage={"No search result available"}
    />
  );
  return (
    <div className="care-view-patients-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="care-view-patients">
          <div className="task-type">
            <Search
              placeholder={IPD_WARD_SEARCH_PLACEHOLDER_TEXT}
              size="lg"
              id="ipd-ward-search"
              onChange={handleSearchOnChange}
              value={searchValue}
              onKeyDown={handleKeyPress}
              onClear={handleClear}
              className="ward-patient-search"
              labelText="Patient Search"
            />
            <Dropdown
              id="default"
              label="Dropdown menu options"
              items={["All tasks", "Pending", "Done"]}
              itemToString={(item) => (item ? item : "")}
              selectedItem={"All tasks"}
            />
          </div>
          {patientList.length > 0 ? (
            <CareViewPatientsSummary patientsSummary={patientList} />
          ) : isSearched ? (
            <div className="no-search-results">
              {noSearchResultsForPatientsWardMessage}
            </div>
          ) : (
            <></>
          )}
          <div className={"patient-pagination"}>
            <Pagination
              page={currentPage}
              pageSize={limit}
              onChange={handlePaginationChange}
              pageSizes={dashboardConfig.pageSizeOptions}
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
