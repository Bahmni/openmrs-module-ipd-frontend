import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "carbon-components-react";
import AdministeredIcon from "../../../../icons/administered.svg";
import AdministeredLateIcon from "../../../../icons/administered-late.svg";
import LateIcon from "../../../../icons/late.svg";
import NotAdministeredIcon from "../../../../icons/not-administered.svg";
import PendingIcon from "../../../../icons/pending.svg";
import StoppedIcon from "../../../../icons/stopped.svg";
import "../styles/SVGIcon.scss";

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
      clickable = true;
      break;
    case "Late":
      icon = <LateIcon />;
      break;
    case "Administered-Late":
      icon = <AdministeredLateIcon />;
      clickable = true;
      break;
    case "Stopped":
      icon = <StoppedIcon />;
      break;
    default:
      icon = <PendingIcon />;
  }

  return (
    <div>
      {info && clickable ? (
        <Tooltip autoOrientation={true} renderIcon={() => icon}>
          {info}
        </Tooltip>
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
