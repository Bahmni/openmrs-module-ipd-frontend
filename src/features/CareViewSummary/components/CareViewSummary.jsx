import React from "react";
import "../styles/CareViewSummary.scss";
import { Dropdown, Tile } from "carbon-components-react";

export const CareViewSummary = () => {
  return (
    <div className="care-view-summary">
      <Dropdown
        id="default"
        label="Dropdown menu options"
        items={["Option 1", "Option 2", "Option 3"]}
        itemToString={(item) => (item ? item.text : "")}
      />
      <div className="summary-tiles">
        <Tile className="summary-tile">Patient Tile 1</Tile>
        <Tile className="summary-tile">Patient Tile 2</Tile>
        <Tile className="summary-tile">Patient Tile 3</Tile>
        <Tile className="summary-tile">Patient Tile 4</Tile>
      </div>
    </div>
  );
};
