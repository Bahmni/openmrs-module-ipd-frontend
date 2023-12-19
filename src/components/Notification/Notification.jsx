import React from "react";
import PropTypes from "prop-types";
import { NotificationCarbon } from "bahmni-carbon-ui";
import { FormattedMessage } from "react-intl";
import { I18nProvider } from "../../features/i18n/I18nProvider";
import "./Notification.scss";

export default function Notification(props) {
  const { hostData, hostApi } = props;
  const getMessage = () => {
    switch (hostData?.notificationKind) {
      case "success":
        return (
          <I18nProvider>
            <FormattedMessage id={hostData.messageId} />
          </I18nProvider>
        );
      case "warning":
        return (
          <I18nProvider>
            <FormattedMessage id={hostData.messageId} />
          </I18nProvider>
        );
    }
  };
  const title = getMessage();

  return (
    <NotificationCarbon
      className="notification"
      showMessage={true}
      title={title}
      kind={hostData?.notificationKind}
      onClose={() => {
        hostApi?.onClose();
      }}
      hideCloseButton={true}
    />
  );
}

Notification.propTypes = {
  hostData: PropTypes.shape({
    notificationKind: PropTypes.string.isRequired,
  }),
  hostApi: PropTypes.shape({
    onClose: PropTypes.func,
  }).isRequired,
};
