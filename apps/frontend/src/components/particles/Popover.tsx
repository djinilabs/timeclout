import { Placement } from "@popperjs/core";
import { FC, PropsWithChildren, memo, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
export interface PopoverProps extends PropsWithChildren {
  referenceElement: HTMLElement | null;
  placement?: Placement;
  ariaLabel?: string;
}

export const Popover: FC<PopoverProps> = memo(
  ({ children, referenceElement, placement, ariaLabel }) => {
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
      null
    );

    const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
      placement,
      strategy: "absolute",
      modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    });

    console.log("referenceElement", referenceElement);
    console.log("popper styles", styles.popper);

    return createPortal(
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="false"
      >
        <div
          ref={setArrowElement}
          style={styles.arrow}
          role="presentation"
          aria-hidden="true"
        />
        {children}
      </div>,
      document.getElementById("popper-container")!
    );
  }
);

Popover.displayName = "Popover";
