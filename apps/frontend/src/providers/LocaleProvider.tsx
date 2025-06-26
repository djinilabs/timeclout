import type { FC, PropsWithChildren } from "react";
import {
  LocaleContext,
  type LocaleContextType,
} from "../contexts/LocaleContext";

export const LocaleProvider: FC<PropsWithChildren<LocaleContextType>> = ({
  children,
  locale,
  setLocale,
}) => {
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};
