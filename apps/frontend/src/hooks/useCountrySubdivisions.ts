import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { useFetchActivity } from "./useFetchActivity";

const countrySubdivisionsRemoteResponseSchema = z.array(
  z.object({
    isoCode: z.string(),
    name: z.array(
      z.object({
        language: z.string(),
        text: z.string(),
      })
    ),
  })
);

export type Fetch = typeof fetch;

export interface GetCountrySubdivisionsProperties {
  countryIsoCode?: string;
  languageIsoCode: "EN"; // only English is supported for now
  fetch: Fetch;
}

const getCountrySubdivisions = async ({
  countryIsoCode,
  languageIsoCode,
  fetch,
}: GetCountrySubdivisionsProperties) => {
  if (!countryIsoCode) {
    return [];
  }
  const result = await fetch(
    `https://openholidaysapi.org/Subdivisions?countryIsoCode=${countryIsoCode}&languageIsoCode=${languageIsoCode}`
  );
  if (!result.ok) {
    throw new Error("Failed to fetch country subdivisions");
  }
  const data = await result.json();
  const parsed = countrySubdivisionsRemoteResponseSchema.parse(data);
  return parsed.map((subdivision) => ({
    isoCode: subdivision.isoCode,
    name: subdivision.name.find((name) => name.language === languageIsoCode)
      ?.text,
  }));
};

export const useCountrySubdivisions = (properties: GetCountrySubdivisionsProperties) => {
  const { monitorFetch } = useFetchActivity();
  const { data, error } = useQuery({
    queryKey: [
      "countrySubdivisions",
      properties.countryIsoCode,
      properties.languageIsoCode,
    ],
    queryFn: () =>
      getCountrySubdivisions({ ...properties, fetch: monitorFetch.fetch }),
    enabled: properties.countryIsoCode != undefined,
  });
  return { data, error };
};
