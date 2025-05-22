import { FaSpinner } from "react-icons/fa";
import { memo } from "react";

export const Loading = memo(() => {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <FaSpinner className="animate-spin" />
    </div>
  );
});
