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
  let result = `${indentString}<${element["aria-role"]} description="${
    element["aria-description"]
  }" ${printAttributes(element.attributes)}>\n`;
  if (element.children) {
    for (const child of element.children) {
      result += printAccessibleElement(child, indent + 2);
    }
  }
  result += `${indentString}</${element["aria-role"]}>\n`;
  return result;
};

export const printAOM = (aom: AccessibilityObjectModel): string => {
  return printAccessibleElement(aom.root, 0);
};
