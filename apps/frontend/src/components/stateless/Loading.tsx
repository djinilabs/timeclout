import { FaSpinner } from "react-icons/fa";

export const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <FaSpinner className="animate-spin" />
    </div>
  );
};
