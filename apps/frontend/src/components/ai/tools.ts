import z from "zod";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { ToolSet } from "ai";

export const tools: ToolSet = {
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state.",
    parameters: z.any(),
    execute: async () => {
      const aom = generateAccessibilityObjectModel(document);
      return {
        success: true,
        data: aom,
      };
    },
  },
  click_element: {
    description:
      "Click on the first element that matches the role and description. Can be used to navigate the application state to answer user queries.",
    parameters: z.object({
      role: z.string(),
      description: z.string(),
    }),
    execute: async ({ role, description }) => {
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
      return { success: false, error: "Element not found" };
    },
  },
};
