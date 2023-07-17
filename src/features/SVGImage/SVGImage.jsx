import React from "react";
import PropTypes from "prop-types";
import AdministeredIcon from "../../icons/administered.svg";
import AdministeredLateIcon from "../../icons/administered-late.svg";
import LateIcon from "../../icons/late.svg";
import NotAdministeredIcon from "../../icons/not-administered.svg";
import PendingIcon from "../../icons/pending.svg";
export default function Image(props) {
  const { iconType } = props;
  switch (iconType) {
    case "Administered":
      return <AdministeredIcon />;
    case "Not-Administered":
      return <NotAdministeredIcon />;
    case "Pending":
      return <PendingIcon />;
    case "Late":
      return <LateIcon />;
    case "Administered-Late":
      return <AdministeredLateIcon />;
  }
}

Image.propTypes = {
  iconType: PropTypes.string.isRequired,
};
