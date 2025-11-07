import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import {
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

import { type Company } from "../graphql/graphql";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { useMutation } from "../hooks/useMutation";
import { useQuery } from "../hooks/useQuery";

import { DemoModePrompt } from "./demo/DemoModePrompt";
import { Button } from "./particles/Button";

import deleteCompanyMutation from "@/graphql-client/mutations/deleteCompany.graphql";
import allCompaniesQuery from "@/graphql-client/queries/allCompanies.graphql";

export const AllUserCompanies = () => {
  const [allCompanies] = useQuery<{ companies: Company[] }>({
    query: allCompaniesQuery,
    pollingIntervalMs: 10000,
  });

  const [, deleteCompany] = useMutation(deleteCompanyMutation);

  const { showConfirmDialog } = useConfirmDialog();

  if (!allCompanies.data?.companies?.length) {
    return <DemoModePrompt />;
  }

  return (
    <div role="region" aria-label="Companies list">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-base font-semibold text-gray-900">
              <Trans>Companies</Trans>
            </h3>
          </div>
          <div className="ml-4 mt-2 shrink-0">
            <Button
              to="/companies/new"
              className="new-company-button"
              aria-label="Create new company"
            >
              <Trans>Create new company</Trans>
            </Button>
          </div>
        </div>
      </div>
      <ul className="companies-list" role="list" aria-label="List of companies">
        {allCompanies.data?.companies.map((company: Company) => (
          <li
            key={company.pk}
            className="flex items-center justify-between gap-x-6 py-5"
            role="listitem"
            aria-label={company.name}
          >
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <BuildingOfficeIcon
                  className="mt-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <p className="text-sm/6 font-semibold text-gray-900 hover:underline">
                  <Link
                    to={`/${company.pk}`}
                    role="link"
                    aria-label={`View ${company.name} company details`}
                    aria-clickable
                  >
                    {company.name}
                  </Link>
                </p>
              </div>
              <div
                className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500"
                role="contentinfo"
                aria-label={`Company information for ${company.name}`}
              >
                <p className="whitespace-nowrap">
                  <Trans>Created</Trans>{" "}
                  <ReactTimeAgo date={new Date(company.createdAt)} />
                </p>
                <svg
                  viewBox="0 0 2 2"
                  className="size-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">
                  <Trans>Created by</Trans>{" "}
                  {company.createdBy?.name || "Unknown"}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Menu>
                <MenuButton className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  <EllipsisVerticalIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to={`/companies/${company.pk}/edit`}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block px-4 py-2 text-sm`}
                      >
                        <PencilIcon className="mr-3 h-5 w-5 text-gray-400" />
                        <Trans>Edit</Trans>
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => {
                          showConfirmDialog({
                            text: i18n.t(
                              "Are you sure you want to delete {companyName}? This action cannot be undone.",
                              { companyName: company.name }
                            ),
                            confirmText: i18n.t("Delete"),
                            cancelText: i18n.t("Cancel"),
                            onConfirm: async () => {
                              const response = await deleteCompany({
                                pk: company.pk,
                              });
                              if (!response.error) {
                                toast.success(i18n.t("Company deleted"));
                              }
                            },
                          });
                        }}
                        className={`${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        } block w-full px-4 py-2 text-left text-sm`}
                      >
                        <TrashIcon className="mr-3 h-5 w-5 text-gray-400" />
                        <Trans>Delete</Trans>
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
