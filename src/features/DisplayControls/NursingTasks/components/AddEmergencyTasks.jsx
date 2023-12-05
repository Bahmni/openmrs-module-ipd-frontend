import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import PropTypes from "prop-types";
import { Loading, Tab, Tabs, TextArea } from "carbon-components-react";
import "../styles/EmergencyTasks.scss";
import {
  fetchMedicationConfig,
  getDrugOrdersConfig,
  getProviders,
} from "../utils/EmergencyTasksUtils";
import {
  NumberInputCarbon,
  Title,
  Dropdown,
  DatePickerCarbon,
  TimePicker24Hour,
} from "bahmni-carbon-ui";
import _ from "lodash";
import SearchDrug from "../../../SearchDrug/SearchDrug";

const AddEmergencyTasks = (props) => {
  const { updateEmergencyTasksSlider } = props;
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dosageConfig, setDosageConfig] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);

  const [selectedDrug, setSelectedDrug] = useState({});
  const [doseUnits, setDoseUnits] = useState({});
  const [administrationDate, setAdministrationDate] = useState();
  const [administrationTime, setAdministrationTime] = useState("");
  const [requestedProvider, setRequestedProvider] = useState({});
  const [routes, setRoutes] = useState({});
  const [dosage, setDosage] = useState(undefined);
  const [notes, setNotes] = useState("");

  const fetchDrugOrderConfig = async () => {
    setIsLoading(true);
    const drugOrderConfigResponse = await getDrugOrdersConfig();
    if (drugOrderConfigResponse.status === 200) {
      const { doseUnits, routes } = drugOrderConfigResponse.data;
      setUnitOptions(
        doseUnits.map((unit) => {
          return {
            label: unit.name,
            value: unit.name,
          };
        })
      );
      setRouteOptions(
        routes.map((route) => {
          return {
            label: route.name,
            value: route.name,
          };
        })
      );
    }
  };

  const fetchAllProviders = async () => {
    const providerResponse = await getProviders();
    if (providerResponse.status === 200) {
      const data = providerResponse.data.results;
      setProviderOptions(
        data.map((provider) => {
          return {
            label: provider.person.display,
            value: provider,
          };
        })
      );
    }
    setIsLoading(false);
  };

  const fetchDrugFormDefaults = async () => {
    setDosageConfig(await fetchMedicationConfig());
  };

  useEffect(() => {
    fetchDrugOrderConfig();
    fetchDrugFormDefaults();
    fetchAllProviders();
  }, []);

  useEffect(() => {
    if (
      dosage &&
      administrationDate &&
      !(
        _.isEmpty(doseUnits) ||
        _.isEmpty(routes) ||
        _.isEmpty(requestedProvider) ||
        _.isEmpty(administrationTime) ||
        _.isEmpty(notes)
      )
    ) {
      updateIsSaveDisabled(false);
    } else {
      updateIsSaveDisabled(true);
    }
  }, [
    selectedDrug,
    dosage,
    doseUnits,
    routes,
    administrationDate,
    administrationTime,
    requestedProvider,
    notes,
  ]);
  return (
    <SideBarPanel
      title={
        <FormattedMessage
          id="ADD_NURSING TASK"
          defaultMessage={"Add Nursing Task"}
        />
      }
      closeSideBar={() => {
        updateEmergencyTasksSlider(false);
      }}
    >
      <div className={"emergency-task-slider"}>
        <Tabs>
          <Tab
            id="Medication"
            label={
              <FormattedMessage
                id={"MEDICATION"}
                defaultMessage={"Medication"}
              />
            }
          >
            {isLoading && (
              <div>
                <Loading />
              </div>
            )}
            <div className={"emergency-task-slider-content"}>
              <SearchDrug
                onChange={(item) => {
                  if (item) {
                    setSelectedDrug(item.value);
                    const {
                      dosageForm: { display },
                    } = item.value;
                    if (Object.keys(dosageConfig).includes(display)) {
                      const { doseUnits, route } = dosageConfig[display];
                      if (doseUnits) {
                        setDoseUnits({ label: doseUnits, value: doseUnits });
                      }
                      setRoutes({ label: route, value: route });
                    }
                  }
                }}
              />
              <div className="inline-field">
                <div className="dosage-section-container">
                  <NumberInputCarbon
                    id={"Dropdown"}
                    onChange={setDosage}
                    style={{ width: "50%" }}
                    value={dosage}
                    label={"Dose"}
                    isRequired={true}
                  />
                  <Dropdown
                    id={"Dosage Dropdown"}
                    onChange={(e) => {
                      if (e) setDoseUnits(e);
                    }}
                    placeholder={"Select Unit"}
                    titleText={""}
                    width={window.innerWidth > 480 ? "170px" : "100%"}
                    style={{ paddingLeft: "10px", marginRight: 0 }}
                    options={unitOptions}
                    selectedValue={doseUnits}
                  />
                </div>
                <Dropdown
                  id={"Route-Dropdown"}
                  onChange={(e) => {
                    if (e) setRoutes(e);
                  }}
                  placeholder={"Select Route"}
                  titleText={"Route"}
                  isRequired={true}
                  options={routeOptions}
                  width={"100%"}
                  selectedValue={routes}
                />
              </div>
              <div
                className={"administration-info"}
                style={{ display: "flex", gap: "10px" }}
              >
                <DatePickerCarbon
                  id={"Administration-Date"}
                  onChange={(e) => {
                    setAdministrationDate(new Date(e[0]));
                  }}
                  title={"Administration Date"}
                  isRequired={true}
                />
                <TimePicker24Hour
                  onChange={setAdministrationTime}
                  labelText="Administration Time"
                  width={"100%"}
                  isRequired={true}
                />
              </div>
              <Dropdown
                id={"Provider-info"}
                onChange={(selectedItem) => {
                  setRequestedProvider(selectedItem?.value);
                }}
                placeholder={"Select Provider"}
                titleText={"Approval Requested From"}
                isRequired={true}
                options={providerOptions}
                width={"100%"}
              />
              <TextArea
                labelText={<Title text={"Notes"} isRequired={true} />}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                placeholder={"Enter a maximum of 250 characters"}
                maxCount={250}
                rows={4}
              />
            </div>
          </Tab>
          <Tab
            id="Non - Medication"
            disabled
            label={
              <FormattedMessage
                id={"NON_MEDICATION"}
                defaultMessage={"Non - Medication"}
              />
            }
          ></Tab>
        </Tabs>
      </div>
      <SaveAndCloseButtons
        onSave={() => {
          updateEmergencyTasksSlider(false);
        }}
        onClose={() => {
          updateEmergencyTasksSlider(false);
        }}
        isSaveDisabled={isSaveDisabled}
      />
    </SideBarPanel>
  );
};

AddEmergencyTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
  updateEmergencyTasksSlider: PropTypes.func.isRequired,
};
export default AddEmergencyTasks;
