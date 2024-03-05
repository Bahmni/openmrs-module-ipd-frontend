export const mockPatientsList = {
  admittedPatients: [
    {
      patientDetails: {
        uuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798",
        display:
          "PT51140 - AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
        identifiers: [
          {
            uuid: "d2d6d947-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT51140",
          },
        ],
        person: {
          uuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798",
          display: "AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
          gender: "M",
          age: 14,
          birthdate: "2009-06-13T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "c2dc4275-871b-465c-8da0-be336d84bd62",
            display: "AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
          },
          preferredAddress: {
            uuid: "7d954eb4-6364-406c-96ed-55f51e7ddc09",
            display: "Annon-address1-51140",
          },
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
          resourceVersion: "1.11",
        },
        voided: false,
        resourceVersion: "1.8",
      },
      bedDetails: {
        id: 6,
        uuid: "94c9bc20-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "A-6",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 2,
        column: 3,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
    {
      patientDetails: {
        uuid: "7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7",
        display:
          "PT49722 - AnnonFN-Eifbqbgbnm AnnonMN-Vrystpswee AnnonLN-Idseppecxk",
        identifiers: [
          {
            uuid: "d2b38721-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT49722",
          },
        ],
        person: {
          uuid: "7278eb93-8c1d-4ef4-bcbf-4c6ee91365f7",
          display: "AnnonFN-Eifbqbgbnm AnnonMN-Vrystpswee AnnonLN-Idseppecxk",
          gender: "M",
          age: 10,
          birthdate: "2013-07-21T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "825dd9f7-819e-420b-9c59-54e3663cfc87",
            display: "AnnonFN-Eifbqbgbnm AnnonMN-Vrystpswee AnnonLN-Idseppecxk",
          },
          preferredAddress: {
            uuid: "1d7cda41-5620-4bd6-9dfe-ebb2c6cb1bf3",
            display: "Annon-address1-49722",
          },
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
          resourceVersion: "1.11",
        },
        voided: false,
        resourceVersion: "1.8",
      },
      bedDetails: {
        id: 10,
        uuid: "9597074b-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "C-1",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 1,
        column: 1,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
    {
      patientDetails: {
        uuid: "3ab51ec0-4650-4400-9aaa-75f30ece0208",
        display: "ET55749 - user three",
        identifiers: [
          {
            uuid: "63743e38-9c84-4c1c-b312-69bc2558f6e0",
            display: "Identification Number = ET55749",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/patient/3ab51ec0-4650-4400-9aaa-75f30ece0208/identifier/63743e38-9c84-4c1c-b312-69bc2558f6e0",
                resourceAlias: "identifier",
              },
            ],
          },
        ],
        person: {
          uuid: "3ab51ec0-4650-4400-9aaa-75f30ece0208",
          display: "user three",
          gender: "F",
          age: 30,
          birthdate: "1994-02-19T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "14626b64-0929-4cc4-a8e3-15f0722aa0f3",
            display: "user three",
            links: [
              {
                rel: "self",
                uri: "http://localhost/openmrs/ws/rest/v1/person/3ab51ec0-4650-4400-9aaa-75f30ece0208/name/14626b64-0929-4cc4-a8e3-15f0722aa0f3",
                resourceAlias: "name",
              },
            ],
          },
          preferredAddress: null,
          attributes: [
            {
              uuid: "1c564589-9ef6-4aca-bc69-88b25603c9f0",
              display: "registrationLocation = 57",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/person/3ab51ec0-4650-4400-9aaa-75f30ece0208/attribute/1c564589-9ef6-4aca-bc69-88b25603c9f0",
                  resourceAlias: "attribute",
                },
              ],
            },
            {
              uuid: "4bfeef33-4ff4-4931-9c58-69e38b7bebae",
              display: "confirmedPatient = true",
              links: [
                {
                  rel: "self",
                  uri: "http://localhost/openmrs/ws/rest/v1/person/3ab51ec0-4650-4400-9aaa-75f30ece0208/attribute/4bfeef33-4ff4-4931-9c58-69e38b7bebae",
                  resourceAlias: "attribute",
                },
              ],
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
          links: [
            {
              rel: "self",
              uri: "http://localhost/openmrs/ws/rest/v1/person/3ab51ec0-4650-4400-9aaa-75f30ece0208",
              resourceAlias: "person",
            },
            {
              rel: "full",
              uri: "http://localhost/openmrs/ws/rest/v1/person/3ab51ec0-4650-4400-9aaa-75f30ece0208?v=full",
              resourceAlias: "person",
            },
          ],
          resourceVersion: "1.11",
        },
        voided: false,
        links: [
          {
            rel: "self",
            uri: "http://localhost/openmrs/ws/rest/v1/patient/3ab51ec0-4650-4400-9aaa-75f30ece0208",
            resourceAlias: "patient",
          },
          {
            rel: "full",
            uri: "http://localhost/openmrs/ws/rest/v1/patient/3ab51ec0-4650-4400-9aaa-75f30ece0208?v=full",
            resourceAlias: "patient",
          },
        ],
        resourceVersion: "1.8",
      },
      bedDetails: {
        id: 72,
        uuid: "8b6da147-11c4-4f10-8d15-cd9359305175",
        bedNumber: "ICU1",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 1,
        column: 1,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
  ],
  totalPatients: 25,
};

export const mockSearchPatientsList = {
  admittedPatients: [
    {
      patientDetails: {
        uuid: "0a40959a-68ac-47d0-a24e-e1298a078590",
        display:
          "PT51187 - AnnonFN-Oeflptynqs AnnonMN-Pwphqkztxg AnnonLN-Mqucxlndej",
        identifiers: [
          {
            uuid: "d2b6a0b1-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT51187",
          },
        ],
        person: {
          uuid: "0a40959a-68ac-47d0-a24e-e1298a078590",
          display: "AnnonFN-Oeflptynqs AnnonMN-Pwphqkztxg AnnonLN-Mqucxlndej",
          gender: "M",
          age: 4,
          birthdate: "2019-10-27T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "052f70a3-e8c1-43b9-a6fd-382d846f874d",
            display: "AnnonFN-Oeflptynqs AnnonMN-Pwphqkztxg AnnonLN-Mqucxlndej",
          },
          preferredAddress: {
            uuid: "55fab5c9-a64c-4502-b31a-ca68c6e63018",
            display: "Annon-address1-51187",
          },
          attributes: [
            {
              uuid: "3db3e2e7-9766-4220-8679-2a429505f696",
              display: "mobilePhone = 2316137",
            },
            {
              uuid: "b88d2895-c955-4187-b5e3-0dbc4b20f9eb",
              display: "otherPhone = 83294720",
            },
            {
              uuid: "1909b477-718a-4cde-a24f-b03fb4d1f883",
              display: "registrationLocation = 57",
            },
            {
              uuid: "9e29bbaf-7f02-47c1-a454-d1593e51dd06",
              display: "confirmedPatient = true",
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
          resourceVersion: "1.11",
        },
        voided: false,
        resourceVersion: "1.8",
      },
      bedDetails: {
        id: 41,
        uuid: "97dc3e13-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "G-3",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 1,
        column: 3,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
    {
      patientDetails: {
        uuid: "f9165b58-57c6-4bee-aec3-96001fb1a980",
        display:
          "PT51190 - AnnonFN-Ndddhzfxcp AnnonMN-Sxhubwhrqb AnnonLN-Lxkdndeknk",
        identifiers: [
          {
            uuid: "d2b6a20d-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT51190",
          },
        ],
        person: {
          uuid: "f9165b58-57c6-4bee-aec3-96001fb1a980",
          display: "AnnonFN-Ndddhzfxcp AnnonMN-Sxhubwhrqb AnnonLN-Lxkdndeknk",
          gender: "M",
          age: 14,
          birthdate: "2009-11-13T00:00:00.000+0530",
          birthdateEstimated: true,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "9ad8db50-2180-4343-88f5-b6f40432c5e9",
            display: "AnnonFN-Ndddhzfxcp AnnonMN-Sxhubwhrqb AnnonLN-Lxkdndeknk",
          },
          preferredAddress: {
            uuid: "c5c07668-a4eb-4a9b-85f3-6ebea357be10",
            display: "Annon-address1-51190",
          },
          attributes: [
            {
              uuid: "84173cda-fb98-4d4f-ba6d-3b1eebf2012c",
              display: "mobilePhone = 38228824",
            },
            {
              uuid: "085e85dd-8b88-4c47-bbbb-946cb152730d",
              display: "otherPhone = 32698366",
            },
            {
              uuid: "9587e973-2cd8-4514-94a2-069848aba812",
              display: "registrationLocation = 57",
            },
            {
              uuid: "79fb18ea-ba57-4130-81f6-a2c46edcea8b",
              display: "confirmedPatient = true",
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
        },
        voided: false,
      },
      bedDetails: {
        id: 27,
        uuid: "96a6630a-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "E-6",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 2,
        column: 3,
        status: "OCCUPIED",
      },
      newTreatments: 1,
    },
    {
      patientDetails: {
        uuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798",
        display:
          "PT51140 - AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
        identifiers: [
          {
            uuid: "d2d6d947-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT51140",
          },
        ],
        person: {
          uuid: "17fd50c7-8f9e-48da-b9ed-88c1bd358798",
          display: "AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
          gender: "M",
          age: 14,
          birthdate: "2009-06-13T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "c2dc4275-871b-465c-8da0-be336d84bd62",
            display: "AnnonFN-Jcilhyxuen AnnonMN-Dylkrgbpwo AnnonLN-Gkksnhzbeu",
          },
          preferredAddress: {
            uuid: "7d954eb4-6364-406c-96ed-55f51e7ddc09",
            display: "Annon-address1-51140",
          },
          attributes: [
            {
              uuid: "880e0ad0-079a-46d7-88ff-042d5e576140",
              display: "mobilePhone = 54572562",
            },
            {
              uuid: "b8b0be14-9a93-4917-8d9b-ec281dcdc678",
              display: "otherPhone = 45648420",
            },
            {
              uuid: "fdf6e8c6-e7ed-4865-a693-25c00a5cdfaf",
              display: "registrationLocation = 57",
            },
            {
              uuid: "c8a4f0d7-c069-4344-8a29-df1633de78a2",
              display: "confirmedPatient = true",
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
        },
        voided: false,
      },
      bedDetails: {
        id: 6,
        uuid: "94c9bc20-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "A-6",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 2,
        column: 3,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
    {
      patientDetails: {
        uuid: "5e35aa89-1518-45b0-98a2-0079a1100232",
        display:
          "PT50298 - AnnonFN-Clxgoajwgo AnnonMN-Borspwocvv AnnonLN-Sdjnncsmhw",
        identifiers: [
          {
            uuid: "d2b52581-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT50298",
          },
        ],
        person: {
          uuid: "5e35aa89-1518-45b0-98a2-0079a1100232",
          display: "AnnonFN-Clxgoajwgo AnnonMN-Borspwocvv AnnonLN-Sdjnncsmhw",
          gender: "M",
          age: 5,
          birthdate: "2019-02-18T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "4f954d23-cc29-45b3-910d-cc0bbb2cdb00",
            display: "AnnonFN-Clxgoajwgo AnnonMN-Borspwocvv AnnonLN-Sdjnncsmhw",
          },
          preferredAddress: {
            uuid: "f74c7d03-ee60-4e64-9b66-8a92d1d42224",
            display: "Annon-address1-50298",
          },
          attributes: [
            {
              uuid: "fa372654-91c6-4cff-af4c-0d58cc3e0adb",
              display: "mobilePhone = 7169504",
            },
            {
              uuid: "8d491948-21ec-48e0-8b4e-e47dfe95cdef",
              display: "otherPhone = 37143288",
            },
            {
              uuid: "f7a6e125-f658-411a-8965-ce0554761b48",
              display: "registrationLocation = 57",
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
        },
        voided: false,
      },
      bedDetails: {
        id: 16,
        uuid: "960cccd8-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "D-1",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 1,
        column: 1,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
    {
      patientDetails: {
        uuid: "e8c81f9b-571b-4051-8882-f58840ea270b",
        display:
          "PT50321 - AnnonFN-Esdkpxsxjb AnnonMN-Epnvoixsvx AnnonLN-Ghvgrrlcem",
        identifiers: [
          {
            uuid: "d2b5334a-8388-11ee-bd35-0242ac120002",
            display: "Patient Identifier = PT50321",
          },
        ],
        person: {
          uuid: "e8c81f9b-571b-4051-8882-f58840ea270b",
          display: "AnnonFN-Esdkpxsxjb AnnonMN-Epnvoixsvx AnnonLN-Ghvgrrlcem",
          gender: "M",
          age: 8,
          birthdate: "2015-03-26T00:00:00.000+0530",
          birthdateEstimated: false,
          dead: false,
          deathDate: null,
          causeOfDeath: null,
          preferredName: {
            uuid: "b6b687dd-4661-4da4-b843-8586860a6918",
            display: "AnnonFN-Esdkpxsxjb AnnonMN-Epnvoixsvx AnnonLN-Ghvgrrlcem",
          },
          preferredAddress: {
            uuid: "2d3f9452-cfd1-4e4a-a17f-d2933a8cba4a",
            display: "Annon-address1-50321",
          },
          attributes: [
            {
              uuid: "15f8cf02-6e68-4100-827b-85049282a6a4",
              display: "mobilePhone = 93230246",
            },
            {
              uuid: "bdec2b2d-c80a-4f60-80e4-7e6b0a9c48fa",
              display: "otherPhone = 19528895",
            },
            {
              uuid: "62b3a891-57a6-4d6c-a933-f7c3dda585e4",
              display: "registrationLocation = 57",
            },
          ],
          voided: false,
          birthtime: null,
          deathdateEstimated: false,
        },
        voided: false,
      },
      bedDetails: {
        id: 33,
        uuid: "973aecef-dc51-11e7-ad27-000c29a2a768",
        bedNumber: "F-4",
        bedType: {
          uuid: "3011f18b-5e12-11e9-9eee-000c29a2a768",
          name: "normal",
          displayName: "normal bed",
          description: "NRM",
          resourceVersion: "1.8",
        },
        row: 1,
        column: 4,
        status: "OCCUPIED",
      },
      newTreatments: 0,
    },
  ],
  totalPatients: 5,
};

export const mockSearchEmptyPatientsList = {
  admittedPatients: [],
  totalPatients: 0,
};

