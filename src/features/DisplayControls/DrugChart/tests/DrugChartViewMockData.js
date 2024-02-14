export const drugChartData = [
  {
    id: 1,
    uuid: "821bcf56-8beb-48e3-82ac-4a3be4947cb3",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1704434402,
    endDate: null,
    slots: [
      {
        id: 1,
        uuid: "cb5dbe33-69ac-49a0-9fd0-93b523abaae7",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1704465000,
        order: {
          uuid: "238292fc-52c0-4e94-bc2b-14f195d316ee",
          orderNumber: "ORD-17197",
          accessionNumber: null,
          patient: {
            uuid: "f4815464-f252-4470-9311-a458f8bc76dc",
            display: "ET53547 - Harry Potter",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/f4815464-f252-4470-9311-a458f8bc76dc",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "9881091b-1802-4c62-8b80-a8fcb170b59f",
            display: "Paracetamol",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/9881091b-1802-4c62-8b80-a8fcb170b59f",
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
          dateActivated: "2024-01-05T14:05:48.000+0530",
          scheduledDate: "2024-01-05T14:05:48.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-01-10T14:05:47.000+0530",
          encounter: {
            uuid: "3db3fd4a-9318-46d9-beb9-151f2c3d05c4",
            display: "Consultation 01/05/2024",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/3db3fd4a-9318-46d9-beb9-151f2c3d05c4",
                resourceAlias: "encounter",
              },
            ],
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Bailly RURANGIRWA",
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
          display: "(NEW) Paracetamol 500 mg Tablet: null",
          auditInfo: {
            creator: {
              uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
              display: "bailly.rurangirwa",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/user/c1c21e11-3f10-11e4-adec-0800271c1b75",
                  resourceAlias: "user",
                },
              ],
            },
            dateCreated: "2024-01-05T14:05:48.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "852a311a-a3ac-4fba-95cb-f437de68e171",
            display: "Paracetamol 500 mg Tablet",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/852a311a-a3ac-4fba-95cb-f437de68e171",
                resourceAlias: "drug",
              },
            ],
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 1,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b?v=full",
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
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
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
                uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46?v=full",
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
          quantity: 15,
          quantityUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                  resourceAlias: "name",
                },
                {
                  rel: "full",
                  uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b?v=full",
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
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
                links: [
                  {
                    rel: "self",
                    uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46/name/7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
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
                uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46",
                resourceAlias: "concept",
              },
              {
                rel: "full",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/86239663-7b04-4563-b877-d7efc4fe6c46?v=full",
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
          links: [
            {
              rel: "self",
              uri: "http://localhost/openmrs/ws/rest/v1/order/238292fc-52c0-4e94-bc2b-14f195d316ee",
              resourceAlias: "order",
            },
          ],
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: null,
      },
    ],
  },
];

export const drugChartDataForPRN = [
  {
    id: 6,
    uuid: "9084dac9-abc3-4336-b264-8dd983204df9",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1707120660,
    endDate: null,
    slots: [
      {
        id: 58,
        uuid: "36912c16-889a-4e88-8e0f-1961ead2d8ed",
        serviceType: "AsNeededPlaceholder",
        status: "SCHEDULED",
        startTime: 1707379461,
        order: {
          uuid: "2c655346-4634-4767-b8ba-f78d0c7ed293",
          orderNumber: "ORD-22828",
          accessionNumber: null,
          patient: {
            uuid: "e40789bb-0d6d-4fb5-9407-cb461afb3a67",
            display: "ET55754 - PATEINT OPD",
          },
          concept: {
            uuid: "4c536d41-8a20-7f35-66e6-548450a72375",
            display: "Zinc Oxide",
          },
          action: "NEW",
          careSetting: {
            uuid: "c365e560-c3ec-11e3-9c1a-0800200c9a66",
            name: "Inpatient",
            description: "In-patient care setting",
            retired: false,
            careSettingType: "INPATIENT",
            display: "Inpatient",
            resourceVersion: "1.10",
          },
          previousOrder: null,
          dateActivated: "2024-02-08T13:34:24.000+0530",
          scheduledDate: "2024-02-08T13:34:21.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-02-18T13:34:20.000+0530",
          encounter: {
            uuid: "e4a69b46-129b-489a-a3e7-cd3e053138ff",
            display: "Consultation 02/08/2024",
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
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
              },
            ],
            parent: null,
            resourceVersion: "1.10",
          },
          urgency: "ON_SCHEDULED_DATE",
          instructions: null,
          commentToFulfiller: null,
          display: "(NEW) Zinc Oxide 20 mg Tablet: null",
          auditInfo: {
            creator: {
              uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
              display: "superman",
            },
            dateCreated: "2024-02-08T13:34:24.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "b2991702-8bb0-4581-ae5c-da48adc606cb",
            display: "Zinc Oxide 20 mg Tablet",
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 2,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
            resourceVersion: "2.0",
          },
          frequency: {
            uuid: "9d7d0641-3f10-11e4-adec-0800271c1b75",
            display: "Twice a day",
          },
          asNeeded: true,
          asNeededCondition: null,
          quantity: 40,
          quantityUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
              },
            ],
            descriptions: [],
            mappings: [],
            answers: [],
            setMembers: [],
            attributes: [],
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
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d743b33-3f10-11e4-adec-0800271c1b75",
                display: "day(s)",
              },
              {
                uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
                display: "Day(s)",
              },
            ],
            descriptions: [],
            mappings: [
              {
                uuid: "e48507e5-d490-11e5-b193-0800270d80ce",
                display: "SNOMED: 258703001 (Day(s))",
              },
            ],
            answers: [],
            setMembers: [],
            attributes: [],
            resourceVersion: "2.0",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          brandName: null,
          dispenseAsWritten: false,
          drugNonCoded: null,
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: null,
        notes: "",
      },
      {
        id: 72,
        uuid: "099c1151-24f9-4a55-816a-f892f683a705",
        serviceType: "AsNeededMedicationRequest",
        status: "COMPLETED",
        startTime: 1707384600,
        order: {
          uuid: "2c655346-4634-4767-b8ba-f78d0c7ed293",
          orderNumber: "ORD-22828",
          accessionNumber: null,
          patient: {
            uuid: "e40789bb-0d6d-4fb5-9407-cb461afb3a67",
            display: "ET55754 - PATEINT OPD",
          },
          concept: {
            uuid: "4c536d41-8a20-7f35-66e6-548450a72375",
            display: "Zinc Oxide",
          },
          action: "NEW",
          careSetting: {
            uuid: "c365e560-c3ec-11e3-9c1a-0800200c9a66",
            name: "Inpatient",
            description: "In-patient care setting",
            retired: false,
            careSettingType: "INPATIENT",
            display: "Inpatient",
            resourceVersion: "1.10",
          },
          previousOrder: null,
          dateActivated: "2024-02-08T13:34:24.000+0530",
          scheduledDate: "2024-02-08T13:34:21.000+0530",
          dateStopped: null,
          autoExpireDate: "2024-02-18T13:34:20.000+0530",
          encounter: {
            uuid: "e4a69b46-129b-489a-a3e7-cd3e053138ff",
            display: "Consultation 02/08/2024",
          },
          orderer: {
            uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
            display: "Super Man",
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
              },
            ],
            parent: null,
            resourceVersion: "1.10",
          },
          urgency: "ON_SCHEDULED_DATE",
          instructions: null,
          commentToFulfiller: null,
          display: "(NEW) Zinc Oxide 20 mg Tablet: null",
          drug: {
            uuid: "b2991702-8bb0-4581-ae5c-da48adc606cb",
            display: "Zinc Oxide 20 mg Tablet",
          },
          dosingType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dose: 2,
          doseUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
              },
            ],
          },
          frequency: {
            uuid: "9d7d0641-3f10-11e4-adec-0800271c1b75",
            display: "Twice a day",
          },
          asNeeded: true,
          asNeededCondition: null,
          quantity: 40,
          quantityUnits: {
            uuid: "86239663-7b04-4563-b877-d7efc4fe6c46",
            display: "Tablet(s)",
            name: {
              display: "Tablet(s)",
              uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
              name: "Tablet(s)",
              locale: "en",
              localePreferred: true,
              conceptNameType: "FULLY_SPECIFIED",
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "7a93eac2-d1b9-4af0-a876-7e1790f2eb6b",
                display: "Tablet(s)",
              },
            ],
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
              resourceVersion: "1.9",
            },
            datatype: {
              uuid: "8d4a4c94-c2cc-11de-8d13-0010c6dffd0f",
              display: "N/A",
            },
            conceptClass: {
              uuid: "8d492774-c2cc-11de-8d13-0010c6dffd0f",
              display: "Misc",
            },
            set: false,
            version: null,
            retired: false,
            names: [
              {
                uuid: "9d743b33-3f10-11e4-adec-0800271c1b75",
                display: "day(s)",
              },
              {
                uuid: "9d743e1d-3f10-11e4-adec-0800271c1b75",
                display: "Day(s)",
              },
            ],
            descriptions: [],
            mappings: [
              {
                uuid: "e48507e5-d490-11e5-b193-0800270d80ce",
                display: "SNOMED: 258703001 (Day(s))",
              },
            ],
            answers: [],
            setMembers: [],
            attributes: [],
            resourceVersion: "2.0",
          },
          route: {
            uuid: "9d6bc13f-3f10-11e4-adec-0800271c1b75",
            display: "Oral",
          },
          brandName: null,
          dispenseAsWritten: false,
          drugNonCoded: null,
          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: {
          uuid: "f6b086c7-02a2-4ffc-9779-c929272e13d2",
          patientUuid: "e40789bb-0d6d-4fb5-9407-cb461afb3a67",
          encounterUuid: null,
          orderUuid: "2c655346-4634-4767-b8ba-f78d0c7ed293",
          providers: [
            {
              uuid: "6e1f3d86-f065-46ea-9923-0a7c686d2705",
              provider: {
                uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                display: "Super Man",
              },
              function: "Performer",
            },
          ],
          notes: [
            {
              uuid: "6eb000f2-2b58-4b7f-b94e-7a8dd53b7087",
              author: {
                uuid: "c1c26908-3f10-11e4-adec-0800271c1b75",
                display: "Super Man",
              },
              recordedTime: 1707387375000,
              text: "Zinc PRN",
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
          administeredDateTime: 1707384600000,
        },
      },
    ],
  },
];

export const allMedicationData = {
  data: {
    emergencyMedications: [],
    ipdDrugOrders: [
      {
        drugOrder: {
          concept: {
            uuid: "9881091b-1802-4c62-8b80-a8fcb170b59f",
            name: "Zinc Oxide",
            dataType: "N/A",
            shortName: "Zinc Oxide",
            units: null,
            conceptClass: "Drug",
            hiNormal: null,
            lowNormal: null,
            set: false,
            mappings: [],
          },
          instructions: null,
          uuid: "5dd211a9-a0e3-49f2-be94-f697082a8863",
          orderType: "Drug Order",
          orderGroup: null,
          dateCreated: null,
          dateChanged: null,
          dateStopped: null,
          orderNumber: "ORD-22828",
          careSetting: "INPATIENT",
          action: "NEW",
          commentToFulfiller: null,
          autoExpireDate: 1707809429000,
          urgency: null,
          previousOrderUuid: null,
          drug: {
            name: "Zinc Oxide 20 mg Tablet",
            uuid: "df491fe5-2434-4142-9a73-60b3922c92ea",
            form: "Oral",
            strength: null,
          },
          drugNonCoded: null,
          dosingInstructionType:
            "org.openmrs.module.bahmniemrapi.drugorder.dosinginstructions.FlexibleDosingInstructions",
          dosingInstructions: {
            dose: 1,
            doseUnits: "ml",
            route: "Oral",
            frequency: "Twice a day",
            asNeeded: true,
            administrationInstructions: '{"instructions":"As directed"}',
            quantity: 2,
            quantityUnits: "ml",
            numberOfRefills: null,
          },
          dateActivated: 1707723030000,
          scheduledDate: 1707723030000,
          effectiveStartDate: 1707723030000,
          effectiveStopDate: 1707809429000,
          orderReasonText: null,
          duration: 1,
          durationUnits: "Day(s)",
          voided: false,
          voidReason: null,
          orderReasonConcept: null,
          sortWeight: null,
          conceptUuid: "9881091b-1802-4c62-8b80-a8fcb170b59f",
        },
        provider: {
          uuid: "9af6382e-734c-11ee-98ee-0242ac130009",
          name: "Laurence Wicks",
          encounterRoleUuid: null,
        },
        drugOrderSchedule: {
          firstDaySlotsStartTime: [1707384600],
          dayWiseSlotsStartTime: null,
          remainingDaySlotsStartTime: null,
          slotStartTime: null,
          medicationAdministrationStarted: true,
          pendingSlotsAvailable: null,
          notes: "",
        },
      },
    ],
  },
};
