import { AccessibilityObjectModel, AccessibleElement } from "./types";

const printAttributes = (attributes: Record<string, string>): string => {
  return Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
};

export const printAccessibleElement = (
  element: AccessibleElement,
  indent: number
): string => {
  const indentString = " ".repeat(indent);
  let result = `${indentString}<${element.role} description="${
    element.description
  }" ${printAttributes(element.attributes)}`;
  let closed = false;
  if (!element.children || element.children.length === 0) {
    closed = true;
    result += `/>\n`;
  } else {
    result += `>\n`;
  }
  if (element.children) {
    for (const child of element.children) {
      result += printAccessibleElement(child, indent + 2);
    }
  }
  if (!closed) {
    result += `${indentString}</${element.role}>\n`;
  }
  return result;
};

export const printAOM = (aom: AccessibilityObjectModel): string => {
  return printAccessibleElement(aom.root, 0);
};
