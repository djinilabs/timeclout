import { FC, ReactNode, useCallback, useRef, useState } from "react";

import { ConfirmDialog } from "../components/molecules/ConfirmDialog";
import {
  ConfirmDialogContext,
  type ConfirmDialogContextType,
} from "../contexts/ConfirmDialogContext";

export const ConfirmDialogProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<ReactNode>();
  const [confirmText, setConfirmText] = useState<ReactNode>();
  const [cancelText, setCancelText] = useState<ReactNode>();

  const resolveReference = useRef<((value: boolean) => void) | null>(null);

  const onConfirm = useCallback(() => {
    setOpen(false);
    resolveReference.current?.(true);
  }, []);

  const onCancel = useCallback(() => {
    setOpen(false);
    resolveReference.current?.(false);
  }, []);

  const showConfirmDialog = useCallback(
    (properties: Omit<ConfirmDialogContextType, "open">): Promise<boolean> => {
      return new Promise((resolve) => {
        if (open) {
          resolve(false);
          return;
        }
        setOpen(true);
        resolveReference.current = resolve;
        setText(properties.text);
        setConfirmText(properties.confirmText);
        setCancelText(properties.cancelText);
      });
    },
    [open]
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ConfirmDialogContext.Provider value={{ showConfirmDialog, open }}>
      {children}
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={onConfirm}
        onCancel={onCancel}
        text={text}
        confirmText={confirmText}
        cancelText={cancelText}
      />
    </ConfirmDialogContext.Provider>
  );
};
