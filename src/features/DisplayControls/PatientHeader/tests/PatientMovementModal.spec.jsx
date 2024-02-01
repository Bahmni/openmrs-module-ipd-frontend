import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import PatientMovementModal from "../components/PatientMovementModal";
import {
  byFullySpecifiedNameForDispoistionMockData,
  byFullySpecifiedNameForAdtNotesMockData,
  visitSummaryToAdmitMockData,
  visitSummaryToDischargeOrTransferMockData,
  visitSummaryToUndoDischargeMockData,
  vistAndEncounterTypesMockData,
  patientResponseData,
} from "./PatientMovementModalMockData";
import { IPDContext } from "../../../../context/IPDContext";
import { getADTDashboardUrl } from "../../../../utils/CommonUtils";
 
const mockSearchConceptsByFSN = jest.fn();
const mockFetchVisitSummary = jest.fn();
const mockFetchVisitEncounterOrderTypes = jest.fn();
const mockUpdatePatientMovement = jest.fn();
const mockDischargePatient = jest.fn();
const mockUndoDischargePatient = jest.fn();

const patientMock = {"uuid": "patientMockUuid"};
const visitMock = "visitMockUuid";
const locationMock = "locationMockUuid";
const providerMock = "providerMockUuid";
const patientPayload = {
  "patientUuid": patientMock ,
  "encounterTypeUuid": "encounterMockUuid",
  "visitTypeUuid": visitMock,
  "observations": [
    {
      "concept": {
        "uuid": "uuid",
        "name": "Adt Notes",
        "dataType": "Text"
      },
      "label": "Adt Notes",
      "value": "Admitted",
      "autocompleteValue": "Admitted",
      "conceptSetName": "Adt Notes"
    }
  ]
};

jest.mock("../../../../utils/CommonUtils", () => {
  const originalCommonModule = jest.requireActual("../../../../utils/CommonUtils");
  return {
    ...originalCommonModule,
    searchConceptsByFSN: () => mockSearchConceptsByFSN("byFullySpecified", "Disposition", "custom:(uuid,name)"),
    fetchVisitEncounterOrderTypes: () => mockFetchVisitEncounterOrderTypes(),
  };
});

jest.mock("../utils/PatientMovementModalUtils", () => {
  const originalModule = jest.requireActual("../utils/PatientMovementModalUtils");
  return {
    ...originalModule,
    fetchVisitSummary: () => mockFetchVisitSummary(visitMock),
    updatePatientMovement: () => mockUpdatePatientMovement(patientPayload),
    dischargePatient: () => mockDischargePatient(patientPayload),
    undoDischargePatient: () => mockUndoDischargePatient(),
  };
});


describe("PatientMovementModal", () => {
  beforeEach(() => {
    mockSearchConceptsByFSN.mockResolvedValueOnce(byFullySpecifiedNameForDispoistionMockData).mockResolvedValueOnce(byFullySpecifiedNameForAdtNotesMockData);
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToAdmitMockData);
    mockFetchVisitEncounterOrderTypes.mockResolvedValue(vistAndEncounterTypesMockData);
    mockUpdatePatientMovement.mockResolvedValueOnce(patientResponseData);
    mockDischargePatient.mockResolvedValueOnce(patientResponseData);
    mockUndoDischargePatient.mockResolvedValueOnce(patientResponseData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display patient movement modal", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    await waitFor(() => expect(screen.getByText("Patient Movement")).toBeTruthy());
  });

  it("should display patient movement modal with a dropdown", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Choose an option")).toBeTruthy();
    });
  }); 

  it("should display patient movement modal with a text area", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter ADT Notes")).toBeTruthy();
    });
  }); 

  it("should close the patient modal when close icon is clicked", async () => {
    const closeMethod = jest.fn();
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={closeMethod}/></IPDContext.Provider>);

    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    const closeButton = screen.getByRole('button', {name: "close"});
    expect(closeButton).toBeTruthy()
    fireEvent.click(closeButton);
    expect(closeMethod).toBeCalledTimes(1);
  });

  it("should close the patient modal when cancel button is clicked", async () => {
    const cancelMethod = jest.fn();
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={cancelMethod}/></IPDContext.Provider>);

    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeTruthy()
    fireEvent.click(cancelButton);
    expect(cancelMethod).toBeCalledTimes(1);
  });

  it('should display patient movement modal with a admit dropdown', async () => {

    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Admit Patient")).toBeTruthy();
    
  });

  it('should save patient movement modal for admit patient', async () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "/bahmni/adt/#/patient/patientMockUuid/visit/visitMockUuid/encounter/encounterUuid/bed"
      },
    });
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
       await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeTruthy();
      });
      
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Admit Patient")).toBeTruthy();
    fireEvent.click(screen.getByText("Admit Patient"));
    expect(saveButton.disabled).toEqual(false);
    
    const addNotes = screen.getByPlaceholderText("Enter ADT Notes");
    fireEvent.click(addNotes);
    fireEvent.change(addNotes, { target: { value: "Admitted" } });
    expect(addNotes.value).toEqual("Admitted");
    
    expect(saveButton.disabled).toEqual(false);
    fireEvent.click(saveButton);
    expect(mockUpdatePatientMovement).toHaveBeenCalledTimes(1);

    const expectedUrl = getADTDashboardUrl("patientMockUuid", visitMock, "encounterUuid");
    expect(window.location.href).toBe(expectedUrl);

  });
  
  it('should display patient movement modal with a discharge and transfer dropdown', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToDischargeOrTransferMockData);
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Discharge Patient")).toBeTruthy();
    expect(screen.getByText("Transfer Patient")).toBeTruthy();
  });

  it('should save patient movement modal for discharge patient', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToDischargeOrTransferMockData);
    const dischargeMethodCall = jest.fn();
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={dischargeMethodCall}/></IPDContext.Provider>);
       await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeTruthy();
      });
      
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Discharge Patient")).toBeTruthy();
    fireEvent.click(screen.getByText("Discharge Patient"));
    expect(saveButton.disabled).toEqual(false);
    
    const addNotes = screen.getByPlaceholderText("Enter ADT Notes");
    fireEvent.click(addNotes);
    fireEvent.change(addNotes, { target: { value: "Discharged" } });
    expect(addNotes.value).toEqual("Discharged");
    
    expect(saveButton.disabled).toEqual(false);
    fireEvent.click(saveButton);
    expect(mockDischargePatient).toHaveBeenCalledTimes(1);
  });

  it('should save patient movement modal for transfer patient', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToDischargeOrTransferMockData);
    Object.defineProperty(window, "location", {
      value: {
        href: "/bahmni/adt/#/patient/patientMockUuid/visit/visitMockUuid/encounter/encounterUuid/bed"
      },
    });
    const transferMethodCall = jest.fn();
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={transferMethodCall}/></IPDContext.Provider>);
       await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeTruthy();
      });
      
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Transfer Patient")).toBeTruthy();
    fireEvent.click(screen.getByText("Transfer Patient"));
    expect(saveButton.disabled).toEqual(false);
    
    expect(screen.queryByText("Enter ADT Notes")).toBeNull();

    expect(saveButton.disabled).toEqual(false);
    fireEvent.click(saveButton);
    expect(mockUpdatePatientMovement).toHaveBeenCalledTimes(1);
    const expectedUrl = getADTDashboardUrl("patientMockUuid", visitMock, patientResponseData.data.encounterUuid);
    expect(window.location.href).toBe(expectedUrl);
  });

  it('should display patient movement modal with a undo discharge dropdown', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToUndoDischargeMockData);
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Undo Discharge")).toBeTruthy();
  });

  it('should save patient movement modal for undo discharge patient', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToUndoDischargeMockData);
    Object.defineProperty(window, "location", {
      value: {
        href: "/bahmni/adt/#/patient/patientMockUuid/visit/visitMockUuid/encounter/encounterUuid/bed"
      },
    });
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
       await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeTruthy();
      });
      
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    const chooseDropdown = screen.getByText("Choose an option")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Undo Discharge")).toBeTruthy();
    fireEvent.click(screen.getByText("Undo Discharge"));
    expect(saveButton.disabled).toEqual(false);
    
    expect(screen.queryByText("Enter ADT Notes")).toBeNull();
    
    expect(saveButton.disabled).toEqual(false);
    fireEvent.click(saveButton);
    expect(mockUndoDischargePatient).toHaveBeenCalledTimes(1);
    const expectedUrl = getADTDashboardUrl("patientMockUuid", visitMock, patientResponseData.data.encounterUuid);
    expect(window.location.href).toBe(expectedUrl);
  });
});
