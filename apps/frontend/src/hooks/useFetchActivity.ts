import { useContext } from "react";

import { FetchActivityContext } from "../contexts/FetchActivityContext";

export const useFetchActivity = () => {
  return useContext(FetchActivityContext);
};
