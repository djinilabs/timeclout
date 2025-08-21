import { ToolSet } from "ai";
import { useMemo } from "react";

import { useFetchActivity } from "../../hooks/useFetchActivity";

import { ActivityDebouncer } from "./ActivityDebouncer";
import { tools } from "./tools";


export const useAITools = (): ToolSet => {
  const { monitorFetch } = useFetchActivity();
  const { debounceActivity } = useMemo(
    () => ActivityDebouncer(monitorFetch),
    [monitorFetch]
  );
  return tools(debounceActivity);
};
