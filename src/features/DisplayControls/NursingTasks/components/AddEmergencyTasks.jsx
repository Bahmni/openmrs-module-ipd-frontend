import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import SaveAndCloseButtons from "../../../SaveAndCloseButtons/components/SaveAndCloseButtons";
import SideBarPanel from "../../../SideBarPanel/components/SideBarPanel";
import { SideBarPanelClose } from "../../../SideBarPanel/components/SideBarPanelClose";
import PropTypes from "prop-types";
import {
  Button,
  Loading,
  Tab,
  Tabs,
  TextArea,
  Modal,
} from "carbon-components-react";
import "../styles/EmergencyTasks.scss";
import {
  fetchMedicationConfig,
  getDrugOrdersConfig,
  getProviders,
  saveEmergencyMedication,
  getEncounterUuid,
  getEncounterType,
  saveNonMedicationTask,
  saveBulkNonMedicationTasks,
} from "../utils/EmergencyTasksUtils";
import {
  NumberInputCarbon,
  Title,
  Dropdown,
  DatePickerCarbon,
  TimePicker24Hour,
  TimePicker,
} from "bahmni-carbon-ui";
import _ from "lodash";
import {
  performerFunction,
  PRIVILEGE_CONSTANTS,
  requesterFunction,
  timeFormatFor12Hr,
  timeFormatFor24Hr,
  timeText12,
  timeText24,
} from "../../../../constants";
import SearchDrug from "../../../SearchDrug/SearchDrug";
import moment from "moment/moment";
import {
  formatDate,
  dateTimeToEpochUTCTime,
  areDatesSame,
  convertTo24Hour,
  isTimeInFuture,
} from "../../../../utils/DateTimeUtils";
import AdministeredMedicationList from "./AdministeredMedicationList";
import { IPDContext } from "../../../../context/IPDContext";
import { getCookies, isUserPrivileged } from "../../../../utils/CommonUtils";
import { useIntl } from "react-intl";

const MAX_TASK_NAME_LENGTH = 255;

const AddEmergencyTasks = (props) => {
  const {
    patientId,
    providerId,
    updateEmergencyTasksSlider,
    setShowNotification,
    setNotificationMessage,
    setNotificationStatus,
    hideMedicationTab = false,
    observationUuid,
    orderUuid,
    instruction = null,
    initialTaskName = null,
  } = props;

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dosageConfig, setDosageConfig] = useState({});
  const [unitOptions, setUnitOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [activeTab, setActiveTab] = useState(
    hideMedicationTab ? "Non-Medication" : "Medication"
  );
  const [nonMedicationTaskTypeOptions, setNonMedicationTaskTypeOptions] =
    useState({});
  const { config = {}, handleAuditEvent, currentUser } = useContext(IPDContext);
  const { providerFilter = {} } = config;
  const { attrName, attrValue } = providerFilter;
  const {
    enable24HourTime = {},
    nonMedicationTaskTypes = [],
    enableAddMultipleTask = false,
  } = config;

  const [selectedDrug, setSelectedDrug] = useState({});
  const [doseUnits, setDoseUnits] = useState({});
  const [administrationDate, setAdministrationDate] = useState(new Date());
  const [administrationTime, setAdministrationTime] = useState(
    formatDate(
      new Date(),
      enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
    )
  );
  const [requestedProvider, setRequestedProvider] = useState({});
  const [routes, setRoutes] = useState({});
  const [dosage, setDosage] = useState(undefined);
  const [notes, setNotes] = useState("");
  const [nonMedicationTasks, setNonMedicationTasks] = useState(() => {
    const defaultScheduleTime = formatDate(
      new Date(),
      enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
    );
    return [
      {
        id: crypto.randomUUID(),
        taskName: initialTaskName || "",
        scheduleTime: defaultScheduleTime,
        taskType: null,
      },
    ];
  });
  const [nonMedicationInvalidTimes, setNonMedicationInvalidTimes] = useState(
    {}
  );
  const [nonMedicationInvalidTexts, setNonMedicationInvalidTexts] = useState(
    {}
  );
  const [nonMedicationInvalidTaskNames, setNonMedicationInvalidTaskNames] =
    useState({});
  const [emergencyTask, setEmergencyTask] = useState({});
  const [popupMedicationData, setPopupMedicationData] = useState({});
  const [showWarningNotification, setShowWarningNotification] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [atleastOneFieldFilled, setAtleastOneFieldFilled] = useState(false);
  const [isTimeChanged, setIsTimeChanged] = useState(false);
  const [isDateChanged, setIsDateChanged] = useState(false);
  const [isInvalidTime, setIsInvalidTime] = useState(false);
  const [invalidText, setInvalidText] = useState();
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
  const invalidPastTimeText = (
    <FormattedMessage
      id={"FUTURE_TIME"}
      defaultMessage={"Past time is not allowed"}
    />
  );
  const intl = useIntl();
  const DOSE_LABEL = intl.formatMessage({
    id: "DOSE_LABEL",
    defaultMessage: "Dose",
  });
  const SELECT_DOSE_UNIT_PLACEHOLDER = intl.formatMessage({
    id: "SELECT_DOSE_UNIT_PLACEHOLDER",
    defaultMessage: "Select Unit",
  });
  const SELECT_ROUTE_PLACEHOLDER = intl.formatMessage({
    id: "SELECT_ROUTE_PLACEHOLDER",
    defaultMessage: "Select Route",
  });
  const ROUTE_LABEL = intl.formatMessage({
    id: "ROUTE_LABEL",
    defaultMessage: "Route",
  });
  const ADMINSTRATION_DATE_LABEL = intl.formatMessage({
    id: "ADMINSTRATION_DATE_LABEL",
    defaultMessage: "Administration Date",
  });
  const SELECT_PROVIDER_PLACEHOLDER = intl.formatMessage({
    id: "SELECT_PROVIDER_PLACEHOLDER",
    defaultMessage: "Select Provider",
  });
  const ACKNOWLEDGEMENT_PROVIDER_LABEL = intl.formatMessage({
    id: "ACKNOWLEDGEMENT_PROVIDER_LABEL",
    defaultMessage: "Acknowledgement Requested From",
  });
  const ADMINSTRATION_TIME_LABEL_24 = `${intl.formatMessage({
    id: "ADMINSTRATION_TIME_LABEL",
    defaultMessage: "Administration Time",
  })} (${timeText24})`;
  const ADMINSTRATION_TIME_LABEL_12 = `${intl.formatMessage({
    id: "ADMINSTRATION_TIME_LABEL",
    defaultMessage: "Administration Time",
  })} (${timeText12})`;
  const NOTES_LABEL = intl.formatMessage({
    id: "NOTES_LABEL",
    defaultMessage: "Notes",
  });
  const NOTES_PLACEHOLDER = intl.formatMessage({
    id: "NOTES_PLACEHOLDER",
    defaultMessage: "Enter a maximum of 250 characters",
  });
  const TASK_NAME_LABEL = intl.formatMessage({
    id: "TASK_NAME_LABEL",
    defaultMessage: "Task Name",
  });
  const TASK_NAME_PLACEHOLDER = intl.formatMessage({
    id: "TASK_NAME_PLACEHOLDER",
    defaultMessage: "Enter a title for the task ",
  });
  const SCHEDULE_TIME_LABEL_24 = `${intl.formatMessage({
    id: "SCHEDULE_TIME_LABEL",
    defaultMessage: "Schedule Time",
  })} (${timeText24})`;
  const SCHEDULE_TIME_LABEL_12 = `${intl.formatMessage({
    id: "SCHEDULE_TIME_LABEL",
    defaultMessage: "Schedule Time",
  })} (${timeText12})`;

  const getNonMedicationTaskTypeOptions = async () => {
    setNonMedicationTaskTypeOptions(
      nonMedicationTaskTypes
        .map((nonMedicationTaskTypeOption) => {
          return {
            label: nonMedicationTaskTypeOption,
            value: nonMedicationTaskTypeOption,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label))
    );
  };

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
    const providerResponse = await getProviders(attrName, attrValue);
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
      const { dosageForm } = item.value || {};
      if (
        dosageForm &&
        Object.keys(dosageConfig).includes(dosageForm?.display)
      ) {
        const { doseUnits, route } = dosageConfig[dosageForm?.display];
        if (doseUnits) {
          setDoseUnits({ label: doseUnits, value: doseUnits });
        }
        setRoutes({ label: route, value: route });
      }
    } else {
      setSelectedDrug({});
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
    const administrationTimeIn24Hr = convertTo24Hour(administrationTime);
    const time = administrationTimeIn24Hr.split(":");
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

  const getNonMedicationEncounterUuid = async () => {
    const cookies = getCookies();
    const { uuid: encounterTypeUuid } = await getEncounterType("Consultation");
    const { uuid: locationUuid } = JSON.parse(cookies["bahmni.user.location"]);
    if (!encounterTypeUuid || !locationUuid) {
      return null;
    }
    const activeEncounterPayload = {
      patientUuid: patientId,
      locationUuid: locationUuid,
      encounterTypeUuid: encounterTypeUuid,
    };
    const encounter = await getEncounterUuid(activeEncounterPayload);
    return encounter?.encounterUuid;
  };

  const createNonMedicationTaskPayload = (taskDetails, encounterUuid) => {
    const scheduleTimein24Hour = convertTo24Hour(taskDetails.scheduleTime);
    const scheduleDate = new Date();
    const time = scheduleTimein24Hour.split(":");
    scheduleDate.setHours(time[0]);
    scheduleDate.setMinutes(time[1]);
    const utcTimeEpoch = dateTimeToEpochUTCTime(scheduleDate);
    return {
      name: taskDetails.taskName,
      requestedStartTime: utcTimeEpoch * 1000,
      requestedEndTime: utcTimeEpoch * 1000,
      patientUuid: patientId,
      encounterUuid: encounterUuid,
      intent: "ORDER",
      taskType: taskDetails.taskType ? taskDetails.taskType : null,
      status: "REQUESTED",
      ...(observationUuid && {
        focus: {
          type: "Observation",
          reference: `Observation/${observationUuid}`,
        },
      }),
      ...(orderUuid && {
        basedOn: {
          type: "ServiceRequest",
          reference: `ServiceRequest/${orderUuid}`,
        },
      }),
    };
  };

  const handlePrimaryButtonClick = async () => {
    setIsSaveDisabled(true);
    const response = await saveEmergencyMedication(emergencyTask);
    if (response.status === 200) {
      setIsSaveDisabled(false);
      handleAuditEvent("CREATE_EMERGENCY_MEDICATION_TASK");
      saveAdhocTasks("success", "EMERGENCY_TASK_SAVE_MESSAGE");
    } else {
      setIsSaveDisabled(false);
      saveAdhocTasks("error", "EMERGENCY_TASK_SAVE_MESSAGE_FAILED");
    }
  };

  const saveAdhocTasks = (status, messageId) => {
    setShowNotification(true);
    setNotificationStatus(status);
    setNotificationMessage(messageId);
    setOpenConfirmationModal(false);
    updateEmergencyTasksSlider(false);
  };

  const updateNonMedicationTasksNotification = (status, messageId) => {
    setShowNotification(true);
    setNotificationStatus(status);
    setNotificationMessage(messageId);
    updateEmergencyTasksSlider(false);
  };

  const handleSave = async () => {
    if (activeTab === "Medication") {
      setEmergencyTask(createEmergencyMedicationPayload());
      setOpenConfirmationModal(true);
    } else {
      const encounterUuid = await getNonMedicationEncounterUuid();
      if (!encounterUuid) {
        setIsSaveDisabled(false);
        updateNonMedicationTasksNotification(
          "error",
          "NON_MEDICATION_TASK_SAVE_MESSAGE_FAILED"
        );
        return;
      }
      const nonMedicationTaskPayloads = nonMedicationTasks.map((taskDetails) =>
        createNonMedicationTaskPayload(taskDetails, encounterUuid)
      );
      let response;
      if (enableAddMultipleTask) {
        response = await saveBulkNonMedicationTasks(nonMedicationTaskPayloads);
      } else {
        response = await saveNonMedicationTask(nonMedicationTaskPayloads[0]);
      }
      if (response.status === 200) {
        setIsSaveDisabled(false);
        handleAuditEvent("CREATE_NON_MEDICATION_TASK");
        updateNonMedicationTasksNotification(
          "success",
          "NON_MEDICATION_TASK_SAVE_MESSAGE"
        );
      } else {
        setIsSaveDisabled(false);
        updateNonMedicationTasksNotification(
          "error",
          "NON_MEDICATION_TASK_SAVE_MESSAGE_FAILED"
        );
      }
    }
  };

  useEffect(() => {
    fetchDrugOrderConfig();
    fetchDrugFormDefaults();
    fetchAllProviders();
    getNonMedicationTaskTypeOptions();
  }, []);

  const handleNonMedicationSaveButton = () => {
    const hasInvalidTime = nonMedicationTasks.some(
      (taskDetails) => nonMedicationInvalidTimes[taskDetails.id]
    );
    const hasInvalidTaskName = nonMedicationTasks.some(
      (taskDetails) => nonMedicationInvalidTaskNames[taskDetails.id]
    );
    const hasEmptyRequiredField = nonMedicationTasks.some(
      (taskDetails) =>
        _.isEmpty(taskDetails.taskName?.trim()) ||
        _.isEmpty(taskDetails.scheduleTime)
    );
    if (
      !hasInvalidTime &&
      !hasInvalidTaskName &&
      !hasEmptyRequiredField &&
      nonMedicationTasks.length > 0
    ) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
    }
    setAtleastOneFieldFilled(
      nonMedicationTasks.some(
        (taskDetails) => !_.isEmpty(taskDetails.taskName?.trim())
      ) || nonMedicationTasks.length > 1
    );
  };

  const appendNonMedicationTask = () => {
    if (!enableAddMultipleTask) return;
    const sourceTask = nonMedicationTasks[nonMedicationTasks.length - 1];
    const currentTime = formatDate(
      new Date(),
      enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
    );
    setNonMedicationTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        taskName: initialTaskName || "",
        scheduleTime: currentTime,
        taskType: sourceTask?.taskType || null,
      },
    ]);
  };

  const removeNonMedicationTask = (taskId) => {
    setNonMedicationTasks((prev) =>
      prev.filter((taskDetails) => taskDetails.id !== taskId)
    );
    setNonMedicationInvalidTimes((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    setNonMedicationInvalidTexts((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    setNonMedicationInvalidTaskNames((prev) => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
  };

  const updateNonMedicationTask = (taskId, updates) => {
    setNonMedicationTasks((prev) =>
      prev.map((taskDetails) =>
        taskDetails.id === taskId ? { ...taskDetails, ...updates } : taskDetails
      )
    );
  };

  const setNonMedicationTaskType = (taskId, selectedItem) => {
    updateNonMedicationTask(taskId, { taskType: selectedItem?.value || null });
  };

  const updateNonMedicationInvalidState = (taskId, invalid, text = null) => {
    setNonMedicationInvalidTimes((prev) => ({ ...prev, [taskId]: invalid }));
    if (text) {
      setNonMedicationInvalidTexts((prev) => ({ ...prev, [taskId]: text }));
    } else if (!invalid) {
      // Clear stale error text when marking valid
      setNonMedicationInvalidTexts((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
    }
  };

  const validateTaskName = (taskId, taskName) => {
    if (taskName && taskName.length > MAX_TASK_NAME_LENGTH) {
      setNonMedicationInvalidTaskNames((prev) => ({
        ...prev,
        [taskId]: `Task name cannot exceed ${MAX_TASK_NAME_LENGTH} characters (current: ${taskName.length})`,
      }));
      return false;
    } else {
      setNonMedicationInvalidTaskNames((prev) => {
        const updated = { ...prev };
        delete updated[taskId];
        return updated;
      });
      return true;
    }
  };

  const handleMedicationSaveButton = () => {
    if (
      dosage &&
      administrationDate &&
      !isInvalidTime &&
      !(
        _.isEmpty(selectedDrug) ||
        _.isEmpty(doseUnits) ||
        _.isEmpty(routes) ||
        _.isEmpty(requestedProvider) ||
        _.isEmpty(administrationTime) ||
        _.isEmpty(notes)
      )
    ) {
      setIsSaveDisabled(false);
    } else {
      setIsSaveDisabled(true);
      setAtleastOneFieldFilled(false);
      if (
        dosage ||
        isDateChanged ||
        isTimeChanged ||
        !_.isEmpty(selectedDrug) ||
        !_.isEmpty(doseUnits) ||
        !_.isEmpty(routes) ||
        !_.isEmpty(requestedProvider) ||
        !_.isEmpty(notes)
      ) {
        setAtleastOneFieldFilled(true);
      }
    }
  };

  useEffect(() => {
    handleMedicationSaveButton();
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
    handleNonMedicationSaveButton();
  }, [
    nonMedicationTasks,
    nonMedicationInvalidTimes,
    nonMedicationInvalidTaskNames,
  ]);

  useEffect(() => {
    customValidation(administrationTime);
  }, [administrationDate]);

  const customValidation = (time) => {
    if (time) {
      if (
        areDatesSame(administrationDate, new Date()) &&
        isTimeInFuture(
          time,
          formatDate(
            new Date(),
            enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
          )
        )
      ) {
        setIsInvalidTime(true);
        setInvalidText(invalidFutureTimeText);
      } else {
        setIsInvalidTime(false);
      }
    }
  };

  const customNonMedicationTaskValidation = (taskId, time) => {
    if (time) {
      if (
        isTimeInFuture(
          time,
          formatDate(
            new Date(),
            enable24HourTime ? timeFormatFor24Hr : timeFormatFor12Hr
          )
        )
      ) {
        updateNonMedicationInvalidState(taskId, false);
      } else {
        updateNonMedicationInvalidState(taskId, true, invalidPastTimeText);
      }
    }
  };

  const actionForInvalidTime = (invalid) => {
    setIsInvalidTime(invalid);
    setInvalidText(invalidTimeText24Hour);
    setIsSaveDisabled(true);
  };

  const actionForNonMedicationInvalidTime = (taskId, invalid) => {
    updateNonMedicationInvalidState(taskId, invalid, invalidTimeText24Hour);
    setIsSaveDisabled(true);
  };

  return (
    <>
      <SideBarPanel
        title={
          <FormattedMessage
            id="ADD_NURSING_TASK"
            defaultMessage={"Add Nursing Task"}
          />
        }
        closeSideBar={handleClose}
      >
        <div className={"emergency-task-slider"}>
          <Tabs>
            {!hideMedicationTab &&
              isUserPrivileged(
                currentUser,
                PRIVILEGE_CONSTANTS.EDIT_ADHOC_MEDICATION_TASKS
              ) && (
                <Tab
                  id="Medication"
                  onClick={() => {
                    setActiveTab("Medication");
                    handleMedicationSaveButton();
                  }}
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
                          label={DOSE_LABEL}
                          isRequired={true}
                          min={0}
                        />
                        <Dropdown
                          id={"Dosage Dropdown"}
                          onChange={(e) => {
                            setDoseUnits(e);
                          }}
                          placeholder={SELECT_DOSE_UNIT_PLACEHOLDER}
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
                        placeholder={SELECT_ROUTE_PLACEHOLDER}
                        titleText={ROUTE_LABEL}
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
                        title={ADMINSTRATION_DATE_LABEL}
                        isRequired={true}
                        value={administrationDate}
                        dateFormat={"d M Y"}
                        placeholder={"DD MMM YYYY"}
                        maxDate={new Date()}
                      />
                      {enable24HourTime ? (
                        <TimePicker24Hour
                          defaultTime={administrationTime}
                          onChange={(e) => {
                            e != "" && setAdministrationTime(e);
                            setIsTimeChanged(true);
                          }}
                          labelText={ADMINSTRATION_TIME_LABEL_24}
                          width={"250px"}
                          isRequired={true}
                          customValidation={customValidation}
                          actionForInvalidTime={actionForInvalidTime}
                          invalid={isInvalidTime}
                          invalidText={invalidText}
                        />
                      ) : (
                        <TimePicker
                          defaultTime={administrationTime}
                          onChange={(e) => {
                            e != "" && setAdministrationTime(e);
                            setIsTimeChanged(true);
                          }}
                          labelText={ADMINSTRATION_TIME_LABEL_12}
                          width={"155px"}
                          isRequired={true}
                          customValidation={customValidation}
                          actionForInvalidTime={actionForInvalidTime}
                          invalid={isInvalidTime}
                          invalidText={invalidText}
                        />
                      )}
                    </div>
                    <Dropdown
                      id={"Provider-info"}
                      onChange={(selectedItem) => {
                        setRequestedProvider(selectedItem?.value);
                      }}
                      placeholder={SELECT_PROVIDER_PLACEHOLDER}
                      titleText={ACKNOWLEDGEMENT_PROVIDER_LABEL}
                      isRequired={true}
                      options={providerOptions}
                      width={"100%"}
                    />
                    <TextArea
                      labelText={<Title text={NOTES_LABEL} isRequired={true} />}
                      onChange={(e) => {
                        setNotes(e.target.value);
                      }}
                      placeholder={NOTES_PLACEHOLDER}
                      maxCount={250}
                      rows={4}
                    />
                  </div>
                </Tab>
              )}
            {isUserPrivileged(currentUser, PRIVILEGE_CONSTANTS.ADD_TASKS) && (
              <Tab
                id="Non - Medication"
                onClick={() => {
                  setActiveTab("Non-Medication");
                  handleNonMedicationSaveButton();
                }}
                label={
                  <FormattedMessage
                    id={"NON_MEDICATION"}
                    defaultMessage={"Non - Medication"}
                  />
                }
              >
                {isLoading && (
                  <div>
                    <Loading />
                  </div>
                )}
                <div className="emergency-task-slider-content">
                  {instruction ? (
                    <div className="instruction-header-container">
                      <div>
                        <p className="instruction-label">
                          {intl.formatMessage({
                            id: "INSTRUCTION_LABEL",
                            defaultMessage: "Instruction",
                          })}
                        </p>
                        <p className="instruction-value">{instruction}</p>
                      </div>
                      {enableAddMultipleTask && (
                        <Button
                          kind={"tertiary"}
                          size="sm"
                          className="add-non-medication-task-button"
                          onClick={appendNonMedicationTask}
                        >
                          <FormattedMessage
                            id={"ADD_MORE_TASK"}
                            defaultMessage={"Add Task"}
                          />
                          {" +"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="add-more-task-button-container">
                      {enableAddMultipleTask && (
                        <Button
                          kind={"tertiary"}
                          size="sm"
                          className="add-non-medication-task-button"
                          onClick={appendNonMedicationTask}
                        >
                          <FormattedMessage
                            id={"ADD_MORE_TASK"}
                            defaultMessage={"Add Task"}
                          />
                          {" +"}
                        </Button>
                      )}
                    </div>
                  )}
                  {nonMedicationTasks.map((taskDetails, index) => (
                    <div
                      key={taskDetails.id}
                      className={`non-medication-task-section ${
                        index > 0 ? "replicated-task-section" : ""
                      }`}
                    >
                      <TextArea
                        labelText={
                          <Title text={TASK_NAME_LABEL} isRequired={true} />
                        }
                        onChange={(e) => {
                          const newValue = e.target.value;
                          updateNonMedicationTask(taskDetails.id, {
                            taskName: newValue,
                          });
                          validateTaskName(taskDetails.id, newValue);
                        }}
                        value={taskDetails.taskName}
                        placeholder={TASK_NAME_PLACEHOLDER}
                        maxCount={MAX_TASK_NAME_LENGTH}
                        rows={1}
                        invalid={Boolean(
                          nonMedicationInvalidTaskNames[taskDetails.id]
                        )}
                        invalidText={
                          nonMedicationInvalidTaskNames[taskDetails.id]
                        }
                      />
                      {nonMedicationTaskTypeOptions &&
                        nonMedicationTaskTypeOptions.length > 0 && (
                          <Dropdown
                            id={`non-medication-task-type-dropdown-${taskDetails.id}`}
                            onChange={(selectedItem) => {
                              setNonMedicationTaskType(
                                taskDetails.id,
                                selectedItem
                              );
                            }}
                            placeholder={"Select Task Type"}
                            titleText={"Task Type"}
                            isRequired={false}
                            options={nonMedicationTaskTypeOptions}
                            width={"100%"}
                            selectedValue={
                              taskDetails.taskType
                                ? {
                                    label: taskDetails.taskType,
                                    value: taskDetails.taskType,
                                  }
                                : null
                            }
                          />
                        )}
                      <div className="time-info">
                        {enable24HourTime ? (
                          <TimePicker24Hour
                            defaultTime={taskDetails.scheduleTime}
                            onChange={(time) => {
                              if (time !== "") {
                                updateNonMedicationTask(taskDetails.id, {
                                  scheduleTime: time,
                                });
                              }
                              setIsTimeChanged(true);
                            }}
                            labelText={SCHEDULE_TIME_LABEL_24}
                            width={"250px"}
                            isRequired={true}
                            customValidation={(time) =>
                              customNonMedicationTaskValidation(
                                taskDetails.id,
                                time
                              )
                            }
                            actionForInvalidTime={(invalid) =>
                              actionForNonMedicationInvalidTime(
                                taskDetails.id,
                                invalid
                              )
                            }
                            invalid={Boolean(
                              nonMedicationInvalidTimes[taskDetails.id]
                            )}
                            invalidText={
                              nonMedicationInvalidTexts[taskDetails.id]
                            }
                          />
                        ) : (
                          <TimePicker
                            defaultTime={taskDetails.scheduleTime}
                            onChange={(time) => {
                              if (time !== "") {
                                updateNonMedicationTask(taskDetails.id, {
                                  scheduleTime: time,
                                });
                              }
                              setIsTimeChanged(true);
                            }}
                            labelText={SCHEDULE_TIME_LABEL_12}
                            width={"155px"}
                            isRequired={true}
                            customValidation={(time) =>
                              customNonMedicationTaskValidation(
                                taskDetails.id,
                                time
                              )
                            }
                            actionForInvalidTime={(invalid) =>
                              actionForNonMedicationInvalidTime(
                                taskDetails.id,
                                invalid
                              )
                            }
                            invalid={Boolean(
                              nonMedicationInvalidTimes[taskDetails.id]
                            )}
                            invalidText={
                              nonMedicationInvalidTexts[taskDetails.id]
                            }
                          />
                        )}
                      </div>
                      {index > 0 && enableAddMultipleTask && (
                        <>
                          <button
                            type="button"
                            className="replicated-task-remove-button"
                            onClick={() =>
                              removeNonMedicationTask(taskDetails.id)
                            }
                          >
                            <FormattedMessage
                              id={"REMOVE"}
                              defaultMessage={"Remove"}
                            />
                          </button>
                          <div className="replicated-task-separator" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Tab>
            )}
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
          <AdministeredMedicationList
            list={popupMedicationData}
            enable24Hour={enable24HourTime}
          />
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
  setShowNotification: PropTypes.func.isRequired,
  setNotificationMessage: PropTypes.func.isRequired,
  setNotificationStatus: PropTypes.func.isRequired,
  hideMedicationTab: PropTypes.bool,
  observationUuid: PropTypes.string,
  orderUuid: PropTypes.string,
  instruction: PropTypes.string,
  initialTaskName: PropTypes.string,
};
export default AddEmergencyTasks;
