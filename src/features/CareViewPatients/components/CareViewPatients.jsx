import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewPatients.scss";
import { Dropdown, Pagination } from "carbon-components-react";
import PropTypes from "prop-types";
import { fetchPatientsList } from "../utils/CareViewPatientsUtils";
import { CareViewContext } from "../../../context/CareViewContext";
import { CareViewPatientsSummary } from "../../CareViewPatientsSummary/components/CareViewPatientsSummary";

export const CareViewPatients = (props) => {
  const { callbacks } = props;
  const { selectedWard, wardSummary } = useContext(CareViewContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [patientList, setPatientList] = useState([]);

  const getPatientsList = async () => {
    callbacks.setIsLoading(true);
    const response = await fetchPatientsList(
      selectedWard.value,
      (currentPage - 1) * limit,
      limit
    );
    if (response.status === 200) {
      setPatientList(response.data || []);
    }
    callbacks.setIsLoading(false);
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
            pageSizes={[10, 20, 30, 40, 50]}
            totalItems={wardSummary?.totalPatients || 0}
            itemsPerPageText={"Patients per page"}
          />
        </div>
      </div>
    </div>
  );
};

CareViewPatients.propTypes = {
  callbacks: PropTypes.object,
};
