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
    for (const child of element.children) {
      children.push(...traverseElement(child));
    }

    // If this element has a role and a description, include it
    if (role && description) {
      // Collect all aria-* attributes
      const ariaAttributes: Record<string, string> = {};
      const ariaPrefix = "aria-";
      let hidden = false;
      for (const attribute of element.attributes) {
        if (attribute.name.startsWith(ariaPrefix)) {
          // Remove 'aria-' prefix and use the rest as the property name
          const propertyName = attribute.name.slice(ariaPrefix.length);
          if (propertyName === "hidden") {
            hidden = true;
            break;
          }
          const value = element.getAttribute(attribute.name);
          if (
            value &&
            !avoidAriaAttributes.has(propertyName) &&
            (propertyName !== "label" || value !== description)
          ) {
            ariaAttributes[propertyName] = value;
          }
        } else if (relevantNonARIAAttributes.has(attribute.name)) {
          const value = element.getAttribute(attribute.name);
          if (value !== null) {
            ariaAttributes[attribute.name] = value;
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
  const rootElement: AccessibleElement =
    accessibleChildren.length === 1
      ? accessibleChildren[0]
      : {
          role: "root",
          description: "root",
          attributes: {},
          children: accessibleChildren.length > 0 ? accessibleChildren : null,
          domElement: includeDomElement ? document.body : undefined,
        };

  return {
    root: rootElement,
  };
};
