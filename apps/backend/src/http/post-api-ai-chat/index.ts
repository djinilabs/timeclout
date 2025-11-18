import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { badRequest, forbidden, methodNotAllowed } from "@hapi/boom";
import { convertToModelMessages, generateText } from "ai";
import type { ToolSet, UIMessage } from "ai";
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
import { handlingErrors } from "../../utils/handlingErrors";

import { getDefined } from "@/utils";

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// Helper function to create Google AI client
// This is called inside the handler to ensure errors are caught properly
const createGoogleClient = () => {
  const apiKey = getDefined(
    process.env.GEMINI_API_KEY,
    "GEMINI_API_KEY is not set"
  );
  return createGoogleGenerativeAI({
    apiKey,
    headers: {
      Referer: "http://localhost:3000/api/ai/chat",
      "Content-Type": "application/json",
    },
  });
};

// System prompts for different languages
const SYSTEM_PROMPTS: Record<string, string> = {
  en: `You are a helpful assistant that lives inside the TimeClout product (an application to help with team scheduling shifts).
You can interact with the TimeClout product like if you were a user of the application. You can look at the UI using the describe_app_ui tool.
You can click and on elements or open them using the click_element tool and then looking again to the UI to see the changes.
You can fill text fields using the fill_form_element tool.
You can search the product documentation using the search_documents tool. Use this tool when users ask about:
- Product features, capabilities, or functionality
- Use cases, workflows, or how to accomplish tasks
- Competitive advantages or benefits
- Any questions about what TimeClout can do or how it works
When using search_documents, extract the key terms from the user's question and use them as the query parameter.
You should use the tools provided to you to answer questions and help with tasks.
Don't plan, just act.
If the user asks you to do something, you should try to use the provided tools.
After you have received a tool-result, reply to the user in __plain english__ with your findings.
If a tool result is an error, you should try to use the tools again.
If the tool does not get you the data you need, try navigating to another page.
If that does not work, just say you don't have enough data.
`,
  pt: `Você é um assistente útil que vive dentro do produto TimeClout (um aplicativo para ajudar com agendamento de turnos de equipe).
Você pode interagir com o produto TimeClout como se fosse um usuário do aplicativo. Você pode olhar para a UI usando a ferramenta describe_app_ui.
Você pode clicar em elementos ou abri-los usando a ferramenta click_element e depois olhar novamente para a UI para ver as mudanças.
Você pode preencher campos de texto usando a ferramenta fill_form_element.
Você pode pesquisar a documentação do produto usando a ferramenta search_documents. Use esta ferramenta quando os usuários perguntarem sobre:
- Funcionalidades, capacidades ou funcionalidades do produto
- Casos de uso, fluxos de trabalho ou como realizar tarefas
- Vantagens competitivas ou benefícios
- Qualquer pergunta sobre o que o TimeClout pode fazer ou como funciona
Ao usar search_documents, extraia os termos-chave da pergunta do usuário e use-os como parâmetro de consulta.
Você deve usar as ferramentas fornecidas para responder perguntas e ajudar com tarefas.
Não planeie, apenas aja.
Se o utilizador pedir para você fazer algo, você deve tentar usar as ferramentas fornecidas.
Depois de receber um resultado de ferramenta, responda ao usuário em __português simples__ com suas descobertas.
Se um resultado de ferramenta for um erro, você deve tentar usar as ferramentas novamente.
Se a ferramenta não conseguir os dados de que você precisa, tente navegar para outra página.
Se isso não funcionar, simplesmente diga que não tem dados suficientes.
`,
};

// Define tools that will be executed on the frontend
// These tools allow the AI to interact with the UI
// Tool execution happens on the frontend, but definitions are here so the AI knows about them
// When tools are called, they will be sent to the frontend for execution
// NOTE: We do NOT include execute functions here - this prevents server-side execution
// The frontend will handle execution via the onToolCall handler
const tools: ToolSet = {
  describe_app_ui: {
    description:
      "Describes the current app UI. Use this to answer user queries and read the application state, like the list of companies, units or teams. You can also use this to read the item being displayed on the page.",
    inputSchema: z.object({}),
    // No execute function - tool calls are handled on the frontend
  },
  click_element: {
    description:
      'Click on the first element that matches the role and the description (or label) for that element that you got from the describe_app_ui tool. Can be used to navigate the application state to answer user queries. The element needs the "clickable" attribute to be "true".',
    inputSchema: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
    }),
    // No execute function - tool calls are handled on the frontend
  },
  fill_form_element: {
    description:
      "Fill in a form element (textarea, input, select, radio, checkbox) with a value. Use this to interact with form elements in the UI. The element needs to be found by its role and description.",
    inputSchema: z.object({
      "element-role": z.string(),
      "element-description": z.string(),
      value: z.string(),
    }),
    // No execute function - tool calls are handled on the frontend
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
    // No execute function - tool calls are handled on the frontend
  },
};

export interface ChatRequest {
  messages: UIMessage[];
}

/**
 * Sanitize request body for logging (remove sensitive data)
 */
function sanitizeForLogging(body: unknown): unknown {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sanitized = { ...body } as Record<string, unknown>;

  // Remove or mask sensitive fields
  if ("messages" in sanitized && Array.isArray(sanitized.messages)) {
    sanitized.messages = sanitized.messages.map((msg: unknown) => {
      if (typeof msg === "object" && msg !== null) {
        const msgObj = msg as Record<string, unknown>;
        // Keep structure but limit content length for logging
        if ("content" in msgObj && typeof msgObj.content === "string") {
          return {
            ...msgObj,
            content:
              msgObj.content.length > 200
                ? msgObj.content.substring(0, 200) + "..."
                : msgObj.content,
          };
        }
      }
      return msg;
    });
  }

  return sanitized;
}

/**
 * Validates that the HTTP method is POST.
 * Throws methodNotAllowed (405) if the method is not POST.
 */
function validateRequestMethod(
  event: APIGatewayProxyEventV2,
  requestId: string
): void {
  if (event.requestContext.http.method !== "POST") {
    console.warn(
      `[AI Chat] [${requestId}] Method not allowed: ${event.requestContext.http.method}`
    );
    throw methodNotAllowed(
      `Method ${event.requestContext.http.method} not allowed. Only POST is supported.`
    );
  }
}

/**
 * Authenticates the user by creating a user cache and retrieving the session.
 * Throws forbidden (403) if authentication fails or no session is found.
 */
async function authenticateUser(
  event: APIGatewayProxyEventV2,
  requestId: string
): Promise<{
  userCache: Awaited<ReturnType<typeof createUserCache>>;
  session: Awaited<ReturnType<typeof getSession>>;
}> {
  console.log(`[AI Chat] [${requestId}] Creating user cache...`);
  const userCache = await createUserCache();
  console.log(`[AI Chat] [${requestId}] User cache created successfully`);

  console.log(`[AI Chat] [${requestId}] Getting session...`);
  const minimalContext = {
    event,
    lambdaContext: {} as Context,
    userCache,
  };
  const session = await getSession(minimalContext);
  console.log(`[AI Chat] [${requestId}] Session retrieved`, {
    hasSession: !!session,
    userId: session?.user?.id || "none",
  });

  if (!session) {
    console.warn(
      `[AI Chat] [${requestId}] Authentication required but no session found`
    );
    throw forbidden("Authentication required to access this endpoint");
  }

  return { userCache, session };
}

/**
 * Extracts locale from Accept-Language header, initializes i18n, and returns the appropriate system prompt.
 */
async function getSystemPrompt(
  event: APIGatewayProxyEventV2,
  requestId: string
): Promise<string> {
  console.log(`[AI Chat] [${requestId}] Extracting locale...`);
  const acceptLanguage =
    event.headers?.["accept-language"] ||
    event.headers?.["Accept-Language"] ||
    "en";
  const locale = getLocaleFromHeaders(acceptLanguage);
  console.log(`[AI Chat] [${requestId}] Locale determined: ${locale}`);

  // Initialize i18n for this request (though system prompt is hardcoded for now)
  await initI18n(locale);
  console.log(`[AI Chat] [${requestId}] i18n initialized`);

  // Get system prompt based on locale
  const systemPrompt = SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS.en;
  console.log(
    `[AI Chat] [${requestId}] System prompt selected for locale: ${locale}`
  );

  return systemPrompt;
}

/**
 * Parses and validates the request body to extract messages.
 * Throws badRequest (400) for invalid JSON or invalid messages format.
 */
function parseMessages(
  event: APIGatewayProxyEventV2,
  requestId: string
): Array<UIMessage> {
  console.log(`[AI Chat] [${requestId}] Parsing request body...`);

  if (!event.body) {
    console.warn(`[AI Chat] [${requestId}] No request body provided`);
    return [];
  }

  let body: { messages?: unknown };
  try {
    body = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString()
        : event.body
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(
        `[AI Chat] [${requestId}] Failed to parse request body:`,
        error
      );
      throw badRequest("Invalid JSON in request body");
    }
    throw error;
  }

  // Log sanitized body for debugging
  console.log(`[AI Chat] [${requestId}] Request body parsed:`, {
    hasMessages: !!body.messages,
    messageCount: Array.isArray(body.messages) ? body.messages.length : 0,
    sanitizedBody: sanitizeForLogging(body),
  });

  if (!body.messages) {
    return [];
  }

  if (!Array.isArray(body.messages)) {
    console.error(
      `[AI Chat] [${requestId}] Messages is not an array:`,
      typeof body.messages
    );
    throw badRequest("messages must be an array");
  }

  const messages = body.messages as Array<UIMessage>;
  console.log(`[AI Chat] [${requestId}] Parsed ${messages.length} messages`);

  return messages;
}

/**
 * Creates and configures the Google AI model.
 */
function createAIModel(requestId: string) {
  console.log(`[AI Chat] [${requestId}] Creating Google AI client...`);
  const google = createGoogleClient();
  console.log(`[AI Chat] [${requestId}] Google AI client created`);

  console.log(`[AI Chat] [${requestId}] Configuring model: ${MODEL_NAME}`);
  const model = google(MODEL_NAME);
  console.log(`[AI Chat] [${requestId}] Model configured`);

  return model;
}

/**
 * Generates AI response using the provided model, system prompt, and messages.
 */
async function generateAIResponse(
  model: ReturnType<typeof createAIModel>,
  systemPrompt: string,
  messages: Array<UIMessage>,
  requestId: string
): Promise<Awaited<ReturnType<typeof generateText>>> {
  console.log(`[AI Chat] [${requestId}] Generating AI response...`, {
    messageCount: messages.length,
    hasSystemPrompt: !!systemPrompt,
    systemPromptLength: systemPrompt.length,
    toolCount: Object.keys(tools).length,
  });

  const result = await generateText({
    model,
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools,
    toolChoice: "auto",
  });

  console.log(`[AI Chat] [${requestId}] AI response generated`, {
    hasText: !!result.text,
    textLength: result.text?.length || 0,
    toolCallCount: result.toolCalls?.length || 0,
    finishReason: result.finishReason,
    usage: result.usage,
  });

  return result;
}

/**
 * Formats the AI result into streaming response format.
 * Format: 0:"text content"\n for text, 2:{"toolCallId":"...","toolName":"...","args":{...}}\n for tool calls, d\n for done
 */
function formatStreamingResponse(
  result: Awaited<ReturnType<typeof generateText>>,
  requestId: string
): string {
  console.log(`[AI Chat] [${requestId}] Formatting streaming response...`);
  const chunks: string[] = [];

  // Add text content if present
  if (result.text && result.text.trim().length > 0) {
    // Escape the content: backslashes, quotes, newlines, carriage returns
    const escapedContent = result.text
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
    // Format: 0:"text content"\n
    chunks.push(`0:"${escapedContent}"\n`);
    console.log(
      `[AI Chat] [${requestId}] Added text chunk (length: ${result.text.length})`
    );
  } else {
    console.warn(`[AI Chat] [${requestId}] No text content in result`, {
      hasText: !!result.text,
      textValue: result.text,
      textLength: result.text?.length || 0,
    });
  }

  // Add tool calls if present
  if (result.toolCalls && result.toolCalls.length > 0) {
    console.log(
      `[AI Chat] [${requestId}] Adding ${result.toolCalls.length} tool calls`
    );
    for (const toolCall of result.toolCalls) {
      const toolCallArgs = "args" in toolCall ? toolCall.args : toolCall.input;
      // Format: 2:{"toolCallId":"...","toolName":"...","args":{...}}\n
      const toolCallData = {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCallArgs,
      };
      chunks.push(`2:${JSON.stringify(toolCallData)}\n`);
      console.log(
        `[AI Chat] [${requestId}] Added tool call chunk: ${toolCall.toolName}`
      );
    }
  }

  // Add done signal
  chunks.push("d\n");

  // Join all chunks into the response body
  const responseBody = chunks.join("");
  console.log(
    `[AI Chat] [${requestId}] Streaming response formatted (${chunks.length} chunks)`
  );

  return responseBody;
}

export const handler = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const requestId = event.requestContext.requestId;
    const startTime = Date.now();

    console.log(`[AI Chat] [${requestId}] Request received`, {
      method: event.requestContext.http.method,
      path: event.rawPath,
      hasBody: !!event.body,
      bodyLength: event.body?.length || 0,
      isBase64Encoded: event.isBase64Encoded,
      headers: {
        "accept-language":
          event.headers?.["accept-language"] ||
          event.headers?.["Accept-Language"],
        "content-type":
          event.headers?.["content-type"] || event.headers?.["Content-Type"],
      },
    });

    // Validate HTTP method
    validateRequestMethod(event, requestId);

    // Authenticate user
    await authenticateUser(event, requestId);

    // Get system prompt based on locale
    const systemPrompt = await getSystemPrompt(event, requestId);

    // Parse and validate messages
    const messages = parseMessages(event, requestId);

    // Filter out any system messages from client (shouldn't be any, but just in case)
    const nonSystemMessages = messages.filter((msg) => msg.role !== "system");
    console.log(
      `[AI Chat] [${requestId}] Filtered to ${nonSystemMessages.length} non-system messages`
    );

    // Create and configure AI model
    const model = createAIModel(requestId);

    // Generate AI response
    const result = await generateAIResponse(
      model,
      systemPrompt,
      nonSystemMessages,
      requestId
    );

    // Format streaming response
    const responseBody = formatStreamingResponse(result, requestId);

    const duration = Date.now() - startTime;
    console.log(
      `[AI Chat] [${requestId}] Request completed successfully in ${duration}ms`,
      {
        hasText: !!result.text,
        textLength: result.text?.length || 0,
        toolCallCount: result.toolCalls?.length || 0,
        responseBodyLength: responseBody.length,
      }
    );

    return {
      statusCode: 200,
      body: responseBody,
      headers: {
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept-Language",
      },
      isBase64Encoded: false,
    };
  }
);
