import React, { useState, useContext, useEffect } from "react";
import { IPDContext } from "../../../../context/IPDContext";
import {
  fetchVisitSummary,
  updatePatientMovement,
  dischargePatient,
  undoDischargePatient,
} from "../utils/PatientMovementModalUtils";
import {
  searchConceptsByFSN,
  fetchVisitEncounterOrderTypes,
  getADTDashboardUrl,
} from "../../../../utils/CommonUtils";
import {
  FSN_DISPOSITION_VALUE,
  BY_FSN_VALUE,
  CUSTOM_OUTPUT_VALUE,
  FSN_ADT_NOTES_VALUE,
  BAHMNI_VALUE,
} from "../../../../constants";
import {
  Modal,
  TextArea,
  Dropdown,
  DropdownSkeleton,
} from "carbon-components-react";
import "../styles/PatientHeader.scss";
import PropTypes from 'prop-types';
import { drop } from "lodash";

const PatientMovementModal = (props) => {
  const { updatePatientMovementModal } = props;
  const { patient, visit, location, provider } = useContext(IPDContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dropDown, setDropDown] = useState([]);
  const [visitSummary, setVisitSummary] = useState({});
  const [selectedDropDownItem, setSelectedDropDownItem] = useState({});
  const [currentItem, setCurrentItem] = useState({});
  const [adtNotes, setAdtNotes] = useState();
  const [adtNotesObj, setAdtNotesObj] = useState({});
  const [showAdtNotes, setShowAdtNotes] = useState(false);
  const [saveEnable, setSaveEnable] = useState(false);
  const [vistEncounterTypes, setVisitEncounterTypes] = useState({});
  const fetchDropDownValues = async () => {
    setIsLoading(true);
    const getDropDown = await searchConceptsByFSN(
      BY_FSN_VALUE,
      FSN_DISPOSITION_VALUE,
      CUSTOM_OUTPUT_VALUE
    );
    if (getDropDown.status === 200) {
      const items  = getDropDown.data.results[0].answers;
      var getVisitSummary = await fetchVisitSummary(visit);
      if (getVisitSummary.status === 200 && items.length > 0) {
        const visitSummaryData = getVisitSummary.data;
        setVisitSummary(visitSummaryData);
        var dropDownList = items.map((item) => {
          if (item.name) {
            if (
              visitSummaryData.admissionDetails === null &&
              visitSummaryData.dischargeDetails === null &&
              item.name.name === "Admit Patient"
            ) {
              return { label: item.name.display, value: item.name.display };
            } else if (
              visitSummaryData.admissionDetails !== null &&
              visitSummaryData.dischargeDetails !== null &&
              item.name.name === "Undo Discharge"
            ) {
              return { label: item.name.display, value: item.name.display };
            } else if (
              visitSummaryData.admissionDetails !== null &&
              visitSummaryData.dischargeDetails === null &&
              (item.name.name === "Discharge Patient" ||
                item.name.name === "Transfer Patient")
            ) {
              return { label: item.name.display, value: item.name.display };
            }
          }
        });
        dropDownList = dropDownList.filter(function( element ) {
          return element !== undefined;
       });
        setDropDown(dropDownList);
      }
      var getTypes = await fetchVisitEncounterOrderTypes();
      setVisitEncounterTypes(getTypes.data);
      if (getTypes.data) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDropDownValues();
  }, []);

  const fetchAdtNotes = async () => {
    const getAdtNotes = await searchConceptsByFSN(
      BY_FSN_VALUE,
      FSN_ADT_NOTES_VALUE,
      BAHMNI_VALUE
    );
    if (getAdtNotes.status === 200) {
      setShowAdtNotes(true);
      setAdtNotesObj(getAdtNotes.data.results[0]);
    }
  };
  useEffect(() => {
    fetchAdtNotes();
  }, []);

  const createAdtNotesObj = () => {
    const notesObj = {
      concept: {
        uuid: adtNotesObj.uuid,
        name: adtNotesObj.name.name,
        dataType: adtNotesObj.datatype.name,
      },
      units: adtNotesObj.units,
      label: adtNotesObj.name.display,
      possibleAnswers: adtNotesObj.answers,
      groupMembers: adtNotesObj.setMembers,
      comment: null,
      isObservation: true,
      conceptUIConfig: [],
      value: adtNotes,
      autocompleteValue: adtNotes,
      conceptSetName: adtNotesObj.name.name,
    };
    return notesObj;
  };
  const createPayload = () => {
    const observations = adtNotes && showAdtNotes ? [createAdtNotesObj()] : [];
    const obj = {
      patientUuid: patient.uuid,
      encounterTypeUuid: selectedDropDownItem.encounterType,
      visitTypeUuid: vistEncounterTypes.visitTypes.IPD,
      observations: observations,
      locationUuid: location,
      providers: [provider],
    };
    return obj;
  };

  const handleOnSave = async () => {
    if (selectedDropDownItem) {
      setSaveEnable(false);
      if (selectedDropDownItem.name === "Admit Patient") {
        const response = await updatePatientMovement(createPayload());
        if (response.status === 200) {
          window.location.href = getADTDashboardUrl(
            patient.uuid,
            visit,
            response.data.encounterUuid
          );
        }
      } else if (selectedDropDownItem.name === "Discharge Patient") {
        const response = await dischargePatient(createPayload());
        if (response.status === 200) {
          updatePatientMovementModal(false);
        }
      } else if (selectedDropDownItem.name === "Undo Discharge") {
        const response = await undoDischargePatient(
          visitSummary.dischargeDetails.uuid,
          selectedDropDownItem.name
        );
        if (response.status === 200) {
          window.location.href = getADTDashboardUrl(
            patient.uuid,
            visit,
            visitSummary.dischargeDetails.uuid
          );
        }
      } else if (selectedDropDownItem.name === "Transfer Patient") {
        const response = await updatePatientMovement(createPayload());
        if (response.status === 200) {
          window.location.href = getADTDashboardUrl(
            patient.uuid,
            visit,
            response.data.encounterUuid
          );
        }
      }
    } else {
      setSaveEnable(true);
    }
  };

  const handleSelectOnChange = (e) => {
    var item = {};
    setCurrentItem(e);
    setSaveEnable(false);
    if (e.label === "Admit Patient") {
      item = {
        name: "Admit Patient",
        encounterType: vistEncounterTypes.encounterTypes.ADMISSION,
      };
      setShowAdtNotes(true);
    } else if (e.label === "Undo Discharge") {
      item = { name: "Undo Discharge", encounterType: null };
      setShowAdtNotes(false);
    } else if (e.label === "Discharge Patient") {
      item = {
        name: "Discharge Patient",
        encounterType: vistEncounterTypes.encounterTypes.DISCHARGE,
      };
      setShowAdtNotes(true);
    } else if (e.label === "Transfer Patient") {
      item = {
        name: "Transfer Patient",
        encounterType: vistEncounterTypes.encounterTypes.TRANSFER,
      };
      setShowAdtNotes(false);
    } else {
      setSaveEnable(true);
    }
    setSelectedDropDownItem(item);
  };

  const handleNotesOnChange = (e) => {
    setAdtNotes(e.target.value);
  };

  useEffect(() => {
    if (currentItem != {}) {
      setSaveEnable(false);
    }
    else {
      setSaveEnable(true);
    }
  },[currentItem]);
  
  return (
    <>
      {!isLoading && (
        <Modal
          open
          modalHeading="Patient Movement"
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          aria-label="Modal content"
          onRequestClose={() => updatePatientMovementModal(false)}
          onSecondarySubmit={() => updatePatientMovementModal(false)}
          onRequestSubmit={() => handleOnSave()}
          primaryButtonDisabled={saveEnable}
        >
          
          {dropDown == {} ? (
            <DropdownSkeleton />
          ) : (
            <Dropdown
              id="patient-movement-dropdown"
              placeholder={"Choose the patient movement"}
              titleText={""}
              onChange={(e) => handleSelectOnChange(e.selectedItem)}
              isRequired={true}
              width={"100%"}
              items={dropDown}
              itemToString={(item) => (item ? item.label : "")}
              selectedItem={currentItem}
            />
          )}
          &nbsp;&nbsp;
          {!showAdtNotes && (<div style={{height:"50px"}}></div>)}
          {showAdtNotes && (
            <TextArea
              data-modal-primary-focus
              id="ipd-adt-notes"
              placeholder={"Enter " + adtNotesObj.name.display}
              style={{
                marginBottom: "1rem",
              }}
              onChange={(e) => handleNotesOnChange(e)}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default PatientMovementModal;

PatientMovementModal.propTypes = {
  updatePatientMovementModal: PropTypes.func.isRequired
}
