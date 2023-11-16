import React from "react";
import PropTypes from "prop-types";
import AdministeredIcon from "../../../../icons/administered.svg";
import AdministeredLateIcon from "../../../../icons/administered-late.svg";
import LateIcon from "../../../../icons/late.svg";
import NotAdministeredIcon from "../../../../icons/not-administered.svg";
import PendingIcon from "../../../../icons/pending.svg";
import { TooltipCarbon } from "bahmni-carbon-ui";

export default function SVGIcon(props) {
  const { iconType, info } = props;
  let icon,
    clickable = false;
  switch (iconType) {
    case "Administered":
      icon = <AdministeredIcon />;
      clickable = true;
      break;
    case "Not-Administered":
      icon = <NotAdministeredIcon />;
      break;
    case "Late":
      icon = <LateIcon />;
      break;
    case "Administered-Late":
      icon = <AdministeredLateIcon />;
      clickable = true;
      break;
    default:
      icon = <PendingIcon />;
  }

  return (
    <div>
      {info && clickable ? (
        <TooltipCarbon icon={() => icon} content={info} />
      ) : (
        icon
      )}
    </div>
  );
}

SVGIcon.propTypes = {
  iconType: PropTypes.string.isRequired,
  info: PropTypes.string,
};
