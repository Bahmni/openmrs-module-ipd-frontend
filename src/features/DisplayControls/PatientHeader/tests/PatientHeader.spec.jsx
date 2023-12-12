import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { PatientHeader } from "../components/PatientHeader";




const mockFetchPatientProfile = jest.fn();
const mockContactDetailsConfig  = jest.fn();
const mockFetchAddressMapping = jest.fn();

jest.mock("../utils/PatientHeaderUtils", () => {
  const originalModule = jest.requireActual("../utils/PatientHeaderUtils");
  return {
    ...originalModule,
    fetchPatientProfile: () => mockFetchPatientProfile("123"),
    getConfigsForPatientContactDetails: () => mockContactDetailsConfig(),
    fetchAddressMapping: () => mockFetchAddressMapping()

  };
});


describe("PatientHeader", () => {
  beforeEach(() => {


    mockContactDetailsConfig.mockResolvedValue({
      contactDetails: [
        "residencePhone",
        "mobilePhone",
        "workPhone",
        "otherPhone",
        "email"
    ]
    });
    mockFetchPatientProfile.mockResolvedValue({
     patient: {
       person: {
        preferredName: {
          display: "John Doe",
        },
        age: 30,
        birthdate: "1991-01-01",
        gender: "M",
      "preferredAddress": {
          "display": "Region test",
          "uuid": "a59ae106-3096-49eb-92fe-e3d83c5b84a9",
          "preferred": true,
          "address1": "Region test",
          "address2": "zone test",
          "cityVillage": null,
          "stateProvince": null,
          "country": "Ethiopia",
          "postalCode": null,
          "countyDistrict": null,
          "address3": "W",
          "address4": "Kebele",
          "address5": "13-899",
          "address6": null,
          "startDate": null,
          "endDate": null,
          "latitude": null,
          "longitude": null,
          "voided": false,
          "address7": null,
          "address8": null,
          "address9": null,
          "address10": null,
          "address11": null,
          "address12": null,
          "address13": null,
          "address14": null,
          "address15": null,
      },
      "attributes": [
          {
              "display": "residencePhone = 22222222",
              "uuid": "d462d1c3-6c8c-46e6-bb61-552167455452",
              "value": "22222222",
              "attributeType": {
                  "uuid": "88b2f4fb-65cc-44e5-9c05-e82e8487f65c",
                  "display": "residencePhone",
              },
          },
          {
              "display": "mobilePhone = 999999999",
              "uuid": "1b391322-0694-40d1-923b-95b3b63a15b6",
              "value": "999999999",
              "attributeType": {
                  "uuid": "708b8e27-f7fc-479b-b3cd-f25fe8de0d9c",
                  "display": "mobilePhone",
              },
          },
          {
              "display": "workPhone = 34567890",
              "uuid": "27a67227-bea9-4a84-be67-e4511d63f005",
              "value": "34567890",
              "attributeType": {
                  "uuid": "f8066909-8d23-4914-b55e-fccfb62e4440",
                  "display": "workPhone",
              },
          },
          {
              "display": "otherPhone = 99999999",
              "uuid": "95599a79-886c-4ff8-a0fd-3bd6c7680f4e",
              "value": "99999999",
              "attributeType": {
                  "uuid": "d43bacd2-8162-48e3-927f-e159c308b466",
                  "display": "otherPhone",
              },
          },
          {
              "display": "email = samuel email",
              "uuid": "1e3d7fdb-f4aa-4903-913a-592b18477383",
              "value": "samuel email",
              "attributeType": {
                  "uuid": "fe7f70a1-6c4d-4e2f-b435-f79884fd0031",
                  "display": "email",
              },
          },
        ]},
        identifiers: [
          {
            identifier: "12345",
          },
        ] 
     },
     relationships: [
      {
        "uuid": "5a0a7da5-128f-4311-a39d-d1a2a8eda448",
        "display": "Samuel is the Father of Test",
        "relationshipType": {
          "uuid": "c86d9979-b8ac-4d8c-85cf-cc04e7f16001",
          "display": "Father/Patient"
        },
        "personB": {
          "uuid": "698f8a07-9bb1-429a-a450-5b9867cf80b2",
          "display": "Test Father"
        }
      },
      {
        "uuid": "48aa82ca-3711-40ed-b0f1-bc05013ea803",
        "display": "Samuel is the Mother of Mother",
        "relationshipType": {
          "uuid": "c86d9979-b8ac-4d8c-85cf-cc04e7f16002",
          "display": "Mother/Patient"
        },
        "personB": {
          "uuid": "c732b222-6b9c-494b-ab3d-faea648e004c",
          "display": "Mother Test"
        }
      }
    ]
    })
   mockFetchAddressMapping.mockResolvedValue(
    [
      {
          "name": "Country",
          "addressField": "country",
          "required": false
      },
      {
          "name": "Region",
          "addressField": "address1",
          "required": false
      },
      {
          "name": "Zone",
          "addressField": "address2",
          "required": false
      },
      {
          "name": "Woreda",
          "addressField": "address3",
          "required": false
      },
      {
          "name": "Kebele",
          "addressField": "address4",
          "required": false
      },
      {
          "name": "Address",
          "addressField": "address5",
          "required": false
      }
  ]) 
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render without crashing", () => {
    render(<PatientHeader patientId="123" />);
  });

  it("should call fetchPatientInfo on mount", () => {
    render(<PatientHeader patientId="123" />);
    expect(mockFetchPatientProfile).toHaveBeenCalledWith("123");
  });

  it("should display loading skeleton while fetching data", () => {
    render(<PatientHeader patientId="123" />);
    expect(screen.getByTestId("header-loading")).toBeTruthy();
  });

  it("should display patient details after data is fetched", async () => {
    render(<PatientHeader patientId="123" />);
    await waitFor(() => expect(screen.getByText("John Doe")).toBeTruthy());
    expect(screen.getByText(/30 Years/i)).toBeTruthy();
    expect(screen.getByText("01/01/1991")).toBeTruthy();
    expect(screen.getByText(/12345/i)).toBeTruthy();
  });

  it("should display all details of the patient", async () => {
     const {container} = render(<PatientHeader patientId="123"/>);
    await waitFor(() => 
    expect(screen.getByText("John Doe")).toBeTruthy());
    const showDetailsButton = screen.getByText("Show Details");
    fireEvent.click(showDetailsButton);

    await waitFor (() =>
    {
      expect(screen.getByText(/Country : Ethiopia/i)).toBeTruthy();
      expect(container).toMatchSnapshot();
    })
    // expect(screen.getByText(/Residence Phone : 22222222/i)).toBeTruthy();
    // expect(screen.getByText(/Kebele : Kebele/i)).toBeTruthy();
    // expect(screen.getByText(/Father : Test Father/i)).toBeTruthy();
    // expect(screen.getByText(/Email : samuel email/i)).toBeTruthy();
    // expect(screen.getByText(/Mother : Mother Test/i)).toBeTruthy();

  } )
});
