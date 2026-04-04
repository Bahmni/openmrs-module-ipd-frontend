/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { getLocale, getTranslations } from "./utils";

export function I18nProvider({ children }) {
  const [messages, setMessages] = useState(undefined);
  const locale = useMemo(getLocale, []);

  useEffect(() => {
    getTranslations(locale).then(setMessages);
  }, []);

  if (!messages) {
    return <div></div>;
  }

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
