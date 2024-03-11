export const mockDiagnosisDataOne = [
  {
    order: "PRIMARY",
    certainty: "CONFIRMED",
    codedAnswer: {
      uuid: "diagnosis-one",
      name: "Reactive arthropathy",
    },
    diagnosisDateTime: 1698412200000,
    providers: [
      {
        name: "Provider Two",
      },
    ],
    diagnosisStatusConcept: null,
  },
  {
    order: "PRIMARY",
    certainty: "PRESUMED",
    codedAnswer: {
      uuid: "diagnosis-two",
      name: "Arthropathy",
    },
    diagnosisDateTime: 1698308917000,
    providers: [
      {
        name: "Provider One",
      },
    ],
    diagnosisStatusConcept: {
      name: "Ruled Out Diagnosis",
    },
  },
];

export const mockDiagnosisDataTwo = [
  {
    order: "PRIMARY",
    certainty: "CONFIRMED",
    codedAnswer: {
      uuid: "diagnosis-one",
      name: "Reactive arthropathy",
    },
    diagnosisDateTime: 1698412200000,
    providers: [
      {
        name: "Provider Two",
      },
    ],
    diagnosisStatusConcept: null,
  },
  {
    order: "PRIMARY",
    certainty: "PRESUMED",
    codedAnswer: {
      uuid: "diagnosis-two",
      name: "Arthropathy",
    },
    diagnosisDateTime: 1698308917000,
    providers: [
      {
        name: "Provider One",
      },
    ],
    diagnosisStatusConcept: {
      name: "Ruled Out Diagnosis",
    },
  },
];
