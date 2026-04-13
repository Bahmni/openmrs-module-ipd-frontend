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

jest.mock("./DraftOverlayMockData", () => ({
  mockFormDrafts: [
    {
      patientName: "John Doe",
      patientUuid: "patient-uuid-1",
      identifier: "IQ000001",
      timestamp: "2024-01-15T10:30:00.000Z",
    },
  ],
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node) => node,
}));

describe("DraftIndicator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("should show red dot when there are drafts", async () => {
    let container;
    await act(async () => {
      ({ container } = render(<DraftIndicator />));
    });
    expect(
      container.querySelector(".ipd-draft-indicator__red-dot")
    ).toBeTruthy();
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
});
