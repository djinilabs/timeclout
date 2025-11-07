/* eslint-disable react/no-children-prop */
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { FC, useEffect } from "react";
import toast from "react-hot-toast";

import { useCountries } from "../../hooks/useCountries";
import { useCountrySubdivisions } from "../../hooks/useCountrySubdivisions";
import { useFetchActivity } from "../../hooks/useFetchActivity";
import { FieldComponent } from "../types";

interface EditCountryAndRegionProps {
  Field: FieldComponent;
  selectedCountryIsoCode: string | undefined;
}

export const EditCountryAndRegion: FC<EditCountryAndRegionProps> = ({
  Field,
  selectedCountryIsoCode,
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
    <>
      <Field
        name="country"
        children={(field) => (
          <div className="country-region-select sm:col-span-3">
            <label
              htmlFor={field.name}
              className="block text-sm/6 font-medium text-gray-900"
            >
              <Trans>Country</Trans>
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                value={field.state.value}
                id={field.name}
                onChange={(ev) => {
                  field.handleChange(ev.target.value);
                }}
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                role="select"
                aria-label={i18n.t("Select a country")}
                aria-required="true"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={
                  field.state.meta.errors.length > 0
                    ? `${field.name}-error`
                    : undefined
                }
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
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </div>
        )}
      />

      {selectedCountryIsoCode != null && countrySubdivisions?.length ? (
        <Field
          name="region"
          children={(field) => (
            <div className="sm:col-span-2">
              <label
                htmlFor={field.name}
                className="block text-sm/6 font-medium text-gray-900"
              >
                <Trans>Region</Trans>
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  value={field.state.value}
                  id={field.name}
                  onChange={(ev) => {
                    console.log("region", ev.target.value);
                    field.handleChange(ev.target.value);
                  }}
                  className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  role="select"
                  aria-label={i18n.t("Select a region")}
                  aria-required="true"
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={
                    field.state.meta.errors.length > 0
                      ? `${field.name}-error`
                      : undefined
                  }
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
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </div>
            </div>
          )}
        />
      ) : null}
    </>
  );
};
