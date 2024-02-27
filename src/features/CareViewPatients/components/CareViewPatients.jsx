import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewPatients.scss";
import { Dropdown, Pagination, Loading } from "carbon-components-react";
import PropTypes from "prop-types";
import { fetchPatientsList } from "../utils/CareViewPatientsUtils";
import { CareViewContext } from "../../../context/CareViewContext";
import { CareViewPatientsSummary } from "../../CareViewPatientsSummary/components/CareViewPatientsSummary";

export const CareViewPatients = () => {
  const { selectedWard, wardSummary, dashboardConfig } =
    useContext(CareViewContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(dashboardConfig.defaultPageSize);
  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getPatientsList = async () => {
    try {
      setIsLoading(true);
      const response = await fetchPatientsList(
        selectedWard.value,
        (currentPage - 1) * limit,
        limit
      );
      if (response.status === 200) {
        setPatientList(response.data);
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
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  }, [selectedWard]);

  useEffect(() => {
    if (selectedWard.value) {
      getPatientsList();
    }
  }, [selectedWard, currentPage, limit]);

  const handlePaginationChange = (e) => {
    setCurrentPage(e.page);
    setLimit(e.pageSize);
  };

  return (
    <div className="care-view-patients-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="care-view-patients">
          <div className="task-type">
            <Dropdown
              id="default"
              label="Dropdown menu options"
              items={["All tasks", "Pending", "Done"]}
              itemToString={(item) => (item ? item : "")}
              selectedItem={"All tasks"}
            />
          </div>
          <CareViewPatientsSummary patientsSummary={patientList} />
          <div className={"patient-pagination"}>
            <Pagination
              page={currentPage}
              pageSize={limit}
              onChange={handlePaginationChange}
              pageSizes={dashboardConfig.pageSizeOptions}
              totalItems={wardSummary?.totalPatients || 0}
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
