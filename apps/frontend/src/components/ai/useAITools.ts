import { useMemo } from "react";
import { ToolSet } from "ai";
import { tools } from "./tools";
import { ActivityDebouncer } from "./ActivityDebouncer";
import { useFetchActivity } from "../../hooks/useFetchActivity";

export const useAITools = (): ToolSet => {
  const { monitorFetch } = useFetchActivity();
  const { debounceActivity } = useMemo(
    () => ActivityDebouncer(monitorFetch),
    [monitorFetch]
  );
  return tools(debounceActivity);
};
