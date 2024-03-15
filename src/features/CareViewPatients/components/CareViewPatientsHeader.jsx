import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import "../styles/CareViewPatientsHeader.scss";
import { IPD_WARD_SEARCH_PLACEHOLDER_TEXT } from "../../../constants";
import { Dropdown, Search, Button } from "carbon-components-react";
import { ChevronLeft16, ChevronRight16 } from "@carbon/icons-react";
import { epochTo24HourTimeFormat } from "../../../utils/DateTimeUtils";
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
  } = props;

  const handleSearchOnChange = (e) => {
    updateSearchValue(e.target.value);
  };

  useEffect(() => {
    handleNow();
  }, []);

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
            <FormattedMessage id={"NOW-BUTTON"} defaultMessage={"Now"} />
          </span>
        </Button>
        <Button
          // disabled={isShiftsButtonsDisabled.previous}
          renderIcon={ChevronLeft16}
          kind="tertiary"
          hasIconOnly
          size="sm"
          onClick={handlePrevious}
          className="margin-right-6"
          data-testid="previous-button"
          disabled={navButtonsDisabled.previous}
        />
        <span className="navigation-time" data-testid="navigation-time">
          {epochTo24HourTimeFormat(navHourEpoch.startHourEpoch) +
            " - " +
            epochTo24HourTimeFormat(navHourEpoch.endHourEpoch)}
        </span>
        <Button
          // disabled={isShiftsButtonsDisabled.next}
          renderIcon={ChevronRight16}
          kind="tertiary"
          hasIconOnly
          size="sm"
          onClick={handleNext}
          className="margin-right-10"
          data-testid="next-button"
          disabled={navButtonsDisabled.next}
        />
      </div>
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
  navHourEpoch: PropTypes.object,
  navButtonsDisabled: PropTypes.object,
  handleNow: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrevious: PropTypes.func,
};
