import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewSummary.scss";
import { Tile } from "carbon-components-react";
import { Dropdown } from "bahmni-carbon-ui";
import propTypes from "prop-types";
import _ from "lodash";
import { fetchWardSummary, getWardDetails } from "../utils/CareViewSummary";
import { FormattedMessage } from "react-intl";
import { CareViewContext } from "../../../context/CareViewContext";

export const CareViewSummary = (props) => {
  const { callbacks } = props;
  const [options, setOptions] = useState([]);
  const { selectedWard, setSelectedWard, wardSummary, setWardSummary } =
    useContext(CareViewContext);
  const getWardList = async () => {
    callbacks.setIsLoading(true);
    const wardList = await getWardDetails();
    const wardOptions = [];
    wardList?.forEach((ward) => {
      wardOptions.push({
        label: ward?.ward?.display,
        value: ward?.ward?.uuid,
      });
    });
    setOptions(wardOptions);
    setSelectedWard(wardOptions[0]);
    callbacks.setIsLoading(false);
  };
  const getWardSummary = async () => {
    callbacks.setIsLoading(true);
    const response = await fetchWardSummary(selectedWard.value);
    if (response.status === 200) {
      setWardSummary(response.data);
    } else {
      setWardSummary({});
    }
    callbacks.setIsLoading(false);
  };
  useEffect(() => {
    getWardList();
  }, []);
  useEffect(() => {
    if (!_.isEmpty(selectedWard)) {
      getWardSummary();
    }
  }, [selectedWard]);
  return (
    <div className="care-view-summary">
      <Dropdown
        id="default"
        label="Dropdown menu options"
        options={options}
        onChange={(e) => {
          if (e) {
            setSelectedWard(e);
          }
        }}
        selectedValue={selectedWard}
        titleText={""}
      />
      <div className="summary-tiles">
        <Tile className="summary-tile">
          <span className={"heading-text"}>
            <FormattedMessage
              id={"TOTAL_PATIENTS"}
              defaultMessage={"Total patients"}
            />
          </span>
          <br />
          <br />
          <span className={"value-text"}>{wardSummary.totalPatients || 0}</span>
        </Tile>
        <Tile className="summary-tile">
          <span className={"heading-text"}>
            <FormattedMessage
              id={"MY_PATIENTS"}
              defaultMessage={"My patients"}
            />
          </span>
          <br />
          <br />
          <span className={"value-text"}>{wardSummary.myPatients || 0}</span>
        </Tile>
        <Tile className="summary-tile">
          <span className={"heading-text"}>
            <FormattedMessage
              id={"NEW_PATIENTS"}
              defaultMessage={"New patients"}
            />
          </span>
          <br />
          <br />
          <span className={"value-text"}>{wardSummary.newPatients || 0}</span>
        </Tile>
        <Tile className="summary-tile">
          <span className={"heading-text"}>
            <FormattedMessage
              id={"SCHEDULED_FOR_OT"}
              defaultMessage={"Scheduled for OT"}
            />
          </span>
          <br />
          <br />
          <span className={"value-text"}>
            {wardSummary.scheduledForOT || 0}
          </span>
        </Tile>
        <Tile className="summary-tile">
          <span className={"heading-text"}>
            <FormattedMessage
              id={"TO_BE_DISCHARGED"}
              defaultMessage={"To be discharged"}
            />
          </span>
          <br />
          <br />
          <span className={"value-text"}>
            {wardSummary.toBeDischarged || 0}
          </span>
        </Tile>
      </div>
    </div>
  );
};

CareViewSummary.propTypes = {
  callbacks: propTypes.object,
};
