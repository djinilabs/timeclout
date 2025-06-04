import { createContext, useContext, useState, ReactNode } from "react";

interface AppLocalSettings {
  helpSideBarWidth: number;
}

interface AppLocalSettingsContextType {
  settings: AppLocalSettings;
  setHelpSideBarWidth: (width: number) => void;
}

const defaultSettings: AppLocalSettings = {
  helpSideBarWidth: 288,
};

const AppLocalSettingsContext = createContext<
  AppLocalSettingsContextType | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAppLocalSettings = () => {
  const context = useContext(AppLocalSettingsContext);
  if (!context) {
    throw new Error(
      "useAppLocalSettings must be used within an AppLocalSettingsProvider"
    );
  }
  return context;
};

interface AppLocalSettingsProviderProps {
  children: ReactNode;
}

export const AppLocalSettingsProvider = ({
  children,
}: AppLocalSettingsProviderProps) => {
  const [settings, setSettings] = useState<AppLocalSettings>(defaultSettings);

  const setHelpSideBarWidth = (width: number) => {
    setSettings((prev) => ({ ...prev, helpSideBarWidth: width }));
  };

  return (
    <AppLocalSettingsContext.Provider value={{ settings, setHelpSideBarWidth }}>
      {children}
    </AppLocalSettingsContext.Provider>
  );
};
