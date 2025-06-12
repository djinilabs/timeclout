import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Trans } from "@lingui/react/macro";
import { i18n } from "@lingui/core";
import { getDefined } from "@/utils";
import { Qualifications, qualificationsParser, colorNames } from "@/settings";
import teamWithSettingsQuery from "@/graphql-client/queries/teamWithSettings.graphql";
import updateTeamSettingsMutation from "@/graphql-client/mutations/updateTeamSettings.graphql";
import { QueryTeamArgs, Team, TeamSettingsArgs } from "../../graphql/graphql";
import { useQuery } from "../../hooks/useQuery";
import { useMutation } from "../../hooks/useMutation";
import { Badge } from "../particles/Badge";
import { Button } from "../particles/Button";

export const TeamQualifications = () => {
  const { team: teamPk } = useParams();
  const [teamWithMembersAndSettingsQueryResponse] = useQuery<
    { team: Team },
    QueryTeamArgs & TeamSettingsArgs
  >({
    query: teamWithSettingsQuery,
    variables: {
      teamPk: getDefined(teamPk, "No team provided"),
      name: "qualifications",
    },
  });
  const team = teamWithMembersAndSettingsQueryResponse?.data?.team;
  const qualifications: Qualifications =
    team?.settings && qualificationsParser.parse(team.settings);

  const [localQualifications, setLocalQualifications] =
    useState<Qualifications>(qualifications || []);

  const handleAddQualification = () => {
    setLocalQualifications([
      ...localQualifications,
      { name: "", color: "green" },
    ]);
  };

  const handleRemoveQualification = (index: number) => {
    setLocalQualifications(localQualifications.filter((_, i) => i !== index));
  };

  const handleUpdateQualification = (
    index: number,
    field: "name" | "color",
    value: string
  ) => {
    setLocalQualifications(
      localQualifications.map((qual, i) =>
        i === index ? { ...qual, [field]: value } : qual
      )
    );
  };

  const [, updateTeamSettings] = useMutation(updateTeamSettingsMutation);

  const handleSaveChanges = async () => {
    console.log("localQualifications", localQualifications);
    await updateTeamSettings({
      teamPk: getDefined(teamPk, "No team provided"),
      name: "qualifications",
      settings: localQualifications,
    });
    toast.success(i18n.t("Team qualifications saved"));
  };

  return (
    <div
      className="space-y-4 pt-4"
      role="region"
      aria-label={i18n.t("Team Qualifications")}
    >
      {localQualifications.map((qualification, index) => (
        <div
          key={index}
          className="flex gap-4 items-center"
          role="group"
          aria-label={i18n.t("Qualification") + " " + (index + 1)}
        >
          <input
            type="text"
            value={qualification.name}
            onChange={(e) =>
              handleUpdateQualification(index, "name", e.target.value)
            }
            placeholder={i18n.t("Qualification name")}
            className="border rounded-sm px-2 py-1"
            aria-label={i18n.t("Qualification name")}
          />
          <Combobox
            as="div"
            value={qualification.color}
            onChange={(color) =>
              color && handleUpdateQualification(index, "color", color)
            }
            aria-label={i18n.t("Select qualification color")}
          >
            <div className="relative">
              <ComboboxInput
                className="block w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6"
                displayValue={(color: string) =>
                  color.charAt(0).toUpperCase() + color.slice(1)
                }
                aria-label={i18n.t("Select qualification color")}
                aria-expanded={open}
                aria-controls="color-options"
                aria-autocomplete="list"
              />
              <ComboboxButton
                className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-hidden"
                aria-label={i18n.t("Open color options")}
                aria-expanded={open}
              >
                <ChevronUpDownIcon
                  className="size-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>

              <ComboboxOptions
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm"
                aria-label={i18n.t("Available colors")}
              >
                {colorNames.map((color) => (
                  <ComboboxOption
                    key={color}
                    value={color}
                    className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-focus:bg-teal-600 data-focus:text-white"
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-semibold" : "font-normal"
                          }`}
                        >
                          <Badge
                            name={
                              qualification.name ||
                              color.charAt(0).toUpperCase() + color.slice(1)
                            }
                            color={color}
                          />
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-600 data-focus:text-white">
                            <CheckIcon className="size-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
          <button
            onClick={() => handleRemoveQualification(index)}
            className="rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            aria-label={i18n.t("Remove qualification") + " " + (index + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
            <span className="sr-only">
              <Trans>Remove Qualification</Trans>
            </span>
          </button>
        </div>
      ))}

      <button
        onClick={handleAddQualification}
        className="rounded-full bg-teal-600 p-2 text-white hover:bg-teal-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label={i18n.t("Add new qualification")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span className="sr-only">
          <Trans>Add Qualification</Trans>
        </span>
      </button>

      <div className="relative my-8" role="separator" aria-hidden="true">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSaveChanges}
          aria-label={i18n.t("Save qualification changes")}
        >
          <Trans>Save changes</Trans>
        </Button>
      </div>
    </div>
  );
};
