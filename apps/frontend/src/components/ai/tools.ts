import { type ToolSet } from "ai";
import { z } from "zod";

import { findFirstElementInAOM } from "../../accessibility/findFirstElement";
import { generateAccessibilityObjectModel } from "../../accessibility/generateAOM";
import { printAOM } from "../../accessibility/printAOM";
import { AccessibleElement } from "../../accessibility/types";
import { searchDocuments } from "../../utils/docSearchManager";

import { timeout } from "@/utils";

const clickableRoles = ["button", "link", "checkbox", "radio", "combobox"];
const isElementClickable = (element: AccessibleElement) => {
  return (
    !!element.attributes.clickable || clickableRoles.includes(element.role)
  );
};

const simulateClick = (element: AccessibleElement) => {
  if (element.domElement instanceof HTMLElement) {
    element.domElement.click();
  }
};

const simulateTyping = (
  element: HTMLInputElement | HTMLTextAreaElement,
  text: string
) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    (element instanceof HTMLInputElement
      ? HTMLInputElement
      : HTMLTextAreaElement
    ).prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(element, text);
};

export const tools = (debounceActivity: () => Promise<void>): ToolSet => ({
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state, like the list of companies, units or teams. You can also use this to read the item being displayed on the page.",
    inputSchema: z.object({}),
    execute: async () => {
      console.log("tool call: describe_app_ui");
      const aom = generateAccessibilityObjectModel(document);
      return printAOM(aom);
    },
  },
  click_element: {
    description:
      'Click on the first element that matches the role and the description (or label) for that element that you got from the describe_app_ui tool. Can be used to navigate the application state to answer user queries. The element needs the "clickable" attribute to be "true".',
    inputSchema: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
    }),
    execute: async ({
      "element-role": role,
      "element-description": description,
    }) => {
      console.log("tool call: click_element", role, description);
      try {
        const aom = generateAccessibilityObjectModel(document, true);
        const element = findFirstElementInAOM(aom, role, description);
        if (element) {
          console.log("Element found", element);
          if (!isElementClickable(element)) {
            console.log("Element is not clickable", element);
            return {
              success: false,
              error:
                "Element is not clickable. Perhaps try clicking on a sub-element of this element.",
            };
          }
          //  ------------- click the element -------------

          if (element.domElement instanceof HTMLElement) {
            console.log("Clicking element", element.domElement);
            try {
              simulateClick(element);
              await debounceActivity();
            } catch (clickError) {
              console.error("Error clicking element:", clickError);
              return {
                success: false,
                error: `Failed to click element: ${
                  clickError instanceof Error ? clickError.message : String(clickError)
                }`,
              };
            }
            console.log("Element clicked with success", element);
            return { success: true };
          } else {
            console.log("Element is not an HTMLElement", element);
            return {
              success: false,
              error: "Element is not an HTMLElement",
            };
          }
        }
        console.log(
          "Element with the following role and description not found: role: ",
          role,
          "description: ",
          description
        );
        return {
          success: false,
          error: `Element with the following role and description not found: role: ${role}, description: ${description}. Please try a different description or check if the element is visible on the page.`,
        };
      } catch (error) {
        console.error("Error in click_element tool:", error);
        return {
          success: false,
          error: `An error occurred while trying to click the element: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
  },
  fill_form_element: {
    description:
      "Fill in a form element (textarea, input, select, radio, checkbox) with a value. Use this to interact with form elements in the UI. The element needs to be found by its role and description.",
    inputSchema: z.object({
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
      try {
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
            error: `Element with the following role and description not found: role: ${role}, description: ${description}. Please try a different description or check if the element is visible on the page.`,
          };
        }

        if (!element.domElement) {
          return {
            success: false,
            error: "Element has no DOM element. The element may not be accessible.",
          };
        }

        const domElement = element.domElement as HTMLElement;

        try {
          domElement.focus();
          // Handle different types of form elements
          if (domElement instanceof HTMLInputElement) {
            // if the role is "combobox", open it first, and then click the matching element
            if (element.role === "combobox") {
              console.log("Element is a combobox, opening it");
              try {
                domElement.click();
                await debounceActivity();
              } catch (comboboxError) {
                console.error("Error opening combobox:", comboboxError);
                return {
                  success: false,
                  error: `Failed to open combobox: ${
                    comboboxError instanceof Error ? comboboxError.message : String(comboboxError)
                  }`,
                };
              }
            }

            if (domElement.type === "checkbox") {
              domElement.checked = value.toLowerCase() === "true";
            } else if (domElement.type === "radio") {
              domElement.checked = true;
            } else {
              try {
                simulateTyping(domElement, value);
              } catch (typingError) {
                console.error("Error simulating typing:", typingError);
                return {
                  success: false,
                  error: `Failed to fill input field: ${
                    typingError instanceof Error ? typingError.message : String(typingError)
                  }`,
                };
              }
            }
          } else if (domElement instanceof HTMLTextAreaElement) {
            domElement.value = value;
          } else if (domElement instanceof HTMLSelectElement) {
            console.log("Element is a select element, setting value to", value);
            // Check if the value exists in the select options
            const optionExists = Array.from(domElement.options).some(
              (opt) => opt.value === value || opt.text === value
            );
            if (!optionExists) {
              return {
                success: false,
                error: `Value "${value}" is not available in the select options. Please choose a valid option.`,
              };
            }
            domElement.value = value;
          } else {
            return {
              success: false,
              error: "Element is not a form input element. Please use a different element.",
            };
          }

          await timeout(100);

          // Trigger input event to ensure React/other frameworks detect the change
          try {
            document.dispatchEvent(new Event("change", { bubbles: true }));
            document.dispatchEvent(new Event("input", { bubbles: true }));
            domElement.dispatchEvent(new Event("change", { bubbles: true }));
            domElement.dispatchEvent(new Event("input", { bubbles: true }));
            await debounceActivity();
          } catch (eventError) {
            console.error("Error dispatching events:", eventError);
            // Don't fail the operation if event dispatching fails
          }

          return { success: true };
        } catch (error) {
          console.error("Error filling form element:", error);
          return {
            success: false,
            error: `Error filling form element: ${
              error instanceof Error ? error.message : String(error)
            }`,
          };
        }
      } catch (error) {
        console.error("Error in fill_form_element tool:", error);
        return {
          success: false,
          error: `An error occurred while trying to fill the form element: ${
            error instanceof Error ? error.message : String(error)
          }`,
        };
      }
    },
  },
  search_documents: {
    description:
      "Search documentation using semantic vector search. Use this to find relevant information from the product documentation. When the user asks about features, use cases, workflows, or any product-related questions, use this tool to find relevant documentation snippets.",
    inputSchema: z.object({
      query: z
        .string()
        .min(1, "Query parameter is required and cannot be empty")
        .describe(
          "The search terms to look for in the documents. Extract this directly from the user's request."
        ),
      topN: z
        .number()
        .optional()
        .default(5)
        .describe("Number of top results to return (default: 5)"),
    }),
    execute: async ({ query, topN = 5 }) => {
      console.log("tool call: search_documents", query, topN);
      try {
        const apiUrl = `${window.location.origin}/api/ai/embedding`;

        const results = await searchDocuments(query, topN, apiUrl);

        if (results.length === 0) {
          return "No relevant documents found for the query. Please try rephrasing your question or using different keywords.";
        }

        // Format results similar to helpmaton
        const formattedResults = results
          .map((result) => result.snippet)
          .join("\n\n---\n\n");

        return `Found ${results.length} relevant document snippet(s):\n\n${formattedResults}`;
      } catch (error) {
        console.error("Error in search_documents tool:", error);
        
        // Provide user-friendly error messages
        if (error instanceof Error) {
          if (
            error.message.includes("timeout") ||
            error.message.includes("timed out")
          ) {
            throw new Error(
              "Document search timed out. The search is taking longer than expected. Please try again with a more specific query."
            );
          }
          if (
            error.message.includes("Failed to fetch") ||
            error.message.includes("network") ||
            error.message.includes("NetworkError")
          ) {
            throw new Error(
              "Unable to connect to the search service. Please check your internet connection and try again."
            );
          }
          if (error.message.includes("401") || error.message.includes("403")) {
            throw new Error(
              "You don't have permission to search documents. Please contact your administrator."
            );
          }
          if (error.message.includes("500") || error.message.includes("502") || error.message.includes("503")) {
            throw new Error(
              "The search service is temporarily unavailable. Please try again later."
            );
          }
        }
        
        // Re-throw with original error if it's already user-friendly
        throw error;
      }
    },
  },
});
