import {
  fetchMedicationNursingTasks,
  GetUTCEpochForDate,
  ExtractMedicationNursingTasksData,
  saveAdministeredMedication,
} from "../utils/NursingTasksUtils";
import axios from "axios";
import {
  mockResponse,
  mockNursingTasksResponse,
  mockExtractedMedicationNursingTasksData,
  mockNursingTasksResponseForCompleted,
  mockExtractedMedicationNursingTasksDataForCompleted,
  mockNursingTasksResponseForMissed,
  mockNursingTasksResponseForAllTasks,
  mockExtractedMedicationNursingTasksDataForAllTasks,
  mockNursingTasksResponseForStopped,
  mockExtractedMedicationNursingTasksDataForStopped,
  mockExtractedMedicationNursingTasksDataForMissed,
} from "./NursingTasksUtilsMockData";

jest.mock("axios");

describe("NursingTasksUtils", () => {
  describe("fetchMedicationNursingTasks", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should make axios get call with url", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));

      const patientUuid = "test-uuid";
      const startTime = "1690906550";
      const endTime = "1690906550";
      const visitUuid = "test-uuid";
      const expectedUrl = `/openmrs/ws/rest/v1/ipd/schedule/type/medication?patientUuid=${patientUuid}&startTime=${startTime}&endTime=${endTime}&visitUuid=${visitUuid}`;
      await fetchMedicationNursingTasks(
        patientUuid,
        startTime,
        endTime,
        visitUuid
      );
      expect(axios.get).toHaveBeenCalledWith(expectedUrl);
    });

    it("should return response data", async () => {
      axios.get.mockImplementation(() => Promise.resolve(mockResponse));
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      const response = await fetchMedicationNursingTasks(patientUuid, forDate);
      expect(response).toEqual(mockResponse.data);
    });
    it("should reject with error", async () => {
      const error = new Error("Error while fetching medications");
      axios.get.mockRejectedValue(error);
      const patientUuid = "test-uuid";
      const forDate = "1690906550";
      try {
        await fetchMedicationNursingTasks(patientUuid, forDate);
      } catch (e) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(e).toEqual(error);
      }
    });
  });

  describe("GetUTCEpochForDate", () => {
    it("should return UTC epoch for date", () => {
      const date = "2021-08-31";
      const expectedEpoch = 1630368000;
      const epoch = GetUTCEpochForDate(date);
      expect(epoch).toEqual(expectedEpoch);
    });
  });

  describe("ExtractMedicationNursingTasksData", () => {
    it("should return extracted data", () => {
      const medicationNursingTasksData = mockNursingTasksResponse;
      const expectedData = mockExtractedMedicationNursingTasksData;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "pending", text: "Pending" }
      );
      expect(extractedData).toEqual(expectedData);
    });

    it("should return extracted data for completed as empty", () => {
      const medicationNursingTasksData = mockNursingTasksResponse;
      const expectedData = [];
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "completed", text: "Completed" }
      );
      expect(extractedData).toEqual(expectedData);
    });

    it("should return extracted data for completed sorted in ascending order", () => {
      const medicationNursingTasksData = mockNursingTasksResponseForCompleted;
      const expectedData = mockExtractedMedicationNursingTasksDataForCompleted;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "completed", text: "Completed" }
      );
      expect(extractedData).toEqual(expectedData);
    });

    it("should return extracted data for stopped sorted in ascending order", () => {
      const medicationNursingTasksData = mockNursingTasksResponseForStopped;
      const expectedData = mockExtractedMedicationNursingTasksDataForStopped;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "stopped", text: "Stopped" }
      );
      expect(extractedData).toEqual(expectedData);
    });

    it("should return extracted data for all task", () => {
      const medicationNursingTasksData = mockNursingTasksResponseForAllTasks;
      const expectedData = mockExtractedMedicationNursingTasksDataForAllTasks;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "allTasks", text: "All Tasks" }
      );
      expect(extractedData).toEqual(expectedData);
    });

    it("should return extracted data for missed sorted in ascending order", () => {
      const medicationNursingTasksData = mockNursingTasksResponseForMissed;
      const expectedData = mockExtractedMedicationNursingTasksDataForMissed;
      const extractedData = ExtractMedicationNursingTasksData(
        medicationNursingTasksData,
        { id: "missed", text: "Missed" }
      );
      expect(extractedData).toEqual(expectedData);
    });
  });

  describe("ExtractMedicationNursingTasksData - variable dose slots", () => {
    const makeVariableDoseSlot = (sequence) => ({
      uuid: "slot-uuid-vd",
      startTime: 1704785404,
      status: "SCHEDULED",
      variableDosageSequence: sequence,
      order: {
        uuid: "order-vd",
        drug: { display: "Prednisolone" },
        drugNonCoded: null,
        dose: null,
        doseUnits: { display: "Tablet(s)" },
        route: { display: "Oral" },
        duration: 5,
        durationUnits: { display: "Day(s)" },
        dosingInstructions: JSON.stringify([
          {
            sequence: 1,
            text: "Loading Dose",
            timing: { code: { text: "Once" } },
            doseAndRate: [{ doseQuantity: { value: 5, unit: "Tablet(s)" } }],
            extension: [{ url: "isLoadingDose", valueBoolean: true }],
          },
          {
            sequence: 2,
            text: "Stage 1",
            timing: {
              code: { text: "Once a day" },
              repeat: { duration: 3, durationUnit: "d" },
            },
            doseAndRate: [{ doseQuantity: { value: 3, unit: "Tablet(s)" } }],
            extension: [{ url: "isLoadingDose", valueBoolean: false }],
          },
        ]),
        asNeeded: false,
        frequency: null,
        dateStopped: null,
        autoExpireDate: null,
      },
      medicationAdministration: null,
      serviceType: "MedicationRequest",
    });

    const mockVDNursingData = [{ slots: [makeVariableDoseSlot(2)] }];

    it("extracts stage-specific dose from FHIR dosages for variable dose slot (sequence=2 → 3 Tablet(s))", () => {
      const result = ExtractMedicationNursingTasksData(
        mockVDNursingData,
        { id: "allTasks" },
        false
      );
      // allTasks pending SCHEDULED slot
      const allSlots = result.flat();
      const slot = allSlots.find((s) => s.uuid === "slot-uuid-vd");
      expect(slot).toBeDefined();
      expect(slot.dosage).toBe(3);
      expect(slot.doseType).toBe("Tablet(s)");
    });

    it("extracts stage-specific frequency from FHIR dosages", () => {
      const result = ExtractMedicationNursingTasksData(
        mockVDNursingData,
        { id: "allTasks" },
        false
      );
      const allSlots = result.flat();
      const slot = allSlots.find((s) => s.uuid === "slot-uuid-vd");
      expect(slot.dosingInstructions.frequency).toBe("Once a day");
    });

    it("falls through to existing logic when variableDosageSequence is null", () => {
      const regularSlot = {
        uuid: "slot-uuid-regular",
        startTime: 1704785404,
        status: "SCHEDULED",
        variableDosageSequence: null,
        order: {
          uuid: "order-regular",
          drug: { display: "Paracetamol" },
          drugNonCoded: null,
          dose: 10,
          doseUnits: { display: "Tablet(s)" },
          route: { display: "Oral" },
          duration: 3,
          durationUnits: { display: "Day(s)" },
          dosingInstructions: "{}",
          asNeeded: false,
          frequency: null,
          dateStopped: null,
          autoExpireDate: null,
        },
        medicationAdministration: null,
        serviceType: "MedicationRequest",
      };
      const result = ExtractMedicationNursingTasksData(
        [{ slots: [regularSlot] }],
        { id: "allTasks" },
        false
      );
      const allSlots = result.flat();
      const slot = allSlots.find((s) => s.uuid === "slot-uuid-regular");
      expect(slot).toBeDefined();
      expect(slot.dosage).toBe(10);
      expect(slot.doseType).toBe("Tablet(s)");
    });
  });

  describe("saveMedicationNursingTask", () => {
    it("should save administered medication successfully", async () => {
      const administeredMedication = [
        {
          patientUuid: "4399dcf6-0e47-42a0-8eb1-ee5b06de4bdc",
          orderUuid: "e19c0bbf-a960-4ccc-8f82-923be87c5784",
          providers: [
            {
              providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
              function: "Performer",
            },
          ],
          notes: [],
          status: "completed",
          slotUuid: "f22b1b11-ae2f-40d9-bc25-a0233ffd9435",
          administeredDateTime: 1703670985,
        },
      ];

      axios.post.mockResolvedValueOnce({
        status: 200,
        data: { message: "Medication task(s) updated successfully" },
      });

      const response = await saveAdministeredMedication(administeredMedication);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        message: "Medication task(s) updated successfully",
      });
    });

    it("should handle error during medication save", async () => {
      const administeredMedication = [
        {
          patientUuid: "4399dcf6-0e47-42a0-8eb1-ee5b06de4bdc",
          orderUuid: "e19c0bbf-a960-4ccc-8f82-923be87c5784",
          providers: [
            {
              providerUuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
              function: "Performer",
            },
          ],
          notes: [],
          status: "completed",
          slotUuid: "f22b1b11-ae2f-40d9-bc25-a0233ffd9435",
          administeredDateTime: 1703670985,
        },
      ];

      axios.post.mockRejectedValueOnce({
        response: { status: 500, data: { error: "Internal Server Error" } },
      });

      const response = await saveAdministeredMedication(administeredMedication);

      expect(response).toEqual({
        status: 500,
        data: { error: "Internal Server Error" },
      });
    });
  });

  describe("ExtractMedicationNursingTasksData - intraday orders", () => {
    it("sets intradayDoseString on slotInfo for a slot with intraday dosingInstructions", () => {
      const intradayTaskData = [
        {
          slots: [
            {
              id: 1,
              uuid: "intraday-slot-uuid",
              serviceType: "MedicationRequest",
              status: "SCHEDULED",
              startTime: 1690906550,
              order: {
                uuid: "intraday-order-uuid",
                drug: { display: "Prednisolone" },
                route: { display: "Oral" },
                dose: null,
                doseUnits: { display: "mg" },
                duration: 5,
                durationUnits: { display: "Day(s)" },
                autoExpireDate: 1691791200000,
                asNeeded: false,
                frequency: null,
                dosingInstructions: JSON.stringify({
                  morningDose: 10,
                  afternoonDose: 0,
                  eveningDose: 30,
                  nightDose: 10,
                }),
              },
            },
          ],
        },
      ];

      const filterValue = { id: "pending" };
      const result = ExtractMedicationNursingTasksData(intradayTaskData, filterValue, false);
      const slotInfo = result[0][0];
      expect(slotInfo.intradayDoseString).toBe("10-0-30-10 mg - Oral - for 5 Day(s)");
    });

    it("sets intradayDoseString to null for non-intraday orders", () => {
      const regularTaskData = [
        {
          slots: [
            {
              id: 1,
              uuid: "regular-slot-uuid",
              serviceType: "MedicationRequest",
              status: "SCHEDULED",
              startTime: 1690906550,
              order: {
                uuid: "regular-order-uuid",
                drug: { display: "Paracetamol" },
                route: { display: "Oral" },
                dose: 25,
                doseUnits: { display: "mg" },
                duration: 3,
                durationUnits: { display: "Day(s)" },
                autoExpireDate: 1691791200000,
                asNeeded: false,
                frequency: { display: "Once a day" },
                dosingInstructions: JSON.stringify({ instructions: "After meals" }),
              },
            },
          ],
        },
      ];

      const filterValue = { id: "pending" };
      const result = ExtractMedicationNursingTasksData(regularTaskData, filterValue, false);
      const slotInfo = result[0][0];
      expect(slotInfo.intradayDoseString).toBeNull();
    });
  });
});
