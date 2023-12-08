export const AdminMedicationData = [
  {
    id: 2,
    uuid: "472b0751-0d78-430b-87b2-32ab8dea7a84",
    serviceType: "MedicationRequest",
    comments: null,
    startDate: 1701691779,
    endDate: null,
    slots: [
      {
        id: 47,
        uuid: "fac22559-5a3b-488f-97d2-1f4279953559",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1701923400,
        order: {
          uuid: "21960389-13ad-4c6e-9c92-1694b12a1120",
          orderNumber: "ORD-17199",
          accessionNumber: null,
          patient: {
            uuid: "f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
            display: "ET53548 - Meredith Ray",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "d612ddcc-9d3b-4489-97e1-22893c9735df",
            display: "Enalapril",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/d612ddcc-9d3b-4489-97e1-22893c9735df",
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
          dateActivated: "2023-12-04T17:40:46.000+0530",
          scheduledDate: "2023-12-04T17:40:45.000+0530",
          dateStopped: null,
          autoExpireDate: "2023-12-09T17:40:44.000+0530",
          encounter: {
            uuid: "63304ee4-7724-46c5-a959-173ec4e551f3",
            display: "Consultation 12/04/2023",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/63304ee4-7724-46c5-a959-173ec4e551f3",
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
          display: "(NEW) Enalapril 5 mg Tablet: null",
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
            dateCreated: "2023-12-04T17:40:46.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "476cf744-2d07-4e95-8486-676f8637f5db",
            display: "Enalapril 5 mg Tablet",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/476cf744-2d07-4e95-8486-676f8637f5db",
                resourceAlias: "drug",
              },
            ],
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
            display: "Thrice a day",
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
          quantity: 30,
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
          dosingInstructions:
            '{"instructions":"Before meals","additionalInstructions":"sample additional instruction"}',
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
              uri: "http://localhost/openmrs/ws/rest/v1/order/21960389-13ad-4c6e-9c92-1694b12a1120",
              resourceAlias: "order",
            },
          ],

          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: {
          uuid: "031f3267-aa36-44ef-9a6b-14bacf57389b",
          notes: "Temp Notes",
          status: "completed",
          administeredDateTime: 1701924000,
          orderUuid: "1c1185aa-f12c-40dc-9a7d-7ba04b28cbd7",
          patientUuid: "26e39541-68c8-4dd7-a463-105bd303cde9",
          // "providerUuid":"c1c26908-3f10-11e4-adec-0800271c1b75"
          provider: {
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
        },
      },
      {
        id: 47,
        uuid: "fac22559-5a3b-488f-97d2-1f4279953559",
        serviceType: "MedicationRequest",
        status: "COMPLETED",
        startTime: 1701929000,
        order: {
          uuid: "21960389-13ad-4c6e-9c92-1694b12a1120",
          orderNumber: "ORD-17199",
          accessionNumber: null,
          patient: {
            uuid: "f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
            display: "ET53548 - Meredith Ray",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "d612ddcc-9d3b-4489-97e1-22893c9735df",
            display: "Enalapril",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/d612ddcc-9d3b-4489-97e1-22893c9735df",
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
          dateActivated: "2023-12-04T17:40:46.000+0530",
          scheduledDate: "2023-12-04T17:40:45.000+0530",
          dateStopped: null,
          autoExpireDate: "2023-12-09T17:40:44.000+0530",
          encounter: {
            uuid: "63304ee4-7724-46c5-a959-173ec4e551f3",
            display: "Consultation 12/04/2023",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/63304ee4-7724-46c5-a959-173ec4e551f3",
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
          display: "(NEW) Enalapril 5 mg Tablet: null",
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
            dateCreated: "2023-12-04T17:40:46.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "476cf744-2d07-4e95-8486-676f8637f5db",
            display: "Enalapril 5 mg Tablet",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/476cf744-2d07-4e95-8486-676f8637f5db",
                resourceAlias: "drug",
              },
            ],
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
            display: "Thrice a day",
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
          quantity: 30,
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
          dosingInstructions:
            '{"instructions":"Before meals","additionalInstructions":"sample additional instruction"}',
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
              uri: "http://localhost/openmrs/ws/rest/v1/order/21960389-13ad-4c6e-9c92-1694b12a1120",
              resourceAlias: "order",
            },
          ],

          type: "drugorder",
          resourceVersion: "1.10",
        },
        medicationAdministration: {
          uuid: "031f3267-aa36-44ef-9a6b-14bacf57389b",
          notes: "Temp Notes",
          status: "completed",
          administeredDateTime: 1701934000,
          orderUuid: "1c1185aa-f12c-40dc-9a7d-7ba04b28cbd7",
          patientUuid: "26e39541-68c8-4dd7-a463-105bd303cde9",
          // "providerUuid":"c1c26908-3f10-11e4-adec-0800271c1b75"
          provider: {
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
        },
      },
      {
        id: 48,
        uuid: "653bccf5-ca25-4324-82bb-31badbabcb4c",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1701934200,
        order: {
          uuid: "21960389-13ad-4c6e-9c92-1694b12a1120",
          orderNumber: "ORD-17199",
          accessionNumber: null,
          patient: {
            uuid: "f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
            display: "ET53548 - Meredith Ray",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "d612ddcc-9d3b-4489-97e1-22893c9735df",
            display: "Enalapril",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/d612ddcc-9d3b-4489-97e1-22893c9735df",
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
          dateActivated: "2023-12-04T17:40:46.000+0530",
          scheduledDate: "2023-12-04T17:40:45.000+0530",
          dateStopped: null,
          autoExpireDate: "2023-12-09T17:40:44.000+0530",
          encounter: {
            uuid: "63304ee4-7724-46c5-a959-173ec4e551f3",
            display: "Consultation 12/04/2023",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/63304ee4-7724-46c5-a959-173ec4e551f3",
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
          display: "(NEW) Enalapril 5 mg Tablet: null",
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
            dateCreated: "2023-12-04T17:40:46.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "476cf744-2d07-4e95-8486-676f8637f5db",
            display: "Enalapril 5 mg Tablet",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/476cf744-2d07-4e95-8486-676f8637f5db",
                resourceAlias: "drug",
              },
            ],
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
            display: "Thrice a day",
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
          quantity: 30,
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
          dosingInstructions:
            '{"instructions":"Before meals","additionalInstructions":"sample additional instruction"}',
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
              uri: "http://localhost/openmrs/ws/rest/v1/order/21960389-13ad-4c6e-9c92-1694b12a1120",
              resourceAlias: "order",
            },
          ],
          type: "drugorder",
          resourceVersion: "1.10",
        },
      },
      {
        id: 49,
        uuid: "e3284aba-ddf9-4fad-910a-e1745e4840e6",
        serviceType: "MedicationRequest",
        status: "SCHEDULED",
        startTime: 1701959400,
        order: {
          uuid: "21960389-13ad-4c6e-9c92-1694b12a1120",
          orderNumber: "ORD-17199",
          accessionNumber: null,
          patient: {
            uuid: "f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
            display: "ET53548 - Meredith Ray",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/f4d9c1cb-f67e-45e3-a60e-fec81a05aa26",
                resourceAlias: "patient",
              },
            ],
          },
          concept: {
            uuid: "d612ddcc-9d3b-4489-97e1-22893c9735df",
            display: "Enalapril",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/concept/d612ddcc-9d3b-4489-97e1-22893c9735df",
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
          dateActivated: "2023-12-04T17:40:46.000+0530",
          scheduledDate: "2023-12-04T17:40:45.000+0530",
          dateStopped: null,
          autoExpireDate: "2023-12-09T17:40:44.000+0530",
          encounter: {
            uuid: "63304ee4-7724-46c5-a959-173ec4e551f3",
            display: "Consultation 12/04/2023",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/encounter/63304ee4-7724-46c5-a959-173ec4e551f3",
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
          display: "(NEW) Enalapril 5 mg Tablet: null",
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
            dateCreated: "2023-12-04T17:40:46.000+0530",
            changedBy: null,
            dateChanged: null,
          },
          drug: {
            uuid: "476cf744-2d07-4e95-8486-676f8637f5db",
            display: "Enalapril 5 mg Tablet",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/drug/476cf744-2d07-4e95-8486-676f8637f5db",
                resourceAlias: "drug",
              },
            ],
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
            display: "Thrice a day",
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
          quantity: 30,
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
          dosingInstructions:
            '{"instructions":"Before meals","additionalInstructions":"sample additional instruction"}',
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
              uri: "http://localhost/openmrs/ws/rest/v1/order/21960389-13ad-4c6e-9c92-1694b12a1120",
              resourceAlias: "order",
            },
          ],
          type: "drugorder",
          resourceVersion: "1.10",
        },
      },
    ],
  },
];
