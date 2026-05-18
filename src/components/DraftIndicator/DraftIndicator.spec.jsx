import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { DraftIndicator } from "./DraftIndicator";

jest.mock("../../features/i18n/I18nProvider", () => {
  const mockReact = require("react");
  const mockIntlProvider = require("react-intl").IntlProvider;
  return {
    I18nProvider: ({ children }) =>
      mockReact.createElement(
        mockIntlProvider,
        { locale: "en", messages: {} },
        children
      ),
  };
});

jest.mock("../../services/draftService", () => ({
  fetchDraftsForProvider: jest.fn(),
}));

jest.mock("../../utils/CommonUtils", () => ({
  ...jest.requireActual("../../utils/CommonUtils"),
  getProviderUuid: jest.fn(),
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node) => node,
}));

const mockDrafts = [
  {
    draftUuid: "draft-uuid-1",
    patientName: "John Doe",
    patientUuid: "patient-uuid-1",
    patientIdentifier: "IQ000001",
    encounterUuid: "encounter-uuid-1",
    formName: "Form One",
    timestamp: 1705313400000,
  },
];

describe("DraftIndicator", () => {
  let fetchDraftsForProvider;
  let getProviderUuid;

  beforeEach(() => {
    jest.clearAllMocks();
    fetchDraftsForProvider =
      require("../../services/draftService").fetchDraftsForProvider;
    getProviderUuid = require("../../utils/CommonUtils").getProviderUuid;

    getProviderUuid.mockResolvedValue("provider-uuid-456");
    fetchDraftsForProvider.mockResolvedValue(mockDrafts);
  });

  it("should render the draft indicator button", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<DraftIndicator />));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__button")
    ).toBeTruthy();
  });

  it("should fetch drafts with the correct providerUuid on mount", async () => {
    await act(async () => {
      render(<DraftIndicator />);
    });
    expect(fetchDraftsForProvider).toHaveBeenCalledTimes(1);
    expect(fetchDraftsForProvider).toHaveBeenCalledWith("provider-uuid-456");
  });

  it("should show red dot when there are drafts", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<DraftIndicator />));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__red-dot")
    ).toBeTruthy();
  });

  it("should not show red dot and not fetch when providerUuid is unavailable", async () => {
    getProviderUuid.mockResolvedValue(null);

    let container;
    await act(async () => {
      ({ container } = render(<DraftIndicator />));
    });
    expect(fetchDraftsForProvider).not.toHaveBeenCalled();
    expect(
      container.querySelector(".ipd-draft-indicator__red-dot")
    ).toBeNull();
  });

  it("should not show overlay by default", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<DraftIndicator />));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();
  });

  it("should toggle overlay open when button is clicked", async () => {
    let container, getByLabelText;
    await act(async () => {
      ({ container, getByLabelText } = render(<DraftIndicator />));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();

    await act(async () => {
      fireEvent.click(getByLabelText("View observation drafts"));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeTruthy();
  });

  it("should close overlay when button is clicked again", async () => {
    let container, getByLabelText;
    await act(async () => {
      ({ container, getByLabelText } = render(<DraftIndicator />));
    });
    const button = getByLabelText("View observation drafts");

    await act(async () => {
      fireEvent.click(button);
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(button);
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();
  });

  it("should close overlay when clicking outside", async () => {
    let container, getByLabelText;
    await act(async () => {
      ({ container, getByLabelText } = render(<DraftIndicator />));
    });

    await act(async () => {
      fireEvent.click(getByLabelText("View observation drafts"));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(document.body);
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();
  });

  it("should set aria-expanded to true when overlay is open", async () => {
    let getByLabelText;
    await act(async () => {
      ({ getByLabelText } = render(<DraftIndicator />));
    });
    const button = getByLabelText("View observation drafts");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("should render draft rows in overlay when open", async () => {
    let getByLabelText, getByText;
    await act(async () => {
      ({ getByLabelText, getByText } = render(<DraftIndicator />));
    });

    await act(async () => {
      fireEvent.click(getByLabelText("View observation drafts"));
    });
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("should close overlay when close button in overlay is clicked", async () => {
    let container, getByLabelText;
    await act(async () => {
      ({ container, getByLabelText } = render(<DraftIndicator />));
    });

    await act(async () => {
      fireEvent.click(getByLabelText("View observation drafts"));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(getByLabelText("Close drafts overlay"));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();
  });

  it("should navigate to the observation form and close overlay when a draft row is clicked", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    let container, getByLabelText;
    await act(async () => {
      ({ container, getByLabelText } = render(<DraftIndicator />));
    });

    await act(async () => {
      fireEvent.click(getByLabelText("View observation drafts"));
    });

    const rowButton = container.querySelector(".ipd-draft-overlay__row-button");
    await act(async () => {
      fireEvent.click(rowButton);
    });

    expect(window.location.href).toBe(
      `/bahmni/clinical/#/default/patient/patient-uuid-1/dashboard/concept-set-group/All%20Observation%20Templates`
    );
    expect(
      container.querySelector(".ipd-draft-indicator__overlay-wrapper")
    ).toBeNull();

    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });
});
