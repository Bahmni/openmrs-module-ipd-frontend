import axios from "axios";
import { FORM_DRAFT_LIST_URL } from "../constants";

export const fetchDraftsForProvider = (providerUuid) =>
  axios.get(FORM_DRAFT_LIST_URL, { params: { providerUuid } }).then((res) => res.data);
