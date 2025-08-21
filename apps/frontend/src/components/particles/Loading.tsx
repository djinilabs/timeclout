import { memo } from "react";
import { FaSpinner } from "react-icons/fa";

export const Loading = memo(() => {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <FaSpinner className="animate-spin" />
    </div>
  );
});

Loading.displayName = "Loading";
