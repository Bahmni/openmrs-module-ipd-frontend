import React from "react";
import "../styles/CareViewPatients.scss";
import { Accordion, AccordionItem, Dropdown } from "carbon-components-react";

export const CareViewPatients = () => {
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
        <Accordion className="patient-section">
          <AccordionItem title="Patient 1">Patient 1</AccordionItem>
          <AccordionItem title="Patient 2">Patient 2</AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
