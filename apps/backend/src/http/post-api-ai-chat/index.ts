import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { badRequest, boomify, forbidden, internal } from "@hapi/boom";
import { generateText, tool } from "ai";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { z } from "zod";

import { createUserCache } from "../../../../../libs/graphql/src/resolverContext";
import { getSession } from "../../../../../libs/graphql/src/session/getSession";
import {
  getLocaleFromHeaders,
  initI18n,
} from "../../../../../libs/locales/src";

// Initialize Google Generative AI client at module level
const apiKey = process.env.GEMINI_API_KEY || "";
const googleClient = createGoogleGenerativeAI({
  apiKey,
});

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// System prompts
const SYSTEM_PROMPT_EN =
  "You are a helpful assistant inside TimeClout, a team scheduling application. You can interact with the product like a user, using tools to look at the UI, click elements, fill forms, and search documentation. Don't plan, just act. Use tools to answer questions, and if a tool fails, try again or navigate to another page.";

const SYSTEM_PROMPT_PT =
  "Você é um assistente útil dentro do TimeClout, uma aplicação de agendamento de equipas. Pode interagir com o produto como um utilizador, usando ferramentas para ver a interface, clicar em elementos, preencher formulários e pesquisar documentação. Não planeie, apenas aja. Use ferramentas para responder a perguntas e, se uma ferramenta falhar, tente novamente ou navegue para outra página.";

// Tool definitions
// Note: Tools execute on the frontend, but we need to define them here
// so the AI knows what tools are available. The execute functions are
// placeholders - actual execution happens on the frontend.
// Using type assertion to work around AI SDK v5 type issues
const tools = {
  describe_app_ui: tool({
    description:
      "Describes the current application UI state by scanning the DOM and creating a structured representation of all accessible elements on the page.",
    parameters: z.object({}),
    execute: async () => {
      // Tool execution happens on frontend - return placeholder
      // The frontend will execute the actual tool and send results back
      return { description: "" };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any),
  click_element: tool({
    description:
      "Clicks on UI elements to navigate or interact. Requires an element role and element description obtained from describe_app_ui.",
    parameters: z.object({
      role: z.string().describe("The role of the element to click"),
      description: z
        .string()
        .describe("The description of the element to click"),
    }),
    execute: async () => {
      // Tool execution happens on frontend - return placeholder
      // The frontend will execute the actual tool and send results back
      return { success: false };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any),
  fill_form_element: tool({
    description:
      "Fills in form fields with values. Finds the form element and fills it based on element type.",
    parameters: z.object({
      role: z.string().describe("The role of the form element"),
      description: z.string().describe("The description of the form element"),
      value: z.string().describe("The value to fill in the form element"),
    }),
    execute: async () => {
      // Tool execution happens on frontend - return placeholder
      // The frontend will execute the actual tool and send results back
      return { success: false };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any),
  search_documents: tool({
    description:
      "Performs semantic vector search through product documentation to find relevant information.",
    parameters: z.object({
      query: z.string().describe("The search query string"),
      topN: z
        .number()
        .optional()
        .default(5)
        .describe("Number of results to return (default: 5)"),
    }),
    execute: async () => {
      // Tool execution happens on frontend - return placeholder
      // The frontend will execute the actual tool and send results back
      return { results: [] };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any),
};

// Request/Response types
interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant" | "system" | "tool";
    content: string | unknown[];
  }>;
}

/**
 * Extract error status code from error object
 */
function getErrorStatusCode(error: unknown): number {
  if (error && typeof error === "object" && "output" in error) {
    return (
      (error as { output?: { statusCode?: number } }).output?.statusCode || 500
    );
  }
  return 500;
}

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResult> => {
  try {
    // Only handle POST requests
    if (event.requestContext.http.method !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Check authentication - user must be authenticated to use this endpoint
    const userCache = await createUserCache();
    const minimalContext = {
      event,
      lambdaContext: {} as Context,
      userCache,
    };
    const session = await getSession(minimalContext);
    if (!session) {
      throw forbidden("Authentication required to access this endpoint");
    }

    // Validate API key
    if (!apiKey) {
      throw internal("GEMINI_API_KEY is not set");
    }

    // Extract locale from Accept-Language header
    const acceptLanguage =
      event.headers?.["accept-language"] || event.headers?.["Accept-Language"];
    const locale = getLocaleFromHeaders(acceptLanguage);

    // Initialize i18n for this request
    await initI18n(locale);

    // Select system prompt based on locale
    const systemPrompt = locale === "pt" ? SYSTEM_PROMPT_PT : SYSTEM_PROMPT_EN;

    // Parse request body
    let body: ChatRequest;
    if (event.body) {
      try {
        body = JSON.parse(
          event.isBase64Encoded
            ? Buffer.from(event.body, "base64").toString()
            : event.body
        );
      } catch {
        throw badRequest("Invalid JSON in request body");
      }
    } else {
      throw badRequest("Request body is required");
    }

    // Validate messages
    if (!body.messages || !Array.isArray(body.messages)) {
      throw badRequest("Messages array is required");
    }

    // Filter out system messages (don't send to AI, but we'll add our own system prompt)
    const filteredMessages = body.messages.filter(
      (msg) => msg.role !== "system"
    );

    // Prepare messages for AI SDK
    // Note: Tool results from frontend will be handled in subsequent requests
    // For now, we only process user and assistant messages
    const aiMessages = filteredMessages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role as "user" | "assistant",
        content:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
      }));

    // Create model instance
    const model = googleClient(MODEL_NAME);

    // Generate text with tools
    // Note: The frontend will handle tool execution and send results back
    const result = await generateText({
      model,
      system: systemPrompt,
      messages: aiMessages,
      tools, // Tools are defined with type assertions to work around AI SDK v5 type issues
    });

    // Format response
    const response = {
      text: result.text,
      toolCalls: result.toolCalls,
      toolResults: result.toolResults,
      finishReason: result.finishReason,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error in AI chat handler:", error);

    // Convert to Boom error if not already
    let boomError;
    if (error && typeof error === "object" && "isBoom" in error) {
      boomError = error;
    } else {
      boomError = boomify(
        error instanceof Error ? error : new Error(String(error))
      );
    }

    const statusCode = getErrorStatusCode(boomError);
    const errorMessage =
      boomError instanceof Error ? boomError.message : String(boomError);

    return {
      statusCode,
      body: JSON.stringify({ error: errorMessage }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
