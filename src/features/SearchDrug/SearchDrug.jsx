import React, { useState } from "react";
import PropTypes from "prop-types";
import { ComboBox } from "carbon-components-react";
import { searchDrugsByName } from "../../utils/CommonUtils";
import { Title } from "bahmni-carbon-ui";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";


const SearchDrug = (props) => {
  const { onChange } = props;
  const [items, setItems] = useState([]);
  const intl = useIntl();

  const onChangeHandler = async (searchStr) => {
    if (searchStr.length > 1) {
      const response = await searchDrugsByName(searchStr);
      if (response.status === 200) {
        const drugs = response.data.results;
        if (drugs.length === 0) {
          setItems([
            {
              label: <FormattedMessage id={"NO_DRUGS_FOUND_MESSAGE"} defaultMessage={"No Drugs Found"} />,
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
        placeholder={intl.formatMessage({ id: "SELECT_DRUG_PLACEHOLDER", defaultMessage: "Type to Search Drug" })}
        onChange={(e) => {
          onChange(e.selectedItem);
        }}
        size={"xl"}
        titleText={
          <Title
            text={intl.formatMessage({ id: "DRUG_NAME_LABEL", defaultMessage: "Drug Name (Emergency / Ad hoc)" })}
            isRequired={true}
          />
        }
        onInputChange={onChangeHandler}
      />
    </div>
  );
};

SearchDrug.propTypes = {
  onChange: PropTypes.func.isRequired,
};
export default SearchDrug;
