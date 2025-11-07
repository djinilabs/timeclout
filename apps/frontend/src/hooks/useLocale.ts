import { useContext } from "react";

import {
  LocaleContext,
  type LocaleContextType,
} from "../contexts/LocaleContext";

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("LocaleContext not found");
  }
  return context;
};
