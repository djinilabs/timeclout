"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { i18n } from "@lingui/core";
import { Trans } from "@lingui/react/macro";
import { Button } from "../particles/Button";

export interface PublishActionsProps {
  areAnyUnpublished: boolean;
  onPublishChanges: () => void;
  onRevertToPublished: () => void;
}

export const PublishActions = ({
  areAnyUnpublished,
  onPublishChanges,
  onRevertToPublished,
}: PublishActionsProps) => {
  return (
    <Menu as="div" className="relative">
      <div className="inline-flex divide-x divide-teal-700 rounded-md outline-none">
        <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-teal-600 px-3 py-2 text-white">
          {areAnyUnpublished ? (
            <span
              aria-hidden="true"
              className="size-3 rounded-full bg-orange-400 animate-pulse border-2 border-orange-500 shadow-inner"
              style={{
                display: "inline-block",
                minWidth: "0.75rem",
                minHeight: "0.75rem",
                marginRight: "0.5rem",
              }}
            />
          ) : (
            <CheckIcon aria-hidden="true" className="-ml-0.5 size-5" />
          )}
          <p className="text-sm font-semibold whitespace-nowrap">
            {areAnyUnpublished ? i18n.t("Unpublished") : i18n.t("Published")}
          </p>
        </div>
        <MenuButton className="inline-flex items-center rounded-l-none rounded-r-md bg-teal-600 p-2 outline-none hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-teal-400">
          <span className="sr-only">Change published status</span>
          <ChevronDownIcon
            aria-hidden="true"
            className="size-5 text-white forced-colors:text-[Highlight]"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
      >
        {areAnyUnpublished ? (
          <MenuItem
            as="div"
            className="group cursor-default select-none p-4 text-sm text-gray-900"
          >
            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="font-normal group-data-[selected]:font-semibold">
                  <Trans>Unpublished</Trans>
                </p>
                <span className="text-teal-600 group-[&:not([data-selected])]:hidden">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </div>
              <p className="mt-2 text-gray-500 flex flex-col gap-2">
                <Trans>Some of the positions in these dates have changes</Trans>
                <Button onClick={onPublishChanges}>
                  <Trans>Publish changes</Trans>
                </Button>
                <Button
                  onClick={onRevertToPublished}
                  className="relative inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 hover:scale-110 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                >
                  <Trans>Revert to published</Trans>
                </Button>
              </p>
            </div>
          </MenuItem>
        ) : (
          <MenuItem
            as="div"
            className="group cursor-default select-none p-4 text-sm text-gray-900 data-[focus]:bg-teal-600 data-[focus]:text-white"
          >
            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="font-normal group-data-[selected]:font-semibold">
                  <Trans>Published</Trans>
                </p>
                <span className="text-teal-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              </div>
              <p className="mt-2 text-gray-500 group-data-[focus]:text-teal-200">
                <Trans>All positions in these dates have no changes</Trans>
              </p>
            </div>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};
