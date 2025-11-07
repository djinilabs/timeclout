import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, PropsWithChildren, Suspense, useState, lazy } from "react";
import { Toaster } from "react-hot-toast";

import { FetchActivityIndicator } from "./components/atoms/FetchActivityIndicator";
import { HelpPanel } from "./components/atoms/HelpPanel";
import { UserTopBarMenu } from "./components/molecules/UserTopBarMenu";
import { BreadcrumbNav } from "./components/particles/BreadcrumbNav";
import { LocaleSwitcher } from "./components/particles/LocaleSwitcher";
import { useAppLocalSettings } from "./contexts/AppLocalSettingsContext";
import { useLocalPreference } from "./hooks/useLocalPreference";
import { useWindowSize } from "./hooks/useWindowSize";
import { classNames } from "./utils/classNames";

const AIChatPanel = lazy(() => import("./components/ai/AIChatPanel"));
const SideBar = lazy(() => import("./components/molecules/SideBar"));

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useLocalPreference(
    "sidebarExpanded",
    true
  );
  const { width } = useWindowSize();

  const [helpPanelOpen, setHelpPanelOpen] = useLocalPreference(
    "helpPanelOpen",
    false
  );

  const [aiChatPanelOpen, setAIChatPanelOpen] = useLocalPreference(
    "aiChatPanelOpen",
    false
  );

  const {
    settings: { helpSideBarWidth },
  } = useAppLocalSettings();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            color: "#374151",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "1rem",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "white",
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
            duration: 5000,
          },
        }}
      />
      <FetchActivityIndicator />
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
            sidebarExpanded ? "lg:pl-72" : "lg:pl-20",
            "transition-[padding] duration-300"
          )}
          style={
            helpPanelOpen || aiChatPanelOpen
              ? {
                  paddingRight:
                    width >= 1024
                      ? `${
                          (helpPanelOpen ? helpSideBarWidth : 0) +
                          (aiChatPanelOpen ? 450 : 0)
                        }px`
                      : undefined,
                }
              : {}
          }
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
              <div className="flex items-center gap-x-4 lg:gap-x-6 shrink-0 mr-4">
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                <UserTopBarMenu />
                <LocaleSwitcher />
              </div>
            </div>
          </div>

          <main className="py-10 flex-1">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>

        {/* Help panel */}
        <HelpPanel
          setHelpPanelOpen={setHelpPanelOpen}
          isHelpPanelOpen={helpPanelOpen}
        />

        {/* AI Chat panel */}
        <Transition show={aiChatPanelOpen} appear>
          <div
            className={classNames(
              "fixed inset-y-0 right-0 z-50 w-full max-w-md lg:translate-x-0 transition-all duration-300 ease-in-out",
              "translate-x-0 data-closed:translate-x-full"
            )}
          >
            <Suspense>
              <AIChatPanel onClose={() => setAIChatPanelOpen(false)} />
            </Suspense>
          </div>
        </Transition>

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

        {/* Toggle AI chat panel button */}
        <button
          type="button"
          onClick={() => setAIChatPanelOpen(!aiChatPanelOpen)}
          className="no-print fixed opacity-50 hover:opacity-100 right-4 bottom-4 bg-teal-400 text-white rounded-full p-3 shadow-lg hover:bg-teal-500"
        >
          <span className="sr-only">Toggle AI chat panel</span>
          {aiChatPanelOpen ? (
            <XMarkIcon aria-hidden="true" className="size-6" />
          ) : (
            <ChatBubbleLeftRightIcon aria-hidden="true" className="size-6" />
          )}
        </button>
      </div>
    </>
  );
};
