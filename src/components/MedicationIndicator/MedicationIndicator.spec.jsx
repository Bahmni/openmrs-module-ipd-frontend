import React from "react";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import MedicationIndicator from "./MedicationIndicator";
import "@testing-library/jest-dom/extend-expect";

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

const renderIndicator = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <MedicationIndicator {...props} />
    </IntlProvider>
  );

describe("MedicationIndicator", () => {
  it("renders a regular chiclet with the count", () => {
    const { getByText, getByTestId } = renderIndicator({
      type: "regular",
      count: 4,
    });
    expect(getByText("4 Regular")).toBeTruthy();
    expect(getByTestId("medication-indicator-regular")).toHaveClass(
      "medication-indicator--regular"
    );
  });

  it("renders a vdp chiclet with the count", () => {
    const { getByText, getByTestId } = renderIndicator({
      type: "vdp",
      count: 2,
    });
    expect(getByText("2 VDP")).toBeTruthy();
    expect(getByTestId("medication-indicator-vdp")).toHaveClass(
      "medication-indicator--vdp"
    );
  });

  it("does not render when count is zero", () => {
    const { queryByTestId } = renderIndicator({ type: "regular", count: 0 });
    expect(queryByTestId("medication-indicator-regular")).toBeNull();
  });

  it("does not render when count is negative", () => {
    const { queryByTestId } = renderIndicator({ type: "vdp", count: -1 });
    expect(queryByTestId("medication-indicator-vdp")).toBeNull();
  });
});
