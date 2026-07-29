import React from "react";
import { useMemo } from 'react';
import PropTypes from "prop-types";
import { NotificationCarbon } from "bahmni-carbon-ui";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import "./Notification.scss";

export default function Notification(props) {
  const { hostData, hostApi } = props;
  const { notificationKind, messageId, defaultMessage, messageDuration = 2000 } = hostData;
  const getTitle = () => {
    if (defaultMessage) return defaultMessage;
    return (
      <I18nProvider>
        <FormattedMessage id={messageId} />
      </I18nProvider>
    );
  };

  const title = useMemo(() => getTitle(), [messageId, defaultMessage]);

  return (
    <NotificationCarbon
      className="notification"
      showMessage={true}
      title={title}
      kind={notificationKind}
      onClose={() => {
        hostApi?.onClose();
      }}
      hideCloseButton={true}
      messageDuration={messageDuration}
    />
  );
}

Notification.propTypes = {
  hostData: PropTypes.shape({
    notificationKind: PropTypes.string.isRequired,
    messageDuration: PropTypes.number,
    messageId: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  hostApi: PropTypes.shape({
    onClose: PropTypes.func,
  }).isRequired,
};
