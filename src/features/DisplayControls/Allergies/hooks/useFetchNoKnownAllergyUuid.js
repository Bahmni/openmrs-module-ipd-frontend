import { useEffect, useState } from "react";
import { getNoKnownAllergyUuid } from "../utils/AllergiesUtils";

export const useFetchNoKnownAllergyUuid = () => {
  const [noKnownAllergyUuid, setNoKnownAllergyUuid] = useState(undefined);

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const code = await getNoKnownAllergyUuid();
        setNoKnownAllergyUuid(code);
      } catch (error) {
        console.error("Failed to fetch no known allergy code:", error);
      }
    };
    fetchCode();
  }, []);

  return { noKnownAllergyUuid };
};
