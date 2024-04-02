import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/CareViewPatientsHeader.scss";
import { IPD_WARD_SEARCH_PLACEHOLDER_TEXT, displayShiftTimings12HourFormat, displayShiftTimingsFormat } from "../../../constants";
import { Dropdown, Search, Button } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16, Time16 } from "@carbon/icons-react";
import { formatDate } from "../../../utils/DateTimeUtils";
import { items } from "../utils/constants";

export const CareViewPatientsHeader = (props) => {
  const {
    handleKeyPress,
    handleClear,
    searchValue,
    updateSearchValue,
    navHourEpoch,
    navButtonsDisabled,
    handleNow,
    handleNext,
    handlePrevious,
    enable24HourTime,
    filterValue,
    setFilterValue,
  } = props;
  const handleSearchOnChange = (e) => {
    updateSearchValue(e.target.value);
  };

  useEffect(() => {
    handleNow();
  }, []);

const shiftTiming = () => {
  const  shiftTimingsFormat  = enable24HourTime ? displayShiftTimingsFormat : displayShiftTimings12HourFormat;
  let shiftStartDateTime = formatDate(
    navHourEpoch.startHourEpoch * 1000,
    shiftTimingsFormat
  );
  console.log("shift", shiftStartDateTime);
  let shiftEndDateTime = formatDate(
    navHourEpoch.endHourEpoch * 1000 - 60,
    shiftTimingsFormat
  );
  const [shiftStartDate, shiftStartTime] = shiftStartDateTime.split(" | ");
  const [shiftEndDate, shiftEndTime] = shiftEndDateTime.split(" | ");
   
    if(shiftStartDate === shiftEndDate){ 
      return(<div className="shift-time">
      {shiftStartDate} <span className="navigation-time" data-testid="navigation-time">|</span> <Time16 />{" "}
      {shiftStartTime} <span className="to-text">to</span>{" "}
      <Time16 /> {shiftEndTime}
    </div>);
    }
    else {
      return(<div className="shift-time">
      {shiftStartDate} <span className="navigation-time" data-testid="navigation-time">|</span> <Time16 />{" "}
      {shiftStartTime} <span className="to-text">to</span>{" "}{shiftEndDate}
      <Time16 /> {shiftEndTime}
    </div>);
    }
}
  return (
    <div className="task-type">
      {/* nursingTask-shift-header */}
      <div className="navigation-header">
        <Button
          kind="tertiary"
          size="sm"
          onClick={handleNow}
          className="now-button"
          data-testid="now-button"
        >
          <span className="now-button-text">
            <FormattedMessage id={"CURRENT_SHIFT"} defaultMessage={"Current Shift"} />
          </span>
        </Button>
        <Button
          renderIcon={ChevronLeft16}
          kind="tertiary"
          hasIconOnly
          size="sm"
          onClick={handlePrevious}
          data-testid="previous-button"
          disabled={navButtonsDisabled.previous}
        />
        <Button
          renderIcon={ChevronRight16}
          kind="tertiary"
          hasIconOnly
          size="sm"
          onClick={handleNext}
          className="margin-right-10"
          data-testid="next-button"
          disabled={navButtonsDisabled.next}
        />
        {shiftTiming()}
      </div>
      <div className= "search-and-tasklist"> 
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
        selectedItem={filterValue}
        items={items}
        itemToString={(item) => (item ? item.text : "")}
        onChange={(event) => {
          event.selectedItem
            ? setFilterValue(event.selectedItem)
            : setFilterValue(items[2]);
        }}
        light={true}
      />
      </div>
    </div>
  );

};

CareViewPatientsHeader.propTypes = {
  handleKeyPress: PropTypes.func,
  handleClear: PropTypes.func,
  searchValue: PropTypes.string,
  updateSearchValue: PropTypes.func,
  navHourEpoch: PropTypes.object,
  navButtonsDisabled: PropTypes.object,
  handleNow: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
  filterValue: PropTypes.object,
  setFilterValue: PropTypes.func,
};
