export const drugChartData = [
  {
    uuid: "6a41be7c-7418-41dd-8ac0-5675f252d69b",
    name: "Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension",
    dosingInstructions: {
      route: "Topical",
      dosage: "10mg",
      asNeeded: false,
      frequency: "Three times a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "5 Day(s)",
    slots: [
      {
        id: 55,
        uuid: "34f88276-0ad0-47dc-b270-4be75e295d09",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1706495400,
        order: {
          uuid: "6a41be7c-7418-41dd-8ac0-5675f252d69b",
          orderNumber: "ORD-22814",
          accessionNumber: null,
          patient: {
            uuid: "8f7c45d9-ec2b-411e-82b4-3b19fb2eb60e",
            display: "ET55749 - IPD New Patient",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/8f7c45d9-ec2b-411e-82b4-3b19fb2eb60e",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "0e3e9f9a-0e0c-192a-0f6c-2c0d09563014",
            display: "Amoxicillin/Clavulanic Acid",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/0e3e9f9a-0e0c-192a-0f6c-2c0d09563014",
                resourceAlias: "concept",
              },
            ],
          },
          action: "NEW",
          careSetting: {
            uuid: "c365e560-c3ec-11e3-9c1a-0800200c9a66",
            name: "Inpatient",
            description: "In-patient care setting",
            retired: false,
            careSettingType: "INPATIENT",
            display: "Inpatient",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66",
                resourceAlias: "caresetting",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66?v=full",
                resourceAlias: "caresetting",
              },
            ],
            resourceVersion: "1.10",
          },
          previousOrder: null,
          dateActivated: "2024-01-24T11:57:02.000+0530",
          scheduledDate: "2024-01-24T11:57:01.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-01-29T11:57:00.000+0530",
          encounter: {
            uuid: "d3a504cb-522e-4b68-8d78-0c5749d7889f",
            display: "Consultation 01/24/2024",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/d3a504cb-522e-4b68-8d78-0c5749d7889f",
                resourceAlias: "encounter",
              },
            ],
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "provider",
              },
            ],
          },
          orderReason: null,
          orderReasonNonCoded: null,
          orderType: {
            uuid: "131168f4-15f5-102d-96e4-000c29c2a5d7",
            display: "Drug Order",
            name: "Drug Order",
            javaClassName: "org.openmrs.DrugOrder",
            retired: false,
            description: "An order for a medication to be given to the patient",
            conceptClasses: [
              {
                uuid: "8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
                display: "Drug",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
                    resourceAlias: "conceptclass",
                  },
                ],
              },
            ],
            parent: null,
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/ordertype/131168f4-15f5-102d-96e4-000c29c2a5d7",
                resourceAlias: "ordertype",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/ordertype/131168f4-15f5-102d-96e4-000c29c2a5d7?v=full",
                resourceAlias: "ordertype",
              },
            ],
            resourceVersion: "1.10",
          },
          urgency: "ON_SCHEDULED_DATE",
          instructions: null,
          commentToFulfiller: null,
          display:
            "(NEW) Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension: null",
          auditInfo: {
            creator: {
              uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
              display: "superman",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "user",
                },
              ],
            },
            dateCreated: "2024-01-24T11:57:02.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "bb622a9f-b1be-42a7-bd54-e7001f509bac",
            display:
              "Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/bb622a9f-b1be-42a7-bd54-e7001f509bac",
                resourceAlias: "drug",
              },
            ],
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 10,
          doseUnits: {
            uuid: "9d6691d8-3f10-11e4-adec-0800271c1b75",
            display: "mg",
            name: {
              display: "mg",
              uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
              name: "mg",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d6694d8-3f10-11e4-adec-0800271c1b75",
                display: "mg",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d6694d8-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
                display: "mg",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          frequency: {
            uuid: "9d838148-3f10-11e4-adec-0800271c1b75",
            display: "Three times a day",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/orderfrequency/9d838148-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "orderfrequency",
              },
            ],
          },
          asNeeded: false,
          asNeededCondition: null,
          quantity: 150,
          quantityUnits: {
            uuid: "9d6691d8-3f10-11e4-adec-0800271c1b75",
            display: "mg",
            name: {
              display: "mg",
              uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
              name: "mg",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d6694d8-3f10-11e4-adec-0800271c1b75",
                display: "mg",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d6694d8-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d66b14e-3f10-11e4-adec-0800271c1b75",
                display: "mg",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75/name/9d66b14e-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6691d8-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          numRefills: 0,
          dosingInstructions: '{"instructions":"As directed"}',
          duration: 5,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
            name: {
              display: "Day(s)",
              uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
              name: "Day(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d743b33-3f10-11e4-adec-0800271c1b75",
                display: "day(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743b33-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
                display: "Day(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [
              {
                uuid: "e48507e5-d490-11e5-b193-0800270d80ce",
                display: "SNOMED: 258703001 (Day(s))",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/mapping/e48507e5-d490-11e5-b193-0800270d80ce",
                    resourceAlias: "mapping",
                  },
                ],
              },
            ],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          route: {
            uuid: "33b16adb-8a92-11e4-977f-0800271c1b75",
            display: "Topical",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/33b16adb-8a92-11e4-977f-0800271c1b75",
                resourceAlias: "concept",
              },
            ],
          },
          brandName: null,
          dispenseAsWritten: false,
          drugNonCoded: null,
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: null,
        notes: "",
        administrationSummary: {
          performerName: "",
          notes: "",
          status: "Late",
        },
      },
    ],
    dateStopped: null,
    firstSlotStartTime: 1706077800,
    notes: null,
  },
  {
    uuid: "d2cd8d35-4c40-4656-abb3-469e6200ccfb",
    name: "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup)",
    dosingInstructions: {
      route: "Oral",
      dosage: "10ml",
      asNeeded: false,
      frequency: "Four times a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "10 Day(s)",
    slots: [
      {
        id: 20,
        uuid: "ae90d8e8-22b9-44f3-afdf-d899c034d451",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1706495400,
        order: {
          uuid: "d2cd8d35-4c40-4656-abb3-469e6200ccfb",
          orderNumber: "ORD-22813",
          accessionNumber: null,
          patient: {
            uuid: "8f7c45d9-ec2b-411e-82b4-3b19fb2eb60e",
            display: "ET55749 - IPD New Patient",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/8f7c45d9-ec2b-411e-82b4-3b19fb2eb60e",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "d198ecd7-057d-00fa-0a22-8b7c1b402aff",
            display:
              "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/d198ecd7-057d-00fa-0a22-8b7c1b402aff",
                resourceAlias: "concept",
              },
            ],
          },
          action: "NEW",
          careSetting: {
            uuid: "c365e560-c3ec-11e3-9c1a-0800200c9a66",
            name: "Inpatient",
            description: "In-patient care setting",
            retired: false,
            careSettingType: "INPATIENT",
            display: "Inpatient",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66",
                resourceAlias: "caresetting",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/caresetting/c365e560-c3ec-11e3-9c1a-0800200c9a66?v=full",
                resourceAlias: "caresetting",
              },
            ],
            resourceVersion: "1.10",
          },
          previousOrder: null,
          dateActivated: "2024-01-24T11:47:08.000+0530",
          scheduledDate: "2024-01-24T11:47:07.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-02-03T11:47:06.000+0530",
          encounter: {
            uuid: "d3a504cb-522e-4b68-8d78-0c5749d7889f",
            display: "Consultation 01/24/2024",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/d3a504cb-522e-4b68-8d78-0c5749d7889f",
                resourceAlias: "encounter",
              },
            ],
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "provider",
              },
            ],
          },
          orderReason: null,
          orderReasonNonCoded: null,
          orderType: {
            uuid: "131168f4-15f5-102d-96e4-000c29c2a5d7",
            display: "Drug Order",
            name: "Drug Order",
            javaClassName: "org.openmrs.DrugOrder",
            retired: false,
            description: "An order for a medication to be given to the patient",
            conceptClasses: [
              {
                uuid: "8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
                display: "Drug",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
                    resourceAlias: "conceptclass",
                  },
                ],
              },
            ],
            parent: null,
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/ordertype/131168f4-15f5-102d-96e4-000c29c2a5d7",
                resourceAlias: "ordertype",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/ordertype/131168f4-15f5-102d-96e4-000c29c2a5d7?v=full",
                resourceAlias: "ordertype",
              },
            ],
            resourceVersion: "1.10",
          },
          urgency: "ON_SCHEDULED_DATE",
          instructions: null,
          commentToFulfiller: null,
          display:
            "(NEW) Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup): null",
          auditInfo: {
            creator: {
              uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
              display: "superman",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "user",
                },
              ],
            },
            dateCreated: "2024-01-24T11:47:08.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "a5e9270f-dd5a-49a1-9287-2fd611e59205",
            display:
              "Combintation Chlorpheniramine, Paracetamol and Pseudophedrine 100 mL Syrup (Cough and Cold Syrup)",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/a5e9270f-dd5a-49a1-9287-2fd611e59205",
                resourceAlias: "drug",
              },
            ],
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 10,
          doseUnits: {
            uuid: "9d65f54b-3f10-11e4-adec-0800271c1b75",
            display: "ml",
            name: {
              display: "ml",
              uuid: "9d65fb80-3f10-11e4-adec-0800271c1b75",
              name: "ml",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d65fb80-3f10-11e4-adec-0800271c1b75",
                display: "ml",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d65f8b4-3f10-11e4-adec-0800271c1b75",
                display: "ml",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65f8b4-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          frequency: {
            uuid: "9d84890a-3f10-11e4-adec-0800271c1b75",
            display: "Four times a day",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/orderfrequency/9d84890a-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "orderfrequency",
              },
            ],
          },
          asNeeded: false,
          asNeededCondition: null,
          quantity: 400,
          quantityUnits: {
            uuid: "9d65f54b-3f10-11e4-adec-0800271c1b75",
            display: "ml",
            name: {
              display: "ml",
              uuid: "9d65fb80-3f10-11e4-adec-0800271c1b75",
              name: "ml",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d65fb80-3f10-11e4-adec-0800271c1b75",
                display: "ml",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65fb80-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d65f8b4-3f10-11e4-adec-0800271c1b75",
                display: "ml",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75/name/9d65f8b4-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d65f54b-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          numRefills: 0,
          dosingInstructions: '{"instructions":"As directed"}',
          duration: 10,
          durationUnits: {
            uuid: "9d7437a9-3f10-11e4-adec-0800271c1b75",
            display: "Day(s)",
            name: {
              display: "Day(s)",
              uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
              name: "Day(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75?v=full",
                  resourceAlias: "name",
                },
              ],
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptdatatype",
                },
              ],
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f",
                  resourceAlias: "conceptclass",
                },
              ],
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d743b33-3f10-11e4-adec-0800271c1b75",
                display: "day(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743b33-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
              {
                uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
                display: "Day(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/name/9d743e1d-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "name",
                  },
                ],
              },
            ],
            descriptions: [],
            mappings: [
              {
                uuid: "e48507e5-d490-11e5-b193-0800270d80ce",
                display: "SNOMED: 258703001 (Day(s))",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75/mapping/e48507e5-d490-11e5-b193-0800270d80ce",
                    resourceAlias: "mapping",
                  },
                ],
              },
            ],
            answers: [],
            setMembers: [],
            attributes: [],
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d7437a9-3f10-11e4-adec-0800271c1b75?v=full",
                resourceAlias: "concept",
              },
            ],
            resourceVersion: "2.0",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9d6bc13f-3f10-11e4-adec-0800271c1b75",
                resourceAlias: "concept",
              },
            ],
          },
          brandName: null,
          dispenseAsWritten: false,
          drugNonCoded: null,
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: {
          uuid: "09eb498f-d118-4462-9d22-a0d5c3a717b4",
          patientUuid: "8f7c45d9-ec2b-411e-82b4-3b19fb2eb60e",
          encounterUuid: null,
          orderUuid: "d2cd8d35-4c40-4656-abb3-469e6200ccfb",
          providers: [
            {
              uuid: "3200793c-b912-44e9-83a9-a1a55754fd3c",
              provider: {
                uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                display: "Super Man",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "provider",
                  },
                ],
              },
              function: "Performer",
            },
          ],
          notes: [
            {
              uuid: "8843aac8-d50d-447f-9b18-ec692615a847",
              author: {
                uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                display: "Super Man",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/provider/c1c26908-3f10-11e4-adec-0800271c1b75",
                    resourceAlias: "provider",
                  },
                ],
              },
              recordedTime: 1706513832000,
              text: "Done",
            },
          ],
          status: "Completed",
          statusReason: null,
          drug: null,
          dosingInstructions: null,
          dose: null,
          doseUnits: null,
          route: null,
          site: null,
          administeredDateTime: 1706513828000,
        },
        notes: "",
        administrationSummary: {
          performerName: "Super Man",
          notes: "Done",
          status: "Administered-Late",
        },
      },
    ],
    dateStopped: null,
    firstSlotStartTime: 1706085000,
    notes: null,
  },
];

export const mockDrugChartDataLarge = [
  {
    uuid: "ca1e7546-24b9-4c2e-9ffb-5365b71ae4f4",
    name: "Amoxicillin/Clavulanic Acid  125 mg/31.25 mg/5 mL Powder for Oral Suspension",
    dosingInstructions: {
      route: "Topical",
      dosage: "1mg",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396840,
    notes: "",
  },
  {
    uuid: "347b0c8e-2c29-46a4-a07f-bdc73fada7ea",
    name: "Amoxicillin/Clavulanic Acid  400 mg/57 mg/5 mL Powder for Oral Suspension",
    dosingInstructions: {
      route: "Topical",
      dosage: "2mg",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "23f34c32-79f9-4c89-87de-16b5da662120",
    name: "Amoxicillin/Clavulanic Acid 1000 mg Tablet",
    dosingInstructions: {
      route: "Oral",
      dosage: 1,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "a3e0fd1b-f484-4db9-a05f-6ce97dfb3e85",
    name: "Amoxicillin/Clavulanic Acid  250 mg/62.5 mg/5 mL Powder for Oral Suspension",
    dosingInstructions: {
      route: "Topical",
      dosage: "2mg",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "9ada7a29-edc0-4801-ac84-e16d8d1a10ec",
    name: "Adrenaline 1 mg/mL (1 mL) Ampoule",
    dosingInstructions: {
      route: "Intravenous",
      dosage: "2mg",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "bf19b2d3-1148-43b9-b3a2-8b0b2bd892aa",
    name: "Paracetamol 120 mg/5 mL Suspension",
    dosingInstructions: {
      route: "Oral",
      dosage: "2ml",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "ffa1e186-2c18-4909-b553-54516fa1440b",
    name: "Paracetamol 125 mg Suppository",
    dosingInstructions: {
      route: "Oral",
      dosage: 2,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "4d1053c0-13ae-40ff-a2da-60043c72b89f",
    name: "Paracetamol 250 mg Suppository",
    dosingInstructions: {
      route: "Oral",
      dosage: 2,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "886821bc-fedf-4af8-a7a3-020df006db8f",
    name: "Paracetamol 500 mg Tablet",
    dosingInstructions: {
      route: "Oral",
      dosage: 2,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "452dc2ca-a875-4e9c-a6fa-626b99a892c5",
    name: "Isoflurane 250 mL Inhalation Anesthetic Liquid",
    dosingInstructions: {
      route: "Oral",
      dosage: "2ml",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "e5eee2bd-5348-4dbb-b113-598ff2ba76a3",
    name: "Cimetidine 200 mg/2 mL Ampoule",
    dosingInstructions: {
      route: "Intravenous",
      dosage: "2mg",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "840d086e-e429-4a2e-a382-f9c12bc25ebb",
    name: "Ciprofloxacin 500 mg Tablet",
    dosingInstructions: {
      route: "Oral",
      dosage: 1,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "e9a4c314-4f57-466f-ad15-0bdc2f8ea184",
    name: "Ciprofloxacin 0.3% Ophthalmic Ointment w/w",
    dosingInstructions: {
      route: "Topical",
      dosage: 2,
      doseUnits: "Tablet(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396900,
    notes: "",
  },
  {
    uuid: "d19390de-0a43-4d95-a703-d1c914936ac3",
    name: "Protein Powder",
    dosingInstructions: {
      route: "Oral",
      dosage: 1,
      doseUnits: "Unit(s)",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "1 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396960,
    notes: "",
  },
  {
    uuid: "a45c4217-b2b8-4812-96bd-3db7d29382c1",
    name: "Liquid Paraffin",
    dosingInstructions: {
      route: "Topical",
      dosage: 2,
      doseUnits: "Drop",
      asNeeded: false,
      frequency: "Twice a day",
      instructions: {
        instructions: "As directed",
      },
    },
    duration: "2 Day(s)",
    slots: [],
    dateStopped: null,
    orderReasonText: null,
    firstSlotStartTime: 1707396960,
    notes: "",
  },
];
