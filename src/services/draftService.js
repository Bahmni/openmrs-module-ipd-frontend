import axios from "axios";
import { FORM_DRAFT_LIST_URL } from "../constants";

export const fetchDraftsForProvider = () =>
  axios
    .get(FORM_DRAFT_LIST_URL, {
      withCredentials: true,
    })
    .then((res) => res.data);
