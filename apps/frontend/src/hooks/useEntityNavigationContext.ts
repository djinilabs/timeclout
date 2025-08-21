import { useContext } from "react";

import { EntityNavigationContext } from "../contexts/EntityNavigationContext";

export const useEntityNavigationContext = () => {
  const context = useContext(EntityNavigationContext);
  if (!context) {
    throw new Error(
      "useEntityNavigationContext must be used within an EntityNavigationContextProvider"
    );
  }
  return context;
};
