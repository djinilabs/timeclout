import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const countriesRemoteResponseSchema = z.array(
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

const getCountries = async (language: string) => {
  const result = await fetch("https://openholidaysapi.org/Countries");
  if (!result.ok) {
    throw new Error("Failed to fetch countries");
  }
  const data = await result.json();
  const parsed = countriesRemoteResponseSchema.parse(data);
  return parsed.map((country) => ({
    isoCode: country.isoCode,
    name: country.name.find((name) => name.language === language)?.text,
  }));
};

export interface UseCountriesProps {
  language: "EN"; // only English is supported for now
}

export const useCountries = ({ language }: UseCountriesProps) => {
  const { data, error } = useQuery({
    queryKey: ["countries", language],
    queryFn: () => getCountries(language),
  });
  return { data, error };
};
