import React from "react";
import PropTypes from "prop-types";
import { Toggletip, ToggletipButton, ToggletipContent } from "@carbon/react";
import "./IconToggletip.scss";

// Carbon v11 replacement for the v10 click-to-open `<Tooltip renderIcon={...}>`:
// an icon button that opens an interactive bubble containing `children`.
const IconToggletip = ({
  icon,
  children,
  align = "bottom-start",
  className = "",
  label = "Show information",
}) => (
  <Toggletip align={align} className={`icon-toggletip ${className}`.trim()}>
    <ToggletipButton label={label}>{icon}</ToggletipButton>
    <ToggletipContent>{children}</ToggletipContent>
  </Toggletip>
);

IconToggletip.propTypes = {
  icon: PropTypes.node.isRequired,
  children: PropTypes.node,
  align: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
};

export default IconToggletip;
