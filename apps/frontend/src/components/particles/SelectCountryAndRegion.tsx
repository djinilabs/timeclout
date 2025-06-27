import { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Trans } from "@lingui/react/macro";
import { useCountries } from "../../hooks/useCountries";
import { useCountrySubdivisions } from "../../hooks/useCountrySubdivisions";
import { useFetchActivity } from "../../hooks/useFetchActivity";
import { i18n } from "@lingui/core";

interface SelectCountryAndRegionProps {
  selectedCountryIsoCode: string | undefined;
  selectedRegionIsoCode: string | undefined;
  onChangeCountry: (country: string) => void;
  onChangeRegion: (region: string) => void;
}

export const SelectCountryAndRegion: FC<SelectCountryAndRegionProps> = ({
  selectedCountryIsoCode,
  selectedRegionIsoCode,
  onChangeCountry,
  onChangeRegion,
}) => {
  const { data: countries, error: countriesError } = useCountries({
    language: "EN",
  });

  useEffect(() => {
    if (countriesError) {
      toast.error("Failed to fetch countries");
    }
  }, [countriesError]);

  const { monitorFetch } = useFetchActivity();

  const { data: countrySubdivisions, error: countrySubdivisionsError } =
    useCountrySubdivisions({
      countryIsoCode: selectedCountryIsoCode,
      languageIsoCode: "EN",
      fetch: monitorFetch.fetch,
    });

  useEffect(() => {
    if (countrySubdivisionsError) {
      toast.error("Failed to fetch country subdivisions");
    }
  }, [countrySubdivisionsError]);

  return (
    <div className="country-region-select col-span-4 flex flex-row items-center gap-4">
      <div className="flex flex-row items-center gap-2">
        <label
          htmlFor="country-select"
          className="block text-sm/6 font-medium text-gray-900"
        >
          <Trans>Country</Trans>
        </label>
        <div className="relative">
          <select
            value={selectedCountryIsoCode || ""}
            id="country-select"
            onChange={(ev) => {
              onChangeCountry(ev.target.value);
            }}
            className="w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            role="select"
            aria-label={i18n.t("Select a country")}
            aria-required="true"
          >
            <option value="">
              <Trans>Select a country</Trans>
            </option>
            {countries?.map((country) => (
              <option
                key={country.isoCode}
                value={country.isoCode}
                role="option"
                aria-label={country.name}
              >
                {country.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500 sm:size-4"
          />
        </div>
      </div>
      {selectedCountryIsoCode != null && countrySubdivisions?.length ? (
        <div className="flex flex-row items-center gap-2">
          <label
            htmlFor="region-select"
            className="block text-sm/6 font-medium text-gray-900"
          >
            <Trans>Region</Trans>
          </label>
          <div className="relative flex-1">
            <select
              value={selectedRegionIsoCode || ""}
              id="region-select"
              onChange={(ev) => {
                onChangeRegion(ev.target.value);
              }}
              className="appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              role="select"
              aria-label={i18n.t("Select a region")}
              aria-required="true"
            >
              <option value="">
                <Trans>Select a region</Trans>
              </option>
              {countrySubdivisions?.map((subdivision) => (
                <option
                  key={subdivision.isoCode}
                  value={subdivision.isoCode}
                  role="option"
                  aria-label={subdivision.name}
                >
                  {subdivision.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-5 text-gray-500 sm:size-4"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
