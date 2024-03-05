import React from "react";
import PropTypes from "prop-types";
import "../styles/CareViewPatientsHeader.scss";
import { IPD_WARD_SEARCH_PLACEHOLDER_TEXT } from "../../../constants";
import { Dropdown, Search } from "carbon-components-react";

export const CareViewPatientsHeader = (props) => {
  const { handleKeyPress, handleClear, searchValue, updateSearchValue } = props;

  const handleSearchOnChange = (e) => {
    updateSearchValue(e.target.value);
  };

  return (
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
        light={true}
      />
      <Dropdown
        id="default"
        label="Dropdown menu options"
        items={["All tasks", "Pending", "Done"]}
        itemToString={(item) => (item ? item : "")}
        selectedItem={"All tasks"}
        light={true}
      />
    </div>
  );
};

CareViewPatientsHeader.propTypes = {
  handleKeyPress: PropTypes.func,
  handleClear: PropTypes.func,
  searchValue: PropTypes.string,
  updateSearchValue: PropTypes.func,
};
