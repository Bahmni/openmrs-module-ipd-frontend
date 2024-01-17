import { 
  getDrugOrdersConfig,
  getProviders,
  fetchMedicationConfig,
  saveEmergencyMedication 
} from "../utils/EmergencyTasksUtils";
import axios from "axios";
import {
  DrugOrderConfigMockData,
  MedicationConfigMockData,
  CompleteMedicationConfigMockData,
  providersMockData,
} from "./AddEmergencyTasksMockData";

jest.mock("axios");

describe("EmergencyTasksUtils", () => {

  describe("getDrugOrdersConfig", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should make axios get call with drug order config url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(DrugOrderConfigMockData));

      const expectedUrl = `/openmrs/ws/rest/v1/bahmnicore/config/drugOrders`;
      await getDrugOrdersConfig();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return drug order config response data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(DrugOrderConfigMockData));
      const response = await getDrugOrdersConfig();
      expect(response).toEqual(DrugOrderConfigMockData);
    });

    it("should reject with error", async () => {
      const error = new Error("Error while fetching drug order config");
      axios.get.mockRejectedValue(error);
      try {
        await getDrugOrdersConfig();
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  describe("getProviders", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should make axios get call with custom provider url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(providersMockData));

      const expectedUrl = `/openmrs/ws/rest/v1/provider?v=custom:(person,uuid,retired)&attrName=practitioner_type&attrValue=Doctor`;
      await getProviders();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return provider response data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(providersMockData));
      const response = await getProviders();
      expect(response).toEqual(providersMockData);
    });

    it("should reject with error", async () => {
      const error = new Error("Error while fetching providers");
      axios.get.mockRejectedValue(error);
      try {
        await getProviders();
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e).toEqual(error);
      }
    });
  });

  describe("fetchMedicationConfig", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should make axios get call with medication config url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(CompleteMedicationConfigMockData));

      const expectedUrl = `/bahmni_config/openmrs/apps/clinical/medication.json`;
      await fetchMedicationConfig();
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return medication config data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(CompleteMedicationConfigMockData));
      const response = await fetchMedicationConfig();
      expect(response).toEqual(MedicationConfigMockData);
    });

    it("should reject with error", async () => {
      const error = new Error("Error while fetching medication config");
      axios.get.mockRejectedValue(error);
      try {
        await fetchMedicationConfig();
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });

  describe("saveEmergencyMedication", () => {
    it("should save emergency medication administration successfully", async () => {
      const emergencyMedication =
        {
          patientUuid:"863cae40-9908-4aa3-a1dd-64c084569fb3",
          drugUuid:"7878ffca-00a3-49e4-9cd9-a929a04b5c20",
          dose: 2,
          doseUnitsUuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
          routeUuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
          notes: [
              {
              authorUuid:"c1c26908-3f10-11e4-adec-0800271c1b75",
              text:"Administered as adhoc"
              }
          ],
          providers: [
              {
              providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
              function: "Performer"
              },
              {
              providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
              function: "Witness"
              }
          ],
          status:"completed",
          administeredDateTime:"1704335400"
      };
  
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { message: "Medication task(s) updated successfully" },
      });
  
      const response = await saveEmergencyMedication(emergencyMedication);
  
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Medication task(s) updated successfully",
      });
    });
    
    it("should reject with error", async () => {
      const emergencyMedication = {
        patientUuid:"863cae40-9908-4aa3-a1dd-64c084569fb3",
        drugUuid:"7878ffca-00a3-49e4-9cd9-a929a04b5c20",
        dose: 2,
        doseUnitsUuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
        routeUuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
        notes: [
            {
            authorUuid:"c1c26908-3f10-11e4-adec-0800271c1b75",
            text:"Administered as adhoc"
            }
        ],
        providers: [
            {
            providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            function: "Performer"
            },
            {
            providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            function: "Witness"
            }
        ],
        status:"",
        administeredDateTime:"1704335400"
      };

      const error = { response: { status: 500, data: { error: "Internal Server Error" } } };
      axios.post.mockRejectedValueOnce(error);

      try {
        await saveEmergencyMedication(emergencyMedication);
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});
