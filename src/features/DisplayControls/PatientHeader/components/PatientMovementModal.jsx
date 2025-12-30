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
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

const PatientMovementModal = (props) => {
  const intl = useIntl();
  const { updatePatientMovementModal } = props;
  const { patient, visit, location, provider } = useContext(IPDContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dropDown, setDropDown] = useState([]);
  const [visitSummary, setVisitSummary] = useState({});
  const [selectedDropDownItem, setSelectedDropDownItem] = useState({});
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
      const items = getDropDown.data.results[0].answers;
      var getVisitSummary = await fetchVisitSummary(visit);
      if (getVisitSummary.status === 200 && items.length > 0) {
        const visitSummaryData = getVisitSummary.data;
        setVisitSummary(visitSummaryData);
        var dropDownList = items.map((item) => {
          if (item.name) {
            if (
              visitSummaryData.admissionDetails === null &&
              visitSummaryData.dischargeDetails === null &&
              item.name.name === intl.formatMessage({ id: "ADMIT_PATIENT" })
            ) {
              const translatedDropdownItem = intl.formatMessage({
                id: "ADMIT_PATIENT",
                defaultMessage: "Admit Patient",
              });
              return { label: translatedDropdownItem, value: translatedDropdownItem };
            } else if (
              visitSummaryData.admissionDetails !== null &&
              visitSummaryData.dischargeDetails !== null &&
              item.name.name === intl.formatMessage({ id: "UNDO_DISCHARGE" })
            ) {
              const translatedDropdownItem = intl.formatMessage({
                id: "UNDO_DISCHARGE",
                defaultMessage: "Undo Discharge",
              });
              return { label: translatedDropdownItem, value: translatedDropdownItem };
            } else if (
              visitSummaryData.admissionDetails !== null &&
              visitSummaryData.dischargeDetails === null &&
              item.name.name === intl.formatMessage({ id: "DISCHARGE_PATIENT" })
            ) {
              const translatedDropdownItem = intl.formatMessage({
                id: "DISCHARGE_PATIENT",
                defaultMessage: "Discharge Patient",
              });
              return { label: translatedDropdownItem, value: translatedDropdownItem };
            } else if (
              visitSummaryData.admissionDetails !== null &&
              visitSummaryData.dischargeDetails === null &&
              item.name.name === intl.formatMessage({ id: "TRANSFER_PATIENT" })
            ) {
              const translatedDropdownItem = intl.formatMessage({
                id: "TRANSFER_PATIENT",
                defaultMessage: "Transfer Patient",
              });
              return { label: translatedDropdownItem, value: translatedDropdownItem };
            }
          }
        });
        dropDownList = dropDownList.filter(function (element) {
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
      if (selectedDropDownItem.name === intl.formatMessage({ id: "ADMIT_PATIENT" })) {
        const response = await updatePatientMovement(createPayload());
        if (response.status === 200) {
          window.location.href = getADTDashboardUrl(
            patient.uuid,
            visit,
            response.data.encounterUuid
          );
        }
      } else if (selectedDropDownItem.name === intl.formatMessage({ id: "DISCHARGE_PATIENT" })) {
        const response = await dischargePatient(createPayload());
        if (response.status === 200) {
          updatePatientMovementModal(false);
        }
      } else if (selectedDropDownItem.name === intl.formatMessage({ id: "UNDO_DISCHARGE" })) {
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
      } else if (selectedDropDownItem.name === intl.formatMessage({ id: "TRANSFER_PATIENT" })) {
        const response = await updatePatientMovement(createPayload());
        if (response.status === 200) {
          window.location.href = getADTDashboardUrl(
            patient.uuid,
            visit,
            response.data.encounterUuid
          );
        }
      }
    }
  };

  const handleSelectOnChange = (e) => {
    var item = {};
    if (e.label === intl.formatMessage({ id: "ADMIT_PATIENT" })) {
      item = {
        name: intl.formatMessage({
                id: "ADMIT_PATIENT",
                defaultMessage: "Admit Patient",
              }),
        encounterType: vistEncounterTypes.encounterTypes.ADMISSION,
      };
      setShowAdtNotes(true);
      setSaveEnable(true);
    } else if (e.label === intl.formatMessage({ id: "UNDO_DISCHARGE" })) {
      item = { name: intl.formatMessage({
                id: "UNDO_DISCHARGE",
                defaultMessage: "Undo Discharge",
              }), encounterType: null };
      setShowAdtNotes(false);
      setSaveEnable(true);
    } else if (e.label === intl.formatMessage({ id: "DISCHARGE_PATIENT" })) {
      item = {
        name: intl.formatMessage({
          id: "DISCHARGE_PATIENT",
          defaultMessage: "Discharge Patient",
        }),
        encounterType: vistEncounterTypes.encounterTypes.DISCHARGE,
      };
      setShowAdtNotes(true);
      setSaveEnable(true);
    } else if (e.label === intl.formatMessage({ id: "TRANSFER_PATIENT" })) {
      item = {
        name: intl.formatMessage({
          id: "TRANSFER_PATIENT",
          defaultMessage: "Transfer Patient",
        }),
        encounterType: vistEncounterTypes.encounterTypes.TRANSFER,
      };
      setShowAdtNotes(false);
      setSaveEnable(true);
    } else {
      setSaveEnable(false);
    }
    setSelectedDropDownItem(item);
  };

  const handleNotesOnChange = (e) => {
    setAdtNotes(e.target.value);
  };

 return (
    <>
      {!isLoading && (
        <Modal
          open
          modalHeading={intl.formatMessage({
            id: "PATIENT_MOVEMENT",
            defaultMessage: "Patient Movement"
          })}
          primaryButtonText={intl.formatMessage({
                id: "SAVE", 
            defaultMessage: "Save"
          })}
          secondaryButtonText={intl.formatMessage({
            id: "CANCEL",
            defaultMessage: "Cancel"
          })}
          aria-label="Modal content"
          onRequestClose={() => updatePatientMovementModal(false)}
          onSecondarySubmit={() => updatePatientMovementModal(false)}
          onRequestSubmit={() => handleOnSave()}
          primaryButtonDisabled={!saveEnable}
        >
          {dropDown == {} ? (
            <DropdownSkeleton />
          ) : (
            <Dropdown
              id="patient-movement-dropdown"
              label={intl.formatMessage({
                id: "CHOOSE_AN_OPTION",
                defaultMessage: "Choose an option"
              })}
              onChange={(e) => handleSelectOnChange(e.selectedItem)}
              isRequired={true}
              width={"100%"}
              items={dropDown}
              itemToString={(item) => (item ? item.label : "")}
            />
          )}
          <br />
          <br />
           {showAdtNotes ? (
            <TextArea
              data-modal-primary-focus
              id="ipd-adt-notes"
              placeholder={intl.formatMessage({
                id: "ENTER_ADT_NOTES", 
                defaultMessage: "Enter ADT Notes"
              })}
              style={{
                marginBottom: "1rem",
              }}
              onChange={(e) => handleNotesOnChange(e)}
            />
          ) : (
            <>
              <br />
              <br />
              <br />
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default PatientMovementModal;

PatientMovementModal.propTypes = {
  updatePatientMovementModal: PropTypes.func.isRequired,
};
