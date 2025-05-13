import { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface TourContextType {
  startTour: () => void;
  stopTour: () => void;
  isTourRunning: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
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
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
