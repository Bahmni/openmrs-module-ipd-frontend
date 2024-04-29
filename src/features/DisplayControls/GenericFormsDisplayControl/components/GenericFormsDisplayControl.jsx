import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IPDContext } from "../../../../context/IPDContext";
import {
  fetchAllConceptsForForm,
  fetchFormTranslations,
} from "../utils/GenericFormsDisplayControlUtils";
import "../styles/GenericFormDisplayControl.scss";
import moment from "moment";
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "carbon-components-react";
import { ViewFormModal } from "./ViewFormModal";

const GenericFormsDisplayControl = (props) => {
  const {
    config: { formName: formName },
  } = props;
  const ipdContext = useContext(IPDContext);
  const [formTemplate, setFormTemplate] = useState([]);
  const [formTranslations, setFormTranslations] = useState({});
  const [formEntries, setFormEntries] = useState([]);
  const [openViewFormModal, setOpenViewFormModal] = useState({});
  const headers = [
    {
      key: "Date",
      header: "Date",
    },
    {
      key: "Time",
      header: "Time",
    },
    {
      key: "Provider",
      header: "Provider",
    },
    {
      key: "",
      header: "",
    },
  ];
  const { allFormsSummary = [], allFormsFilledInCurrentVisit = [] } =
    ipdContext;
  const fetchFormConcepts = async (formUuid) => {
    const response = await fetchAllConceptsForForm(formUuid);
    console.log("response 1 ", response);
    if (response?.resources && response?.resources[0]?.value) {
      return JSON.parse(response?.resources[0]?.value);
    }
  };
  const restructureFormConcepts = (formConcepts) => {
    const form = [];
    formConcepts.map((formConcept) => {
      if (formConcept.type === "obsControl") {
        form.push({
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: false,
        });
      } else if (formConcept.type === "obsGroupControl") {
        form.push({
          conceptName: formConcept.concept.name,
          translationKey: formConcept.label.translationKey,
          hasGroupMembers: true,
          members: restructureFormConcepts(formConcept.controls),
        });
      }
    });
    return form;
  };

  useEffect(() => {
    const formUuid = allFormsSummary.find(
      (form) => form.name === formName
    )?.uuid;
    fetchFormConcepts(formUuid).then((response) => {
      console.log("response", response);
      const finalResponse = restructureFormConcepts(response.controls);
      setFormTemplate(finalResponse);
    });
    fetchFormTranslations(formName, formUuid).then((response) => {
      setFormTranslations(response.concepts);
    });
  }, []);

  useEffect(() => {
    getEntriesForSelectedForm();
  }, [allFormsFilledInCurrentVisit]);
  const setModalValue = (uuid, value) => {
    setOpenViewFormModal({ ...openViewFormModal, [uuid]: value });
  };

  const getEntriesForSelectedForm = () => {
    const forms = allFormsFilledInCurrentVisit.filter(
      (form) => form.formName === formName
    );
    forms.sort((a, b) => b.encounterDateTime - a.encounterDateTime);
    setFormEntries(forms);
  };
  console.log(
    "form",
    formTemplate,
    formTranslations,
    allFormsFilledInCurrentVisit,
    formEntries
  );
  return (
    <Table useZebraStyles className={"form-table-display-control"}>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableHeader
              key={index + header.key}
              className={`${
                header.key === "Provider" && "provider-column-width"
              }`}
            >
              {header.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {formEntries.map((formEntry, index) => {
          const { encounterDateTime, providers } = formEntry;
          const provider = providers[0].providerName;
          return (
            <TableRow key={index}>
              <TableCell>
                {moment(+encounterDateTime).format("DD-MM-YYYY")}
              </TableCell>
              <TableCell>
                {moment(+encounterDateTime).format("HH:mm")}
              </TableCell>
              <TableCell>{provider}</TableCell>
              <TableCell>
                <Link
                  onClick={() => {
                    setModalValue(formEntry.encounterUuid, true);
                  }}
                >
                  View
                </Link>
              </TableCell>
              {openViewFormModal[formEntry.encounterUuid] && (
                <ViewFormModal
                  encounterUuid={formEntry.encounterUuid}
                  callbacks={{ setModalValue }}
                  form={{ formTemplate, formTranslations }}
                  metadata={{
                    formName,
                    encounterDateTime: formEntry.encounterDateTime,
                    provider,
                  }}
                />
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GenericFormsDisplayControl;

GenericFormsDisplayControl.propTypes = {
  patientId: PropTypes.string,
  config: PropTypes.object,
};
