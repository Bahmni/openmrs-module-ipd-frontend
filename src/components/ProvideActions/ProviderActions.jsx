import React, { useState } from "react";
import {
  Logout24,
  UserAvatar24,
  ChevronUp16,
  ChevronDown16,
} from "@carbon/icons-react";
import "./ProviderActions.scss";
import { FormattedMessage } from "react-intl";
import { getCookies } from "../../utils/CommonUtils";
import PropTypes from "prop-types";

export const ProviderActions = (props) => {
  const { onLogOut } = props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cookies = getCookies();
  const username = cookies["bahmni.user"]?.replace(/^"(.*)"$/, "$1");
  const handleChangePassword = () => {
    window.location = "/bahmni/home/#/changePassword";
  };
  const handleMenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div className={"provider-actions"}>
      <UserAvatar24 />
      <div>
        <div className={"provider-menu"} onClick={handleMenu}>
          <div className={"username"}>{username}</div>
          {isDropdownOpen ? <ChevronUp16 /> : <ChevronDown16 />}
        </div>
        {isDropdownOpen && (
          <div className={"dropdown"}>
            <div onClick={handleChangePassword}>
              <FormattedMessage
                id={"CHANGE_PASSWORD"}
                defaultMessage={"Change Password"}
              />
            </div>
          </div>
        )}
      </div>
      <Logout24 onClick={onLogOut} />
    </div>
  );
};

ProviderActions.propTypes = {
  onLogOut: PropTypes.func.isRequired,
};
