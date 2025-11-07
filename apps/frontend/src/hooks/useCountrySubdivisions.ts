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

export interface GetCountrySubdivisionsProps {
  countryIsoCode?: string;
  languageIsoCode: "EN"; // only English is supported for now
  fetch: Fetch;
}

const getCountrySubdivisions = async ({
  countryIsoCode,
  languageIsoCode,
  fetch,
}: GetCountrySubdivisionsProps) => {
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

export const useCountrySubdivisions = (props: GetCountrySubdivisionsProps) => {
  const { monitorFetch } = useFetchActivity();
  const { data, error } = useQuery({
    queryKey: [
      "countrySubdivisions",
      props.countryIsoCode,
      props.languageIsoCode,
    ],
    queryFn: () =>
      getCountrySubdivisions({ ...props, fetch: monitorFetch.fetch }),
    enabled: props.countryIsoCode != null,
  });
  return { data, error };
};
