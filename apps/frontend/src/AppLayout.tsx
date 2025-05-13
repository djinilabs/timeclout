"use client";

import { FC, PropsWithChildren, Suspense, useState, lazy } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { UserTopBarMenu } from "./components/UserTopBarMenu";
import { Toaster } from "react-hot-toast";
import { useLocalPreference } from "./hooks/useLocalPreference";
import { BreadcrumbNav } from "./components/BreadcrumbNav";
import { classNames } from "./utils/classNames";

const ContextualHelp = lazy(() => import("./components/ContextualHelp"));
const SideBar = lazy(() => import("./components/SideBar"));

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useLocalPreference(
    "sidebarExpanded",
    true
  );

  const [helpPanelOpen, setHelpPanelOpen] = useLocalPreference(
    "helpPanelOpen",
    false
  );

  return (
    <>
      <Toaster />
      <div className="flex h-screen">
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0 heyney"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar */}
              {sidebarOpen ? (
                <Suspense>
                  <SideBar
                    expanded={true}
                    alwaysExpanded
                    setExpanded={setSidebarExpanded}
                    onSelect={() => setSidebarOpen(false)}
                  />
                </Suspense>
              ) : null}
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={classNames(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
            sidebarExpanded ? "lg:w-72" : "lg:w-20"
          )}
        >
          <Suspense>
            <SideBar
              expanded={sidebarExpanded}
              setExpanded={setSidebarExpanded}
            />
          </Suspense>
        </div>

        <div
          className={classNames(
            "flex-1",
            helpPanelOpen ? "lg:pr-72" : "",
            sidebarExpanded ? "lg:pl-72" : "lg:pl-20",
            "transition-[padding] duration-300"
          )}
        >
          <div className="no-print sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white shadow-xs sm:gap-x-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 self-stretch justify-between">
              <div className="overflow-hidden">
                <div className="hidden lg:block h-full">
                  <Suspense>
                    <BreadcrumbNav />
                  </Suspense>
                </div>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6 shrink-0">
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                <UserTopBarMenu />
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>

        {/* Help panel */}
        <div
          className={`no-print fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${helpPanelOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Help</h2>
            <button
              type="button"
              onClick={() => setHelpPanelOpen(false)}
              className="-m-2.5 p-2.5 text-gray-700"
            >
              <span className="sr-only">Close help panel</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
            {helpPanelOpen ? (
              <Suspense>
                <ContextualHelp />
              </Suspense>
            ) : null}
          </div>
        </div>

        {/* Toggle help panel button */}
        <button
          type="button"
          onClick={() => setHelpPanelOpen(!helpPanelOpen)}
          className="no-print fixed opacity-50 hover:opacity-100 right-4 top-18 bg-blue-400 text-white rounded-full p-3 shadow-lg hover:bg-blue-500"
        >
          <span className="sr-only">Toggle help panel</span>
          {helpPanelOpen ? (
            <XMarkIcon aria-hidden="true" className="size-6" />
          ) : (
            <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
          )}
        </button>
      </div>
    </>
  );
};
