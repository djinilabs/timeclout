import { FC, PropsWithChildren, ReactNode, memo } from "react";
import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { classNames } from "../../utils/classNames";
export interface DialogProps {
  className?: string;
  open: boolean;
  title: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export const Dialog: FC<PropsWithChildren<DialogProps>> = memo(
  ({ open, title, footer, onClose, children, className }) => {
    return (
      <HeadlessDialog open={open} onClose={onClose} className="relative">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in z-[100]"
        />

        <div className="fixed inset-0 w-screen w-full overflow-y-auto z-[200]">
          <div className="flex min-w-full min-h-full items-end justify-center sm:p-0">
            <DialogPanel
              transition
              className={classNames(
                "relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95",
                className
              )}
            >
              <div className="w-full">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  {children}
                </div>
              </div>
              <div className="mt-5 sm:mt-6">{footer}</div>
            </DialogPanel>
          </div>
        </div>
      </HeadlessDialog>
    );
  }
);
