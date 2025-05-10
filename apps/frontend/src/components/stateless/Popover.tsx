import { FC, PropsWithChildren, memo, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { Placement } from "@popperjs/core";
export interface PopoverProps extends PropsWithChildren {
  referenceElement: HTMLElement | null;
  placement?: Placement;
  open: boolean;
}

export const Popover: FC<PopoverProps> = memo(
  ({ open, children, referenceElement, placement }) => {
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
      null
    );

    const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement,
      strategy: "absolute",
      modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    });

    return createPortal(
      <div ref={setPopperElement} style={styles.popper} {...attributes.popper}>
        <div ref={setArrowElement} style={styles.arrow} />
        {children}
      </div>,
      document.getElementById("popper-container")!
    );
  }
);
