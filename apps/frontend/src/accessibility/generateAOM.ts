// Generates the Accessbility object model from the DOM
// It does that by traversing the DOM and creating a tree of accessible elements

import { AccessibilityObjectModel, AccessibleElement } from "./types";

// Only includes elements that have a role and description
export const generateAccessibilityObjectModel = (
  document: Document
): AccessibilityObjectModel => {
  const traverseElement = (element: Element): AccessibleElement[] => {
    const role = element.getAttribute("role");
    const description =
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-description") ||
      element.textContent?.trim() ||
      "";

    // Process children first
    const children: AccessibleElement[] = [];
    for (const child of Array.from(element.children)) {
      children.push(...traverseElement(child));
    }

    // If this element has a role, include it
    if (role) {
      return [
        {
          role,
          description,
          children: children.length > 0 ? children : null,
        },
      ];
    }

    // If no role, return its children (flatten)
    return children;
  };

  // Start traversal from document body
  const accessibleChildren = traverseElement(document.body);
  let rootElement: AccessibleElement;
  if (accessibleChildren.length === 1) {
    rootElement = accessibleChildren[0];
  } else {
    rootElement = {
      role: "root",
      description: "root",
      children: accessibleChildren.length > 0 ? accessibleChildren : null,
    };
  }

  return {
    root: rootElement,
  };
};
