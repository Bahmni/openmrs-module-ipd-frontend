export const byFullySpecifiedNameForDispoistionMockData = {
  status: 200,
  data: {
    results: [
      {
        answers: [
          {
            uuid: "c2bbfe9e-b7fb-11e4-9c67-080027b662ec",
            name: {
              display: "Undo Discharge",
              uuid: "c2bc09b3-b7fb-11e4-9c67-080027b662ec",
              name: "Undo Discharge",
            },
          },
          {
            uuid: "81cded5a-3f10-11e4-adec-0800271c1b75",
            name: {
              display: "Admit Patient",
              uuid: "81cdf55a-3f10-11e4-adec-0800271c1b75",
              name: "Admit Patient",
            },
          },
          {
            uuid: "81cec45c-3f10-11e4-adec-0800271c1b75",
            name: {
              display: "Discharge Patient",
              uuid: "81cecc80-3f10-11e4-adec-0800271c1b75",
              name: "Discharge Patient",
            },
          },
          {
            uuid: "81d1cf4e-3f10-11e4-adec-0800271c1b75",
            name: {
              display: "Transfer Patient",
              uuid: "81d1d831-3f10-11e4-adec-0800271c1b75",
              name: "Transfer Patient",
            },
          },
        ],
      },
    ],
  },
};

export const byFullySpecifiedNameForAdtNotesMockData = {
  status : 200,
  data: {
    results: [
      {
        uuid: "81eb8536-3f10-11e4-adec-0800271c1b75",
        name: {
          display: "Adt Notes",
          uuid: "81ecb988-3f10-11e4-adec-0800271c1b75",
          name: "Adt Notes",
          locale: "en",
          localePreferred: true,
          conceptNameType: "FULLY_SPECIFIED",
        },
        set: false,
        datatype: {
          uuid: "8d4a4ab4-c2cc-11de-8d13-0010c6dffd0f",
          display: "Text",
          name: "Text",
          description: "Free text",
        },
        hiNormal: null,
        hiAbsolute: null,
        hiCritical: null,
        lowNormal: null,
        lowAbsolute: null,
        lowCritical: null,
        units: null,
        allowDecimal: null,
        answers: [],
        setMembers: [],
      },
    ],
  },
};

export const visitSummaryToAdmitMockData = {
  status: 200,
  data: {
    uuid: "b6ae3ed8-903d-4c6e-a958-4e88ee61c845",
    startDateTime: 1704894659000,
    stopDateTime: null,
    visitType: "IPD",
    admissionDetails: null,
    dischargeDetails: null,
  },
};

export const visitSummaryToDischargeOrTransferMockData = {
  status: 200,
  data: {
    uuid: "b6ae3ed8-903d-4c6e-a958-4e88ee61c845",
    startDateTime: 1704894659000,
    stopDateTime: null,
    visitType: "IPD",
    admissionDetails: {
      uuid: "fb5d1c53-7b55-4ee6-8055-9950808e7496",
      date: 1704894995000,
      provider: "Super Man",
      notes: "Immediate admit",
    },
    dischargeDetails: null,
  },
};

export const visitSummaryToUndoDischargeMockData = {
  status: 200,
  data: {
    uuid: "b6ae3ed8-903d-4c6e-a958-4e88ee61c845",
    startDateTime: 1704894659000,
    stopDateTime: null,
    visitType: "IPD",
    admissionDetails: {
      uuid: "fb5d1c53-7b55-4ee6-8055-9950808e7496",
      date: 1704894995000,
      provider: "Super Man",
      notes: "Immediate admit",
    },
    dischargeDetails: {
      uuid: "fb5d1c53-7b55-4ee6-8055-9950808e7496",
      date: 1704894998000,
      provider: "Super Man",
      notes: "All good, discharge.",
    },
  },
};

export const vistAndEncounterTypesMockData = {
  data: {
    visitTypes: {
      IPD: "41ff1234-3f10-11e4-abcd-0800271c1b70",
    },
    encounterTypes: {
      DISCHARGE: "41ff1234-3f10-11e4-abcd-0800271c1b71",
      ADMISSION: "41ff1234-3f10-11e4-abcd-0800271c1b72",
      TRANSFER: "41ff1234-3f10-11e4-abcd-0800271c1b73",
    },
  },
};

export const patientResponseData ={
  status: 200,
  data: {
    "encounterUuid": "c1c26908-3f10-11e4-adec-12345678901",
    "observations": [
        {
          "encounterDateTime": 1706111613000,
          "groupMembers": [],
          "providers": [
              {
                  "uuid": "c1c26908-3f10-11e4-adec-08002713245",
                  "name": "Super Man",
              }
          ],
          "conceptNameToDisplay": "Adt Notes",
          "valueAsString": "Admitted",
        }
    ],
  }
};
