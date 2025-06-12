// Generates the Accessbility object model from the DOM
// It does that by traversing the DOM and creating a tree of accessible elements

import { AccessibilityObjectModel, AccessibleElement } from "./types";

const relevantNonARIAAttributes = new Set(["name", "value"]);
const avoidAriaAttributes = new Set(["labelledby", "describedby", "controls"]);

// Only includes elements that have a role and description
export const generateAccessibilityObjectModel = (
  document: Document,
  includeDomElement: boolean = false
): AccessibilityObjectModel => {
  const traverseElement = (element: Element): AccessibleElement[] => {
    const role = element.getAttribute("role") || element.tagName.toLowerCase();

    const description =
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-description") ||
      element.getAttribute("value") ||
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
            break;
          }
          const value = element.getAttribute(attr.name);
          if (value && !avoidAriaAttributes.has(propertyName)) {
            if (propertyName !== "label" || value !== description) {
              ariaAttributes[propertyName] = value;
            }
          }
        } else if (relevantNonARIAAttributes.has(attr.name)) {
          const value = element.getAttribute(attr.name);
          if (value !== null) {
            ariaAttributes[attr.name] = value;
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
        children,
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
