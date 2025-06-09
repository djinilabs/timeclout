import { type ToolSet } from "ai";
import z from "zod";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { printAOM } from "../../accessibility/printAOM";

export const tools: ToolSet = {
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state, like the list of companies, units or teams. You can also use this to read the item being displayed on the page.",
    parameters: z.any(),
    execute: async () => {
      const aom = generateAccessibilityObjectModel(document);
      return printAOM(aom);
    },
  },
  click_element: {
    description:
      'Click on the first element that matches the role and the description (or label) for that element that you got from the describe_app_ui tool. Can be used to navigate the application state to answer user queries. The element needs the "clickable" attribute to be "true".',
    parameters: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
    }),
    execute: async ({
      "element-role": role,
      "element-description": description,
    }) => {
      const aom = generateAccessibilityObjectModel(document, true);
      const element = findFirstElementInAOM(aom, role, description);
      if (element) {
        // click the element
        if (element.domElement instanceof HTMLElement) {
          element.domElement.click();
        } else {
          return {
            success: false,
            error: "Element is not an HTMLElement",
          };
        }
        return { success: true };
      }
      return {
        success: false,
        error: `Element with the following role and description not found: role: ${role}, description: ${description}`,
      };
    },
  },
};
