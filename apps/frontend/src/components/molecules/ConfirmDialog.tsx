import { FC, memo, ReactNode, useCallback } from "react";

import { Dialog } from "../atoms/Dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  text: ReactNode;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = memo(
  ({
    open,
    onClose,
    onConfirm,
    onCancel,
    text,
    confirmText = "OK",
    cancelText = "Cancel",
  }) => {
    const handleConfirm = useCallback(() => {
      onConfirm?.();
      onClose();
    }, [onClose, onConfirm]);

    const handleCancel = useCallback(() => {
      onCancel?.();
      onClose();
    }, [onClose, onCancel]);

    const footer = (
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    );

    return (
      <Dialog open={open} onClose={onClose} title="Confirm" footer={footer}>
        {text}
      </Dialog>
    );
  }
);

ConfirmDialog.displayName = "ConfirmDialog";
