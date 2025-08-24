import { createContext, ReactNode } from "react";

export interface ConfirmDialogContextType {
  open: boolean;
  text?: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmDialogContextValue extends ConfirmDialogContextType {
  showConfirmDialog: (
    properties: Omit<ConfirmDialogContextType, "open">
  ) => Promise<boolean>;
}

export const ConfirmDialogContext = createContext<
  ConfirmDialogContextValue | undefined
>(undefined);
