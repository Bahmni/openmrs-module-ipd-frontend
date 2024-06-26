export const mockAllergiesIntolerenceResponse = {
  data: {
    resourceType: "Bundle",
    id: "eacf662f-a730-409f-be96-48b3d6f5f119",
    entry: [
      {
        resource: {
          resourceType: "AllergyIntolerance",
          id: "216e656d-f738-42ce-acbe-802f2bf658b6",
          recordedDate: 1698316800000,
          recorder: {
            reference: "Practitioner/c1c21e11-3f10-11e4-adec-0800271c1b75",
            type: "Practitioner",
            display: "Bailly RURANGIRWA",
          },
          type: "allergy",
          category: ["food"],
          criticality: "high",
          code: {
            coding: [
              {
                code: "b68e3d18-8ee2-43a8-9074-f7c77369e1b4",
                display: "Milk products",
              },
            ],
          },
          patient: {
            reference: "Patient/9c041a87-d148-40f3-a854-e1f23d3b9f17",
            type: "Patient",
            display: "Test Patient",
          },
          reaction: [
            {
              substance: {
                coding: [
                  {
                    code: "b68e3d18-8ee2-43a8-9074-f7c77369e1b4",
                    display: "Milk products",
                  },
                ],
              },
              manifestation: [
                {
                  coding: [
                    {
                      code: "5ce31515-71dc-4ccf-87a9-9665f82790f6",
                      display: "Bronchospasm",
                    },
                  ],
                },
                {
                  coding: [
                    {
                      code: "b2479396-9b2c-42df-a06f-85bb8e93e7b3",
                      display: "Cough",
                    },
                  ],
                },
              ],
              severity: "severe",
            },
          ],
        },
      },
      {
        resource: {
          resourceType: "AllergyIntolerance",
          recordedDate: 1698316000000,
          recorder: {
            reference: "Practitioner/c1c21e11-3f10-11e4-adec-0800271c1b75",
            type: "Practitioner",
            display: "Bailly RURANGIRWA",
          },
          id: "400ccf4c-6290-4f62-9aff-eff1d9575b43",
          type: "allergy",
          category: ["food"],
          criticality: "high",
          code: {
            coding: [
              {
                code: "416506e4-dbe0-489a-8ace-f4e2745277ce",
                display: "Beef",
              },
            ],
          },
          patient: {
            reference: "Patient/9c041a87-d148-40f3-a854-e1f23d3b9f17",
            type: "Patient",
            display: "Test Patient",
          },
          note: [
            {
              text: "test comment",
            },
          ],
          reaction: [
            {
              substance: {
                coding: [
                  {
                    code: "416506e4-dbe0-489a-8ace-f4e2745277ce",
                    display: "Beef",
                  },
                ],
              },
              manifestation: [
                {
                  coding: [
                    {
                      code: "1a7522c0-0a80-4923-bded-8965114faf81",
                      display: "Headache",
                    },
                  ],
                },
              ],
              severity: "severe",
            },
          ],
        },
      },
      {
        resource: {
          resourceType: "AllergyIntolerance",
          recordedDate: 1698316000000,
          recorder: {
            reference: "Practitioner/c1c21e11-3f10-11e4-adec-0800271c1b75",
            type: "Practitioner",
            display: "Bailly RURANGIRWA",
          },
          id: "8e8753f2-d8be-443f-b7ef-8bceb218c01d",
          type: "allergy",
          category: ["environment"],
          criticality: "unable-to-assess",
          code: {
            coding: [
              {
                code: "52b05de6-1594-48af-8e7b-ea740d589a85",
                display: "Dust",
              },
            ],
          },
          patient: {
            reference: "Patient/9c041a87-d148-40f3-a854-e1f23d3b9f17",
            type: "Patient",
            display: "Test Patient",
          },
          reaction: [
            {
              substance: {
                coding: [
                  {
                    code: "52b05de6-1594-48af-8e7b-ea740d589a85",
                    display: "Dust",
                  },
                ],
              },
              manifestation: [
                {
                  coding: [
                    {
                      code: "26c7b55a-46e4-4cf5-8c87-a647a0e2e724",
                      display: "Anaphylaxis",
                    },
                  ],
                },
              ],
              severity: "moderate",
            },
          ],
        },
      },
      {
        resource: {
          resourceType: "AllergyIntolerance",
          id: "e1a00d00-f929-4817-af59-fffd7b509e77",
          recordedDate: 1698316000000,
          recorder: {
            reference: "Practitioner/c1c21e11-3f10-11e4-adec-0800271c1b75",
            type: "Practitioner",
            display: "Bailly RURANGIRWA",
          },
          type: "allergy",
          category: ["food"],
          criticality: "low",
          code: {
            coding: [
              {
                code: "7601cb9f-8c5a-4f6e-aea9-8ffc736ba4e5",
                display: "Wheat",
              },
            ],
          },
          patient: {
            reference: "Patient/9c041a87-d148-40f3-a854-e1f23d3b9f17",
            type: "Patient",
            display: "Test Patient",
          },
          reaction: [
            {
              substance: {
                coding: [
                  {
                    code: "7601cb9f-8c5a-4f6e-aea9-8ffc736ba4e5",
                    display: "Wheat",
                  },
                ],
              },
              manifestation: [
                {
                  coding: [
                    {
                      code: "80be66b2-81bf-4c07-886a-6baecb866a5a",
                      display: "Anaemia",
                    },
                  ],
                },
                {
                  coding: [
                    {
                      code: "26c7b55a-46e4-4cf5-8c87-a647a0e2e724",
                      display: "Anaphylaxis",
                    },
                  ],
                },
                {
                  coding: [
                    {
                      code: "1a7522c0-0a80-4923-bded-8965114faf81",
                      display: "Headache",
                    },
                  ],
                },
              ],
              severity: "mild",
            },
          ],
        },
      },
    ],
  },
};

export const mockVisitSummaryData = {
  uuid: "44832301-a09e-4bbb-b521-47144ed302cb",
  startDateTime: 1698301800000,
  stopDateTime: null,
  visitType: "IPD",
  admissionDetails: {
    uuid: "3a0642ef-2403-469d-8fd9-b2478a71e931",
    date: 1698301800000,
    provider: "Super Man",
    notes: null,
  },
  dischargeDetails: null,
};
