export const mockFormStructure = [
  {
    conceptName: "Image",
    translationKey: "IMAGE_1",
    hasGroupMembers: false,
  },
  {
    conceptName: "Patient Video",
    translationKey: "PATIENT_VIDEO_3",
    hasGroupMembers: false,
  },
];

export const mockFormTranslations = {
  IMAGE_1: ["Image"],
  PATIENT_VIDEO_3: ["Patient Video"],
};

export const mockObservations = {
  observations: [
    {
      concept: {
        name: "Image",
      },
      formFieldPath: "Test Form.1/1-0",
      valueAsString: "Image Value",
    },
    {
      concept: {
        name: "Patient Video",
      },
      formFieldPath: "Test Form.1/1-0",
      valueAsString: "Patient Video Value",
    },
  ],
};
