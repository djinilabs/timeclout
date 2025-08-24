import debounce from "lodash.debounce";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AppLocalSettings {
  helpSideBarWidth: number;
}

interface AppLocalSettingsContextType {
  settings: AppLocalSettings;
  setHelpSideBarWidth: (width: number) => void;
}

const STORAGE_KEY = "app_local_settings";

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

interface AppLocalSettingsProviderProperties {
  children: ReactNode;
}

export const AppLocalSettingsProvider = ({
  children,
}: AppLocalSettingsProviderProperties) => {
  // Load initial settings from localStorage
  const [settings, setSettings] = useState<AppLocalSettings>(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Create a debounced save function
  const debouncedSave = debounce((newSettings: AppLocalSettings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  }, 1000);

  // Save settings whenever they change
  useEffect(() => {
    debouncedSave(settings);
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave, settings]);

  const setHelpSideBarWidth = (width: number) => {
    setSettings((previous) => ({ ...previous, helpSideBarWidth: width }));
  };

  return (
    <AppLocalSettingsContext.Provider value={{ settings, setHelpSideBarWidth }}>
      {children}
    </AppLocalSettingsContext.Provider>
  );
};
