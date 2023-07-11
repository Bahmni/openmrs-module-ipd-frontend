import PropTypes from "prop-types";
import { IntlProvider } from "react-intl";
import { getLocale, getTranslations } from "./utils";
import React, { useEffect, useState, useMemo } from "react";

export function I18nProvider({ children }) {
  const [messages, setMessages] = useState({});
  const locale = useMemo(getLocale, []);

  useEffect(() => {
    getTranslations(locale).then(setMessages);
  }, []);

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
