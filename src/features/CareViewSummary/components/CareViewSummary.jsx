import React from "react";
import "../styles/CareViewSummary.scss";
import { Dropdown, Tile } from "carbon-components-react";

export const CareViewSummary = () => {
  return (
    <div className="care-view-summary">
      <Dropdown
        id="default"
        label="Dropdown menu options"
        items={["General Ward (A)", "General Ward (B)", "General Ward (C)"]}
        itemToString={(item) => (item ? item : "")}
        selectedItem={"General Ward (A)"}
      />
      <div className="summary-tiles">
        <Tile className="summary-tile">Total patients</Tile>
        <Tile className="summary-tile">My patients</Tile>
        <Tile className="summary-tile">New patients</Tile>
        <Tile className="summary-tile">Scheduled for OT</Tile>
        <Tile className="summary-tile">To be discharged</Tile>
      </div>
    </div>
  );
};
