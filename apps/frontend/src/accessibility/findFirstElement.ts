import { AccessibilityObjectModel, AccessibleElement } from "./types";

const findFirstElement = (
  root: AccessibleElement,
  role: string,
  description: string
): AccessibleElement | undefined => {
  if (root.role === role && root.description === description) {
    return root;
  }

  if (!root.children) {
    return undefined;
  }

  for (const child of root.children) {
    const found = findFirstElement(child, role, description);
    if (found) {
      return found;
    }
  }

  return undefined;
};

export const findFirstElementInAOM = (
  aom: AccessibilityObjectModel,
  role: string,
  description: string
): AccessibleElement | undefined => {
  return findFirstElement(aom.root, role, description);
};
