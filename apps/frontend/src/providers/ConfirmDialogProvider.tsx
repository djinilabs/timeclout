import { FC, ReactNode, useCallback, useState } from "react";
import {
  ConfirmDialogContext,
  type ConfirmDialogContextType,
} from "../contexts/ConfirmDialogContext";
import { ConfirmDialog } from "../components/molecules/ConfirmDialog";

export const ConfirmDialogProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ConfirmDialogContextType>({
    open: false,
  });

  const showConfirmDialog = useCallback(
    (props: Omit<ConfirmDialogContextType, "open">): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          ...props,
          open: true,
          onConfirm: () => {
            props.onConfirm?.();
            setState((prev) => ({ ...prev, open: false }));
            resolve(true);
          },
          onCancel: () => {
            props.onCancel?.();
            setState((prev) => ({ ...prev, open: false }));
            resolve(false);
          },
        });
      });
    },
    []
  );

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ConfirmDialogContext.Provider value={{ ...state, showConfirmDialog }}>
      {children}
      <ConfirmDialog
        open={state.open}
        onClose={handleClose}
        onConfirm={state.onConfirm ?? (() => {})}
        onCancel={state.onCancel ?? (() => {})}
        text={state.text}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
      />
    </ConfirmDialogContext.Provider>
  );
};
