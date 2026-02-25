/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


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
