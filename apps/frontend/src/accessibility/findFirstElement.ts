import { AccessibilityObjectModel, AccessibleElement } from "./types";

const findFirstElement = (
  root: AccessibleElement,
  role: string,
  description: string
): AccessibleElement | undefined => {
  if (root["aria-role"] === role && root["aria-description"] === description) {
    return root;
  }
  return root.children?.find((child) =>
    findFirstElement(child, role, description)
  );
};

export const findFirstElementInAOM = (
  aom: AccessibilityObjectModel,
  role: string,
  description: string
): AccessibleElement | undefined => {
  return findFirstElement(aom.root, role, description);
};
