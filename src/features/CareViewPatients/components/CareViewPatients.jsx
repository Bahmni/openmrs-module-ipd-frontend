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
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [patientList, setPatientList] = useState([]);
  const getPatientsList = async () => {
    const response = await fetchPatientsList(selectedWard.value, offset, 100);
    if (response.status === 200 && response.data?.totalPatients) {
      const { admittedPatients } = response.data;
      setPatientList(admittedPatients || []);
    }
    callbacks.setIsLoading(false);
  };
  useEffect(() => {
    callbacks.setIsLoading(true);
    if (selectedWard.value) {
      getPatientsList(0);
    }
  }, [selectedWard, offset, limit]);
  console.log(offset, patientList, wardSummary);
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
            onChange={(e) => {
              console.log("On Change", e);
              setOffset((e.page - 1) * e.pageSize);
              setLimit(e.pageSize);
            }}
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
