// mock the fetch global using jest
require("jest-fetch-mock").enableMocks();

// extend jest matchers with @testing-library/jest-dom
require("@testing-library/jest-dom");

// mock out i18n module with __mock__ based files
jest.mock("./features/i18n/utils");

// jsdom does not provide these browser APIs used by @carbon/react and react-dom/server
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!global.MessageChannel) {
  // unref the ports so open channels don't keep jest from exiting (in-band runs hang otherwise)
  const { MessageChannel: NodeMessageChannel } = require("worker_threads");
  global.MessageChannel = class MessageChannel {
    constructor() {
      const channel = new NodeMessageChannel();
      channel.port1.unref();
      channel.port2.unref();
      return channel;
    }
  };
}
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}

// react-intl v3 tolerated FormattedMessage / useIntl without an <IntlProvider>
// (falling back to defaultMessage); v4+ throws. Many specs render components
// without a provider, so fall back to a default English intl when none exists.
jest.mock("react-intl", () => {
  const React = require("react");
  const actual = jest.requireActual("react-intl");
  const fallbackIntl = actual.createIntl({
    locale: "en",
    onError: () => {},
  });
  const useIntl = () => React.useContext(actual.IntlContext) || fallbackIntl;
  const FormattedMessage = (props) =>
    React.useContext(actual.IntlContext)
      ? React.createElement(actual.FormattedMessage, props)
      : React.createElement(
          actual.RawIntlProvider,
          { value: fallbackIntl },
          React.createElement(actual.FormattedMessage, props)
        );
  return { ...actual, useIntl, FormattedMessage };
});
