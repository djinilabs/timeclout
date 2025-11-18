import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { forbidden } from "@hapi/boom";
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

import { getDefined } from "@/utils";
import { handlingErrors } from "../../utils/handlingErrors";

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
            content: msgObj.content.length > 200 
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

export const handler = handlingErrors(
  async (
    event: APIGatewayProxyEventV2
  ): Promise<APIGatewayProxyResult> => {
    const requestId = event.requestContext.requestId;
    const startTime = Date.now();
    
    try {
      console.log(`[AI Chat] [${requestId}] Request received`, {
        method: event.requestContext.http.method,
        path: event.rawPath,
        hasBody: !!event.body,
        bodyLength: event.body?.length || 0,
        isBase64Encoded: event.isBase64Encoded,
        headers: {
          "accept-language": event.headers?.["accept-language"] || event.headers?.["Accept-Language"],
          "content-type": event.headers?.["content-type"] || event.headers?.["Content-Type"],
        },
      });

      // Only handle POST requests
      if (event.requestContext.http.method !== "POST") {
        console.warn(`[AI Chat] [${requestId}] Method not allowed: ${event.requestContext.http.method}`);
        return {
          statusCode: 405,
          body: JSON.stringify({ error: "Method not allowed" }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      // Check authentication - user must be authenticated to use this endpoint
      let userCache;
      let session;
      try {
        console.log(`[AI Chat] [${requestId}] Creating user cache...`);
        userCache = await createUserCache();
        console.log(`[AI Chat] [${requestId}] User cache created successfully`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to create user cache:`, error);
        throw error;
      }

      try {
        console.log(`[AI Chat] [${requestId}] Getting session...`);
        const minimalContext = {
          event,
          lambdaContext: {} as Context,
          userCache,
        };
        session = await getSession(minimalContext);
        console.log(`[AI Chat] [${requestId}] Session retrieved`, {
          hasSession: !!session,
          userId: session?.user?.id || "none",
        });
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to get session:`, error);
        throw error;
      }

      if (!session) {
        console.warn(`[AI Chat] [${requestId}] Authentication required but no session found`);
        throw forbidden("Authentication required to access this endpoint");
      }

      // Extract language from Accept-Language header
      let locale: string;
      let systemPrompt: string;
      try {
        console.log(`[AI Chat] [${requestId}] Extracting locale...`);
        const acceptLanguage =
          event.headers?.["accept-language"] ||
          event.headers?.["Accept-Language"] ||
          "en";
        locale = getLocaleFromHeaders(acceptLanguage);
        console.log(`[AI Chat] [${requestId}] Locale determined: ${locale}`);

        // Initialize i18n for this request (though system prompt is hardcoded for now)
        await initI18n(locale);
        console.log(`[AI Chat] [${requestId}] i18n initialized`);

        // Get system prompt based on locale
        systemPrompt = SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS.en;
        console.log(`[AI Chat] [${requestId}] System prompt selected for locale: ${locale}`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to initialize i18n:`, error);
        throw error;
      }

      // Parse and validate messages
      let messages: Array<UIMessage> = [];
      try {
        console.log(`[AI Chat] [${requestId}] Parsing request body...`);
        if (event.body) {
          const body = JSON.parse(
            event.isBase64Encoded
              ? Buffer.from(event.body, "base64").toString()
              : event.body
          );
          
          // Log sanitized body for debugging
          console.log(`[AI Chat] [${requestId}] Request body parsed:`, {
            hasMessages: !!body.messages,
            messageCount: Array.isArray(body.messages) ? body.messages.length : 0,
            sanitizedBody: sanitizeForLogging(body),
          });
          
          if (body.messages) {
            if (!Array.isArray(body.messages)) {
              console.error(`[AI Chat] [${requestId}] Messages is not an array:`, typeof body.messages);
              return {
                statusCode: 400,
                body: JSON.stringify({ error: "messages must be an array" }),
                headers: {
                  "Content-Type": "application/json",
                },
              };
            }
            messages = body.messages;
          }
        } else {
          console.warn(`[AI Chat] [${requestId}] No request body provided`);
        }
        console.log(`[AI Chat] [${requestId}] Parsed ${messages.length} messages`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to parse request body:`, error);
        if (error instanceof SyntaxError) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON in request body" }),
            headers: {
              "Content-Type": "application/json",
            },
          };
        }
        throw error;
      }

      // Filter out any system messages from client (shouldn't be any, but just in case)
      const nonSystemMessages = messages.filter(
        (msg) => msg.role !== "system"
      );
      console.log(`[AI Chat] [${requestId}] Filtered to ${nonSystemMessages.length} non-system messages`);

      // Create Google AI client and configure model
      let google;
      let model;
      try {
        console.log(`[AI Chat] [${requestId}] Creating Google AI client...`);
        google = createGoogleClient();
        console.log(`[AI Chat] [${requestId}] Google AI client created`);
        
        console.log(`[AI Chat] [${requestId}] Configuring model: ${MODEL_NAME}`);
        model = google(MODEL_NAME);
        console.log(`[AI Chat] [${requestId}] Model configured`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to create Google AI client or configure model:`, error);
        throw error;
      }

      // Generate the AI response with tools and system prompt
      let result;
      try {
        console.log(`[AI Chat] [${requestId}] Generating AI response...`, {
          messageCount: nonSystemMessages.length,
          hasSystemPrompt: !!systemPrompt,
          systemPromptLength: systemPrompt.length,
          toolCount: Object.keys(tools).length,
        });
        
        result = await generateText({
          model,
          system: systemPrompt,
          messages: convertToModelMessages(nonSystemMessages),
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
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to generate AI response:`, error);
        // Log additional context for AI generation errors
        if (error instanceof Error) {
          console.error(`[AI Chat] [${requestId}] Error details:`, {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
        throw error;
      }

      // Format response for AI SDK's DefaultChatTransport
      let message: {
        role: "assistant";
        content: string | null;
        tool_calls?: Array<{
          id: string;
          type: "function";
          function: {
            name: string;
            arguments: string;
          };
        }>;
      };
      try {
        console.log(`[AI Chat] [${requestId}] Formatting response message...`);
        message = {
          role: "assistant",
          content: result.text || null,
        };

        // Include tool calls inside the message if any
        if (result.toolCalls && result.toolCalls.length > 0) {
          console.log(`[AI Chat] [${requestId}] Adding ${result.toolCalls.length} tool calls to message`);
          message.tool_calls = result.toolCalls.map((toolCall) => ({
            id: toolCall.toolCallId,
            type: "function" as const,
            function: {
              name: toolCall.toolName,
              arguments: JSON.stringify(
                "args" in toolCall ? toolCall.args : toolCall.input
              ),
            },
          }));
        }
        console.log(`[AI Chat] [${requestId}] Message formatted`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to format response message:`, error);
        throw error;
      }

      // Format response in OpenAI-compatible format
      let responseBody;
      try {
        console.log(`[AI Chat] [${requestId}] Formatting OpenAI-compatible response...`);
        responseBody = {
          id: result.response.id || `chatcmpl-${Date.now()}`,
          object: "chat.completion",
          created: Math.floor(Date.now() / 1000),
          model: MODEL_NAME,
          choices: [
            {
              index: 0,
              message,
              finish_reason: result.finishReason || "stop",
            },
          ],
          usage: {
            prompt_tokens:
              result.usage && "promptTokens" in result.usage
                ? (result.usage as { promptTokens: number }).promptTokens
                : 0,
            completion_tokens:
              result.usage && "completionTokens" in result.usage
                ? (result.usage as { completionTokens: number }).completionTokens
                : 0,
            total_tokens:
              result.usage && "totalTokens" in result.usage
                ? (result.usage as { totalTokens: number }).totalTokens
                : 0,
          },
        };
        console.log(`[AI Chat] [${requestId}] Response body formatted`);
      } catch (error) {
        console.error(`[AI Chat] [${requestId}] Failed to format response body:`, error);
        throw error;
      }

      const duration = Date.now() - startTime;
      console.log(`[AI Chat] [${requestId}] Request completed successfully in ${duration}ms`, {
        responseId: responseBody.id,
        hasToolCalls: !!(message.tool_calls && message.tool_calls.length > 0),
        tokenUsage: responseBody.usage,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept-Language",
        },
        isBase64Encoded: false,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[AI Chat] [${requestId}] Request failed after ${duration}ms:`, error);
      
      // Log detailed error information
      if (error instanceof Error) {
        console.error(`[AI Chat] [${requestId}] Error details:`, {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        });
      } else {
        console.error(`[AI Chat] [${requestId}] Unknown error type:`, {
          type: typeof error,
          value: String(error),
        });
      }
      
      // Re-throw to let handlingErrors wrapper handle it
      throw error;
    }
  }
);
