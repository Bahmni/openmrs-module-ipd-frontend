import React, { useEffect, useState } from "react";
import {
  Logout24,
  UserAvatar24,
  ChevronUp16,
  ChevronDown16,
  IbmCloudHyperProtectCryptoServices24,
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
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".provider-actions")) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className={"provider-actions"}>
      <div>
        <div
          className={`provider-menu ${isDropdownOpen && "menu-selected"}`}
          onClick={handleMenu}
        >
          <UserAvatar24 className={"user-avatar"} />
          <div className={"username"}>{username}</div>
          {isDropdownOpen ? <ChevronUp16 /> : <ChevronDown16 />}
        </div>
        {isDropdownOpen && (
          <div className={"dropdown"}>
            <div onClick={handleChangePassword}>
              <IbmCloudHyperProtectCryptoServices24 />
              <FormattedMessage
                id={"CHANGE_PASSWORD"}
                defaultMessage={"Change Password"}
              />
            </div>
          </div>
        )}
      </div>
      <Logout24 onClick={onLogOut} className={"logout"} />
    </div>
  );
};

ProviderActions.propTypes = {
  onLogOut: PropTypes.func.isRequired,
};
