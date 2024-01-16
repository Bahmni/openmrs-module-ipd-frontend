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
} from "./PatientMovementModalMockData";
import { IPDContext } from "../../../../context/IPDContext";
 
const mockSearchConceptsByFSN = jest.fn();
const mockFetchVisitSummary = jest.fn();
const mockFetchVisitEncounterOrderTypes = jest.fn();
const mockSearchConceptsByFSNForAdtNotes = jest.fn();
// const mockUpdatePatientMovement = jest.fn();
// const mockDischargePatient = jest.fn();
// const mockUndoDischargePatient = jest.fn();


const patientMock = "patientMockUuid";
const visitMock = "visitMockUuid";
const locationMock = "locationMockUuid";
const providerMock = "providerMockUuid";

jest.mock("../../../../utils/CommonUtils", () => {
  const originalCommonModule = jest.requireActual("../../../../utils/CommonUtils");
  return {
    ...originalCommonModule,
    searchConceptsByFSN: () => mockSearchConceptsByFSN("byFullySpecified", "Disposition", "custom:(uuid,name)"),
    fetchVisitEncounterOrderTypes: () => mockFetchVisitEncounterOrderTypes(),
    // searchConceptsByFSN: () => mockSearchConceptsByFSNForAdtNotes("byFullySpecified", "AdtNotes", "bahmni"),
    // updatePatientMovement: () => mockUpdatePatientMovement(),
    // dischargePatient: () => mockDischargePatient(),
    // undoDischargePatient: () => mockUndoDischargePatient(),
  };
});

jest.mock("../utils/PatientMovementModalUtils", () => {
  const originalModule = jest.requireActual("../utils/PatientMovementModalUtils");
  return {
    ...originalModule,
    fetchVisitSummary: () => mockFetchVisitSummary(visitMock),
    // updatePatientMovement: () => mockUpdatePatientMovement(),
    // dischargePatient: () => mockDischargePatient(),
    // undoDischargePatient: () => mockUndoDischargePatient(),
  };
});


describe("PatientMovementModal", () => {
  beforeEach(() => {
    mockSearchConceptsByFSN.mockResolvedValueOnce(byFullySpecifiedNameForDispoistionMockData).mockResolvedValueOnce(byFullySpecifiedNameForAdtNotesMockData);
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToAdmitMockData);
    mockFetchVisitEncounterOrderTypes.mockResolvedValue(vistAndEncounterTypesMockData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display patient movement modal", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    // render(<PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/>);

    await waitFor(() => expect(screen.getByText("Patient Movement")).toBeTruthy());
  });

  it("should display patient movement modal with a dropdown", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Select")).toBeTruthy();
      expect(screen.getByText("Choose the patient movement")).toBeTruthy();
     
    });
  }); 

  it("should display patient movement modal with a text area", async () => {
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter Adt Notes")).toBeTruthy();
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
    expect(screen.getByText("Admit Patient")).toBeTruthy();
    
  });

  it('should save patient movement modal for admit patient', async () => {
    const { container } = render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
       await waitFor(() => {
        expect(screen.getByText("Patient Movement")).toBeTruthy();
      });
      
    const saveButton = screen.getByText("Save");
    expect(saveButton.disabled).toEqual(true);

    
    // screen.debug();
    const chooseDropdown = screen.getByText("Choose the patient movement")
    fireEvent.click(chooseDropdown);
    expect(screen.getByText("Admit Patient")).toBeTruthy();
    fireEvent.click(screen.getByText("Admit Patient"));
    expect(saveButton.disabled).toEqual(false);
    
    // const addNotes = screen.getByRole('textbox');
    // fireEvent.change(addNotes, { target: { value: "Adt Notes" } });
    // expect(addNotes.value).toEqual("Adt Notes");
    
    // expect(saveButton.disabled).toEqual(false);
    //fireEvent.click(saveButton);
    // check whether that is updatePatient method is called
  });

  it('should display patient movement modal with a discharge and transfer dropdown', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToDischargeOrTransferMockData);
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    expect(screen.getByText("Discharge Patient")).toBeTruthy();
    expect(screen.getByText("Transfer Patient")).toBeTruthy();
  });

  // it('should save patient movement modal for discharge patient', async () => {
  
  // });

  // it('should save patient movement modal for transfer patient', async () => {
  
  // });

  it('should display patient movement modal with a undo discharge dropdown', async () => {
    mockFetchVisitSummary.mockResolvedValue(visitSummaryToUndoDischargeMockData);
    render(<IPDContext.Provider value={{patient: patientMock, visit: visitMock, location: locationMock, provider: providerMock}}>
      <PatientMovementModal updatePatientMovementModal={()=> jest.fn()}/></IPDContext.Provider>);
    
    await waitFor(() => {
      expect(screen.getByText("Patient Movement")).toBeTruthy();
    });
    expect(screen.getByText("Undo Discharge")).toBeTruthy();
  });

  // it('should save patient movement modal for undo discharge patient', async () => {
  
  // });

   

  // it("should render without crashing", () => {
  //   render(<PatientHeader patientId="123" />);
  // });

  // it("should call fetchPatientInfo on mount", () => {
  //   render(<PatientHeader patientId="123" />);
  //   expect(mockFetchPatientProfile).toHaveBeenCalledWith("123");
  // });

  // it("should display loading skeleton while fetching data", () => {
  //   render(<PatientHeader patientId="123" />);
  //   expect(screen.getByTestId("header-loading")).toBeTruthy();
  // });

  // it("should display patient details after data is fetched", async () => {
  //   render(<PatientHeader patientId="123" />);
  //   await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
  //   expect(screen.getByText(/30 Years/i)).toBeTruthy();
  //   expect(screen.getByText("01/01/1991")).toBeTruthy();
  //   expect(screen.getByText(/12345/i)).toBeTruthy();
  // });

  // it("should display all details of the patient", async () => {
  //   const { container } = render(<PatientHeader patientId="123" />);
  //   await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
  //   const showDetailsButton = screen.getByText("Show Details");
  //   fireEvent.click(showDetailsButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/Country : Ethiopia/i)).toBeTruthy();
  //     expect(container).toMatchSnapshot();
  //   });
  // });

  // it("should display patient movement item on click of overflow menu icon", async () => {
  //   const { container } = render(<PatientHeader patientId="123" />);
  //   await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
  //   screen.getByTestId("overflow-menu").click();
  //   expect(screen.getByText("Patient Movement")).toBeTruthy();
  //   expect(container).toMatchSnapshot();
  // });
});
