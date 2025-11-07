import { createContext, useState, ReactNode } from "react";

export interface TourContextType {
  startTour: () => void;
  stopTour: () => void;
  isTourRunning: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TourContext = createContext<TourContextType | undefined>(
  undefined
);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isTourRunning, setIsTourRunning] = useState(false);

  const startTour = () => {
    // Clear the tour completion status for the current route
    const items = { ...localStorage };
    for (const key in items) {
      if (key.startsWith("tour-")) {
        localStorage.removeItem(key);
      }
    }
    setIsTourRunning(true);
  };

  const stopTour = () => {
    setIsTourRunning(false);
  };

  return (
    <TourContext.Provider value={{ startTour, stopTour, isTourRunning }}>
      {children}
    </TourContext.Provider>
  );
};
