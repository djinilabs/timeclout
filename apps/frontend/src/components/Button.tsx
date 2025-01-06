import { FC, PropsWithChildren } from "react";

export interface ButtonProps {
  onClick: () => void;
  cancel?: boolean;
}

const CancelButton: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-sm/6 font-semibold text-gray-900 ml-3"
    >
      {children}
    </button>
  );
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  children,
  cancel,
}) => {
  if (cancel) {
    return <CancelButton onClick={onClick}>{children}</CancelButton>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      {children}
    </button>
  );
};
