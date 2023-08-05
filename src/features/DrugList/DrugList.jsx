import React from "react";
import PropTypes from "prop-types";
import DrugListCell from "../DrugListCell/DrugListCell.jsx";

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
