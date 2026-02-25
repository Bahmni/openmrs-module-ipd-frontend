/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


import React from "react";
import PropTypes from "prop-types";
import DrugListCell from "./DrugListCell.jsx";

export default function DrugList(props) {
  const { drugDetails } = props;
  return (
    <div>
      <table style={{ overflow: "hidden" }}>
        <tbody>
          {drugDetails.map((drugDetail, index) => {
            return (
              <tr key={index}>
                <DrugListCell drugInfo={drugDetail} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

DrugList.propTypes = {
  drugDetails: PropTypes.array.isRequired,
};
