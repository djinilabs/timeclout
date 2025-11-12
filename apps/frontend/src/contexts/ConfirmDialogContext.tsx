import { createContext, ReactNode } from "react";

export interface ConfirmDialogContextType {
  open: boolean;
  text?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}

export interface ConfirmDialogContextValue extends ConfirmDialogContextType {
  showConfirmDialog: (
    props: Omit<ConfirmDialogContextType, "open">
  ) => Promise<boolean>;
}

export const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined);
