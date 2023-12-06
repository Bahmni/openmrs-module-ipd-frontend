import React, { useState } from "react";
import PropTypes from "prop-types";
import { ComboBox } from "carbon-components-react";
import { searchDrugsByName } from "../../utils/CommonUtils";
import { Title } from "bahmni-carbon-ui";

const SearchDrug = (props) => {
  const { onChange } = props;
  const [items, setItems] = useState([]);

  const onChangeHandler = async (searchStr) => {
    if (searchStr.length > 1) {
      const response = await searchDrugsByName(searchStr);
      if (response.status === 200) {
        const drugs = response.data.results;
        if (drugs.length === 0) {
          setItems([
            {
              label: "No Drugs Found",
              disabled: true,
            },
          ]);
        } else {
          setItems(
            drugs.map((drug) => {
              return {
                label: drug.name,
                value: drug,
              };
            })
          );
        }
      }
    } else {
      setItems([]);
    }
  };

  return (
    <div>
      <ComboBox
        id={"SearchDrug"}
        items={items}
        placeholder={"Type to Search Drug"}
        onChange={(e) => {
          onChange(e.selectedItem);
        }}
        size={"xl"}
        titleText={<Title text={"Drug Name"} isRequired={true} />}
        onInputChange={onChangeHandler}
      />
    </div>
  );
};

SearchDrug.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default SearchDrug;
