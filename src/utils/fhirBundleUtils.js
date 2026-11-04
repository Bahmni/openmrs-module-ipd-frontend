import axios from "axios";

const getNextLink = (bundle) =>
  (bundle?.link ?? []).find((link) => link?.relation === "next")?.url ?? null;

/**
 * Fetches every page of a FHIR search Bundle, following link[relation=next].
 * Returns a single merged Bundle so callers can keep using the existing mappers.
 *
 * FHIR2 pages search results (fhir2.paging.default = 10, maximum = 100), so a
 * single request is not enough for visits with many orders.
 */
export const fetchAllBundleEntries = async (url, config = {}) => {
  const entries = [];
  const visited = new Set();
  let nextUrl = url;
  let firstBundle = null;

  while (nextUrl && !visited.has(nextUrl)) {
    visited.add(nextUrl);
    const response = await axios.get(nextUrl, config);
    const bundle = response.data;
    if (!firstBundle) firstBundle = bundle;
    if (Array.isArray(bundle?.entry)) entries.push(...bundle.entry);
    nextUrl = getNextLink(bundle);
  }

  return {
    ...(firstBundle ?? { resourceType: "Bundle", type: "searchset" }),
    entry: entries,
  };
};
