import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import PropTypes from "prop-types";
import { Loading, Tab, Tabs, TextArea, Modal } from "carbon-components-react";
import "../styles/EmergencyTasks.scss";
import {
  fetchMedicationConfig,
  getDrugOrdersConfig,
  getProviders,
  saveEmergencyMedication,
} from "../utils/EmergencyTasksUtils";
import {
  NumberInputCarbon,
  Title,
  Dropdown,
  DatePickerCarbon,
  TimePicker24Hour,
} from "bahmni-carbon-ui";
import _ from "lodash";
import {
  performerFunction,
  requesterFunction,
  timeText12,
  timeText24,
} from "../../../../constants";
import SearchDrug from "../../../SearchDrug/SearchDrug";
import moment from "moment/moment";
import {
  formatDate,
  dateTimeToEpochUTCTime,
} from "../../../../utils/DateTimeUtils";
import AdministeredMedicationList from "./AdministeredMedicationList";
import { IPDContext } from "../../../../context/IPDContext";

const AddEmergencyTasks = (props) => {
  const {
    patientId,
    providerId,
    updateEmergencyTasksSlider,
    setShowSuccessNotification,
    setSuccessMessage,
  } = props;
  const [isSaveDisabled, updateIsSaveDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dosageConfig, setDosageConfig] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const { config = {} } = useContext(IPDContext);
  const { drugChart = {} } = config;
  const enable24hour = drugChart.enable24HourTime;

  const [selectedDrug, setSelectedDrug] = useState({});
  const [doseUnits, setDoseUnits] = useState({});
  const [administrationDate, setAdministrationDate] = useState(new Date());
  const [administrationTime, setAdministrationTime] = useState(
    formatDate(new Date(), "HH:mm")
  );
  const [requestedProvider, setRequestedProvider] = useState({});
  const [routes, setRoutes] = useState({});
  const [dosage, setDosage] = useState(undefined);
  const [notes, setNotes] = useState("");
  const [emergencyTask, setEmergencyTask] = useState({});
  const [popupMedicationData, setPopupMedicationData] = useState({});

  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [atleastOneFieldFilled, setAtleastOneFieldFilled] = useState(false);
  const [isTimeChanged, setIsTimeChanged] = useState(false);
  const [isDateChanged, setIsDateChanged] = useState(false);
  const [isInvalidTime, setIsInvalidTime] = useState(false);
  const [invalidText, setInvalidText] = useState(false);
  const invalidTimeText24Hour = (
    <FormattedMessage
      id={"INVALID_TIME"}
      defaultMessage={"Please enter valid time"}
    />
  );
  const invalidFutureTimeText = (
    <FormattedMessage
      id={"FUTURE_TIME"}
      defaultMessage={"Future time is not allowed"}
    />
  );
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
        data
          .map((provider) => {
            return {
              label: provider.person.display,
              value: provider,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    }
    setIsLoading(false);
  };

  const fetchDrugFormDefaults = async () => {
    setDosageConfig(await fetchMedicationConfig());
  };

  const drugSearchHandler = (item) => {
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
  };

  const closeModal = () => {
    setOpenConfirmationModal(false);
  };

  const handleClose = () => {
    if (isSaveDisabled && !atleastOneFieldFilled) {
      updateEmergencyTasksSlider(false);
      setShowWarningNotification(false);
    } else {
      setShowWarningNotification(true);
    }
  };

  const sliderCloseActions = {
    onCancel: () => {
      setShowWarningNotification(false);
      updateEmergencyTasksSlider(false);
    },
    onClose: () => {
      setShowWarningNotification(false);
    },
  };

  const createEmergencyMedicationPayload = () => {
    const time = administrationTime.split(":");
    const date = new Date(administrationDate);
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    const utcTimeEpoch = dateTimeToEpochUTCTime(date);
    const emergencyMedicationPayload = {
      patientUuid: patientId,
      drugUuid: selectedDrug?.uuid,
      dose: dosage,
      doseUnits: doseUnits?.value,
      route: routes?.value,
      providers: [
        { providerUuid: providerId, function: performerFunction },
        {
          providerUuid: requestedProvider?.uuid,
          function: requesterFunction,
        },
      ],
      notes: [{ authorUuid: providerId, text: notes }],
      status: "completed",
      administeredDateTime: utcTimeEpoch,
    };
    setPopupMedicationData({
      [selectedDrug?.uuid]: {
        displayName: selectedDrug?.name,
        doseType: doseUnits?.value,
        dosage: dosage,
        route: routes?.value,
        actualTime: moment.utc(date),
        status: "completed",
      },
    });
    return emergencyMedicationPayload;
  };

  const handlePrimaryButtonClick = async () => {
    updateIsSaveDisabled(true);
    const response = await saveEmergencyMedication(emergencyTask);
    if (response.status === 200) {
      updateIsSaveDisabled(false);
      saveAdhocTasks();
    }
  };

  const saveAdhocTasks = () => {
    setShowSuccessNotification(true);
    setSuccessMessage("EMERGENCY_TASK_SAVE_MESSAGE");
    setOpenConfirmationModal(false);
    updateEmergencyTasksSlider(false);
  };

  const handleSave = () => {
    setEmergencyTask(createEmergencyMedicationPayload());
    setOpenConfirmationModal(true);
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
      !isInvalidTime &&
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
      setAtleastOneFieldFilled(false);
      if (
        dosage ||
        isDateChanged ||
        isTimeChanged ||
        !_.isEmpty(doseUnits) ||
        !_.isEmpty(routes) ||
        !_.isEmpty(requestedProvider) ||
        !_.isEmpty(notes)
      ) {
        setAtleastOneFieldFilled(true);
      }
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
    isInvalidTime,
  ]);

  useEffect(() => {
    customValidation(administrationTime);
  }, [administrationDate]);

  const customValidation = (time) => {
    if (time) {
      if (
        formatDate(administrationDate) === formatDate(new Date()) &&
        time > formatDate(new Date(), "HH:mm")
      ) {
        setIsInvalidTime(true);
        setInvalidText(invalidFutureTimeText);
      } else {
        setIsInvalidTime(false);
      }
    }
  };

  const actionForInvalidTime = (invalid) => {
    setIsInvalidTime(invalid);
    setInvalidText(invalidTimeText24Hour);
  };

  return (
    <>
      <SideBarPanel
        title={
          <FormattedMessage
            id="ADD_NURSING TASK"
            defaultMessage={"Add Nursing Task"}
          />
        }
        closeSideBar={handleClose}
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
                <SearchDrug onChange={drugSearchHandler} />
                <div className="inline-field">
                  <div className="dosage-section-container">
                    <NumberInputCarbon
                      id={"Dropdown"}
                      onChange={setDosage}
                      style={{ width: "50%" }}
                      value={dosage}
                      label={"Dose"}
                      isRequired={true}
                      min={0}
                    />
                    <Dropdown
                      id={"Dosage Dropdown"}
                      onChange={(e) => {
                        setDoseUnits(e);
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
                      setRoutes(e);
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
                      setIsDateChanged(true);
                    }}
                    title={"Administration Date"}
                    isRequired={true}
                    value={administrationDate}
                    dateFormat={"d M Y"}
                    maxDate={new Date()}
                  />
                  <TimePicker24Hour
                    defaultTime={administrationTime}
                    onChange={(e) => {
                      e != "" && setAdministrationTime(e);
                      setIsTimeChanged(true);
                    }}
                    labelText={
                      enable24hour
                        ? `Administration Time (${timeText24})`
                        : `Administration Time (${timeText12})`
                    }
                    width={"100%"}
                    isRequired={true}
                    customValidation={customValidation}
                    actionForInvalidTime={actionForInvalidTime}
                    invalid={isInvalidTime}
                    invalidText={invalidText}
                  />
                </div>
                <Dropdown
                  id={"Provider-info"}
                  onChange={(selectedItem) => {
                    setRequestedProvider(selectedItem?.value);
                  }}
                  placeholder={"Select Provider"}
                  titleText={"Acknowledgement Requested From"}
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
        <Modal
          open={openConfirmationModal}
          onRequestClose={closeModal}
          onSecondarySubmit={closeModal}
          preventCloseOnClickOutside={true}
          modalHeading={
            <FormattedMessage
              id={"EMERGENCY_TASK_CONFIRMATION"}
              defaultMessage={"Please confirm the emergency medication task"}
            />
          }
          primaryButtonText={
            <FormattedMessage
              id={"DRUG_CHART_MODAL_SAVE"}
              defaultMessage={"Save"}
            />
          }
          secondaryButtonText={
            <FormattedMessage
              id={"DRUG_CHART_MODAL_CANCEL"}
              defaultMessage={"Cancel"}
            />
          }
          onRequestSubmit={handlePrimaryButtonClick}
          primaryButtonDisabled={isSaveDisabled}
        >
          <hr />
          <AdministeredMedicationList list={popupMedicationData} />
        </Modal>
        <SaveAndCloseButtons
          onSave={handleSave}
          onClose={handleClose}
          isSaveDisabled={isSaveDisabled}
        />
      </SideBarPanel>

      {showWarningNotification && (
        <SideBarPanelClose
          className="warning-notification"
          open={true}
          message={
            <FormattedMessage
              id="TREATMENTS_WARNING_TEXT"
              defaultMessage="You will lose the details entered. Do you want to continue?"
            />
          }
          label={""}
          primaryButtonText={<FormattedMessage id="NO" defaultMessage="No" />}
          secondaryButtonText={
            <FormattedMessage id="YES" defaultMessage="Yes" />
          }
          onSubmit={sliderCloseActions.onClose}
          onSecondarySubmit={sliderCloseActions.onCancel}
          onClose={sliderCloseActions.onClose}
        />
      )}
    </>
  );
};

AddEmergencyTasks.propTypes = {
  patientId: PropTypes.string.isRequired,
  providerId: PropTypes.string.isRequired,
  updateEmergencyTasksSlider: PropTypes.func.isRequired,
  setShowSuccessNotification: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
};
export default AddEmergencyTasks;
