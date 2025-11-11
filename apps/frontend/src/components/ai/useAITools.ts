import { ToolSet } from "ai";
import { useLingui } from "@lingui/react";
import { useMemo } from "react";

import { useFetchActivity } from "../../hooks/useFetchActivity";

import { ActivityDebouncer } from "./ActivityDebouncer";
import { tools } from "./tools";


export const useAITools = (): ToolSet => {
  const { i18n } = useLingui();
  const { monitorFetch } = useFetchActivity();
  const { debounceActivity } = useMemo(
    () => ActivityDebouncer(monitorFetch),
    [monitorFetch]
  );
  const language = (i18n.locale === "pt" ? "pt" : "en") as "en" | "pt";
  return tools(debounceActivity, language);
};
