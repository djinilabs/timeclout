import { type ToolSet } from "ai";
import z from "zod";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { printAOM } from "../../accessibility/printAOM";

export const tools = (debounceActivity: () => Promise<void>): ToolSet => ({
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state, like the list of companies, units or teams. You can also use this to read the item being displayed on the page.",
    parameters: z.object({}),
    execute: async () => {
      console.log("tool call: describe_app_ui");
      const aom = generateAccessibilityObjectModel(document);
      const printedAOM = printAOM(aom);
      console.log("printedAOM", printedAOM);
      return printedAOM;
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
      console.log("tool call: click_element", role, description);
      const aom = generateAccessibilityObjectModel(document, true);
      const element = findFirstElementInAOM(aom, role, description);
      if (element) {
        console.log("Element found", element);
        if (!element.attributes.clickable) {
          console.log("Element is not clickable", element);
          return {
            success: false,
            error:
              "Element is not clickable. Perhaps try clicking on a sub-element of this element.",
          };
        }
        // click the element
        if (element.domElement instanceof HTMLElement) {
          console.log("Clicking element", element.domElement);
          element.domElement.click();
          await debounceActivity();
        } else {
          console.log("Element is not an HTMLElement", element);
          return {
            success: false,
            error: "Element is not an HTMLElement",
          };
        }
        console.log("Element clicked with success", element);
        return { success: true };
      }
      console.log(
        "Element with the following role and description not found: role: ",
        role,
        "description: ",
        description
      );
      return {
        success: false,
        error: `Element with the following role and description not found: role: ${role}, description: ${description}`,
      };
    },
  },
  fill_form_element: {
    description:
      "Fill in a form element (textarea, input, select, radio, checkbox) with a value. Use this to interact with form elements in the UI. The element needs to be found by its role and description.",
    parameters: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
      value: z.string(),
    }),
    execute: async ({
      "element-role": role,
      "element-description": description,
      value,
    }) => {
      console.log("tool call: fill_form_element", role, description, value);
      const aom = generateAccessibilityObjectModel(document, true);
      const element = findFirstElementInAOM(aom, role, description);

      if (!element) {
        console.log(
          "Element with the following role and description not found: role: ",
          role,
          "description: ",
          description
        );
        return {
          success: false,
          error: `Element with the following role and description not found: role: ${role}, description: ${description}`,
        };
      }

      if (!element.domElement) {
        return {
          success: false,
          error: "Element has no DOM element",
        };
      }

      const domElement = element.domElement as HTMLElement;

      try {
        // Handle different types of form elements
        if (domElement instanceof HTMLInputElement) {
          if (domElement.type === "checkbox") {
            domElement.checked = value.toLowerCase() === "true";
          } else if (domElement.type === "radio") {
            domElement.checked = true;
          } else {
            domElement.value = value;
          }
        } else if (domElement instanceof HTMLTextAreaElement) {
          domElement.value = value;
        } else if (domElement instanceof HTMLSelectElement) {
          domElement.value = value;
        } else {
          return {
            success: false,
            error: "Element is not a form input element",
          };
        }

        // Trigger input event to ensure React/other frameworks detect the change
        domElement.dispatchEvent(new Event("input", { bubbles: true }));
        await debounceActivity();

        return { success: true };
      } catch (error) {
        console.error("Error filling form element:", error);
        return {
          success: false,
          error: `Error filling form element: ${error}`,
        };
      }
    },
  },
});
