import { z } from "zod";

export const FetchCaseByCaseTypesSchema = z
  .object({
    caseTypeIds: z.union([z.array(z.string()), z.string()]),
  })
  .transform((data) => {
    const idsArray = Array.isArray(data.caseTypeIds)
      ? data.caseTypeIds
      : [data.caseTypeIds];

    return {
      caseTypeIds: idsArray,
    };
  });
