import axios from "axios";
import { PATIENT_URL ,CLINICAL_CONFIG_URL,PATIENT_PROFILE, ADDRESS_HEIRARCHY, BED_INFORMATION_URL, PATIENT_IMAGE_URL} from "../../../../constants";

export const fetchPatientProfile= async (patientUuid) => {
  const url = `${PATIENT_PROFILE}/${patientUuid}?v=full`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchPatientProfilePicture = async (patientUuid) => {
  const url = `${PATIENT_IMAGE_URL}patientUuid=${patientUuid}`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.request.responseURL;
  }
  catch (error) {
    return error;
  }
};

export const getBedInformation = async (patientUuid, visitUuid) => {
  const url = `${BED_INFORMATION_URL}?patientUuid=${patientUuid}&visitUuid=${visitUuid}&v=full`;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data.results;
  } catch (error) {
    return error;
  }
}

export const getConfigsForPatientContactDetails = async () => {
  try {
    const response = await axios.get(CLINICAL_CONFIG_URL, {
      withCredentials: true,
    });

    if (response.status !== 200) throw new Error(response.statusText);
    const contactConfig  = {
      contactDetails: response.data.config.contactDetails
    };
    return contactConfig;
  } catch (error) {
    return error;
  }
};

export const getGender = (gender) => {
  switch (gender) {
    case "M":
      return "Male";
    case "F":
      return "Female";
    case "O":
      return "Other";
    default:
      return gender;
  }
};
export const mapContact = (attributes,contactTypes) => {
  let mappedContacts = [];
  contactTypes.map((contactType) => {
   const contactValue = attributes?.find((attribute) => attribute.attributeType?.display === contactType )?.value;
   const words = contactType.split(/(?=[A-Z])/);
   const formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
   mappedContacts.push({
    name : formattedName,
    value : contactValue
   });
  });
  return mappedContacts;
}

export const mapRelationships = (relationships) => {
  let mappedRelation = [];
  relationships.map(relationship => {
    const relation = relationship?.personB?.display;
    const relationtype = (relationship?.relationshipType?.display).split('/')[0].trim();
    mappedRelation.push({
      name : relation,
      relationshipType : relationtype
    });
  });
  return mappedRelation;
}

export const fetchAddressMapping = async() => {
  const url = ADDRESS_HEIRARCHY;
  try {
    const response = await axios.get(url, {
      withCredentials: true,
    });
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (error) {
    return error;
  }
};