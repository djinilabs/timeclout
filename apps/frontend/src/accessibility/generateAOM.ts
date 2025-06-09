// Generates the Accessbility object model from the DOM
// It does that by traversing the DOM and creating a tree of accessible elements

import { AccessibilityObjectModel, AccessibleElement } from "./types";

// Only includes elements that have a role and description
export const generateAccessibilityObjectModel = (
  document: Document,
  includeDomElement: boolean = false
): AccessibilityObjectModel => {
  const traverseElement = (element: Element): AccessibleElement[] => {
    const role = element.getAttribute("role");
    const description =
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-description") ||
      "";

    // Process children first
    const children: AccessibleElement[] = [];
    for (const child of Array.from(element.children)) {
      children.push(...traverseElement(child));
    }

    // If this element has a role and a description, include it
    if (role && description) {
      // Collect all aria-* attributes
      const ariaAttributes: Record<string, string> = {};
      const ariaPrefix = "aria-";
      let hidden = false;
      for (const attr of element.attributes) {
        if (attr.name.startsWith(ariaPrefix)) {
          // Remove 'aria-' prefix and use the rest as the property name
          const propertyName = attr.name.slice(ariaPrefix.length);
          if (propertyName === "hidden") {
            hidden = true;
            continue;
          }
          const value = element.getAttribute(attr.name);
          if (value !== null) {
            ariaAttributes[propertyName] = value;
          }
        }
      }

      if (hidden) {
        return [];
      }

      const result = {
        role: role,
        description: description,
        attributes: ariaAttributes,
        children: children.length > 0 ? children : null,
        domElement: includeDomElement ? element : undefined,
      };
      return [result];
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
      attributes: {},
      children: accessibleChildren.length > 0 ? accessibleChildren : null,
      domElement: includeDomElement ? document.body : undefined,
    };
  }

  return {
    root: rootElement,
  };
};
