export const allFormsSummaryMock = [
  {
    name: "Test Form",
    uuid: "4d128f45-3ce0-45e6-9824-999a745526be",
    version: "1",
    published: true,
    id: 1,
    resources: null,
    privileges: [],
    nameTranslation: [],
  },
];

export const allFormsFilledInVisitMock = [
  {
    formType: "v2",
    formName: "Test Form",
    formVersion: 1,
    visitUuid: "30f613a0-1307-4442-880b-300867520936",
    visitStartDateTime: 1713875236000,
    encounterUuid: "3f7c69e8-35f7-4263-a7d7-28c1ffa9736f",
    encounterDateTime: 1713955252000,
    providers: [
      {
        providerName: "Mock Provider",
        uuid: "c1c21e11-3f10-11e4-adec-0800271c1b75",
      },
    ],
  },
];

export const mockFormConcepts = {
  resources: [
    {
      value:
        '{"name":"Test Form","id":37,"uuid":"4d128f45-3ce0-45e6-9824-999a745526be","defaultLocale":"en","controls":[{"type":"obsControl","label":{"translationKey":"IMAGE_1","id":"1","units":"","type":"label","value":"Image"},"properties":{"mandatory":false,"notes":false,"addMore":false,"hideLabel":false,"controlEvent":false,"location":{"column":0,"row":0}},"id":"1","concept":{"name":"Image","uuid":"6ca8ddf3-4e3d-4116-bd4e-a5147e580931","datatype":"Complex","conceptClass":"Misc","conceptHandler":"ImageUrlHandler","answers":[],"properties":{"allowDecimal":null}},"units":null,"hiNormal":null,"lowNormal":null,"hiAbsolute":null,"lowAbsolute":null},{"type":"obsControl","label":{"translationKey":"PATIENT_VIDEO_3","id":"3","units":"","type":"label","value":"Patient Video"},"properties":{"mandatory":false,"notes":false,"addMore":false,"hideLabel":false,"controlEvent":false,"location":{"column":0,"row":1}},"id":"3","concept":{"name":"Patient Video","uuid":"eef8e969-269d-40c4-b7c9-182da11c2653","datatype":"Complex","conceptClass":"Video","conceptHandler":"VideoUrlHandler","answers":[],"properties":{"allowDecimal":null}},"units":null,"hiNormal":null,"lowNormal":null,"hiAbsolute":null,"lowAbsolute":null}],"events":{"onFormSave":"","onFormInit":""},"translationsUrl":"/openmrs/ws/rest/v1/bahmniie/form/translations","referenceVersion":0,"referenceFormUuid":"4d128f45-3ce0-45e6-9824-999a745526be"}',
    },
  ],
};

export const mockFormTranslations = {
  concepts: {
    IMAGE_1: ["Image"],
  },
  labels: {},
  locale: "en",
};
