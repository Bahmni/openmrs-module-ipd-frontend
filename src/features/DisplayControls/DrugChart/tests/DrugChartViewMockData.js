export const drugChartData = [
  {
    id: 1,
    uuid: "821bcf56-8beb-48e3-82ac-4a3be4947cb3",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1704443600,
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
