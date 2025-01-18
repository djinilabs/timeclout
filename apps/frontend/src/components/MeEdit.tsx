import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "../hooks/useQuery";
import meQuery from "@/graphql-client/queries/me.graphql";
import {
  Mutation,
  MutationUpdateMeArgs,
  MutationUpdateMySettingsArgs,
  Query,
} from "../graphql/graphql";
import { useCountries } from "../hooks/useCountries";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCountrySubdivisions } from "../hooks/useCountrySubdivisions";
import { useMutation } from "../hooks/useMutation";
import updateMeMutation from "@/graphql-client/mutations/updateMe.graphql";
import { Button } from "./Button";
export const MeEdit = () => {
  const [result] = useQuery<{ me: Query["me"] }>({ query: meQuery });
  const me = result?.data?.me;

  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState<
    string | undefined
  >(undefined);

  const { data: countries, error: countriesError } = useCountries({
    language: "EN",
  });

  useEffect(() => {
    if (countriesError) {
      toast.error("Failed to fetch countries");
    }
  }, [countriesError]);

  const { data: countrySubdivisions, error: countrySubdivisionsError } =
    useCountrySubdivisions({
      countryIsoCode: selectedCountryIsoCode,
      languageIsoCode: "EN",
    });

  useEffect(() => {
    if (countrySubdivisionsError) {
      toast.error("Failed to fetch country subdivisions");
    }
  }, [countrySubdivisionsError]);

  const [, updateMe] = useMutation<
    Mutation["updateMe"],
    MutationUpdateMeArgs & MutationUpdateMySettingsArgs
  >(updateMeMutation);

  const form = useForm({
    defaultValues: {
      name: me?.email === me?.name ? "" : me?.name,
      email: me?.email,
      country: me?.settings?.country,
      region: me?.settings?.region,
    },
    onSubmit: async ({ value }) => {
      const result = await updateMe({
        input: {
          name: value.name,
        },
        name: "location",
        settings: {
          country: value.country,
          region: value.region,
        },
      });
      if (!result.error) {
        toast.success("Your profile has been updated");
      }
    },
  });

  useEffect(() => {
    const unsubscribe = form.store.subscribe((state) => {
      setSelectedCountryIsoCode(state.currentVal.values.country);
    });
    return () => unsubscribe();
  }, [form]);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-600">
              Add your personal information to help us identify you.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value) {
                    return "Professional name is required";
                  }
                },
              }}
              children={(field) => (
                <div className="sm:col-span-3">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Professional name
                  </label>
                  <div className="mt-2">
                    <input
                      autoFocus
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(ev) => field.handleChange(ev.target.value)}
                      id={field.name}
                      type="text"
                      autoComplete="given-name"
                      className={`col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base outline outline-1 -outline-offset-1 focus:outline focus:outline-2 focus:-outline-offset-2 sm:pr-9 sm:text-sm/6 ${
                        field.state.meta.errors.length > 0
                          ? "placeholder:text-red-300 outline-red-300 focus:outline-red-600"
                          : ""
                      }`}
                    />
                    {field.state.meta.errors.length > 0 ? (
                      <p className="mt-2 text-sm text-red-600">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <div className="sm:col-span-4">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      value={field.state.value}
                      disabled
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              )}
            />

            <form.Field
              name="country"
              children={(field) => (
                <div className="sm:col-span-3">
                  <label
                    htmlFor={field.name}
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Country
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      value={field.state.value}
                      id={field.name}
                      onChange={(ev) => {
                        console.log("ev", ev.target.value);
                        field.handleChange(ev.target.value);
                      }}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                      <option value="">Select a country</option>
                      {countries?.map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
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
              <form.Field
                name="region"
                children={(field) => (
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={field.name}
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Region
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        value={field.state.value}
                        id={field.name}
                        onChange={(ev) => {
                          console.log("region", ev.target.value);
                          field.handleChange(ev.target.value);
                        }}
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option value="">Select a region</option>
                        {countrySubdivisions?.map((subdivision) => (
                          <option
                            key={subdivision.isoCode}
                            value={subdivision.isoCode}
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
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
