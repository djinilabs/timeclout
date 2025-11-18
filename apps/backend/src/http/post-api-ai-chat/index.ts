import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { boomify } from "@hapi/boom";
import { createUIMessageStream, streamText } from "ai";
import type { ModelMessage, ToolSet } from "ai";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { z } from "zod";

import {
  getLocaleFromHeaders,
  initI18n,
} from "../../../../../libs/locales/src";
import { handlingErrors } from "../../utils/handlingErrors";

import { convertUIMessagesToModelMessages } from "./utils/messageConversion";
import { authenticateUser, validateRequest } from "./utils/requestValidation";
import type { UIMessage } from "./utils/types";

import { getDefined } from "@/utils";

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// Helper function to create Google AI client
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

/**
 * Extracts locale from Accept-Language header, initializes i18n, and returns the appropriate system prompt.
 */
async function getSystemPrompt(event: APIGatewayProxyEventV2): Promise<string> {
  const acceptLanguage =
    event.headers?.["accept-language"] ||
    event.headers?.["Accept-Language"] ||
    "en";
  const locale = getLocaleFromHeaders(acceptLanguage);

  // Initialize i18n for this request
  await initI18n(locale);

  // Get system prompt based on locale
  return SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS.en;
}

export const handler: APIGatewayProxyHandlerV2 = handlingErrors(
  async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const requestId = event.requestContext.requestId;
    const startTime = Date.now();

    console.log(`[AI Chat] [${requestId}] Request received`, {
      method: event.requestContext.http.method,
      path: event.rawPath,
      hasBody: !!event.body,
      bodyLength: event.body?.length || 0,
      isBase64Encoded: event.isBase64Encoded,
    });

    try {
      // Validate request
      const { messages } = validateRequest(event);

      // Log raw messages as they arrive
      console.log(`[AI Chat] [${requestId}] Raw messages received:`, {
        count: messages.length,
        messages: JSON.stringify(messages, null, 2),
      });

      // Log each message individually
      messages.forEach((msg, idx) => {
        console.log(`[AI Chat] [${requestId}] Message ${idx}:`, {
          type: typeof msg,
          isObject: typeof msg === "object",
          isNull: msg === null,
          keys: typeof msg === "object" && msg !== null ? Object.keys(msg) : [],
          fullMessage: JSON.stringify(msg, null, 2),
        });
      });

      // Authenticate user
      await authenticateUser(event);

      // Get system prompt based on locale
      const systemPrompt = await getSystemPrompt(event);

      // Create Google AI client and model
      const google = createGoogleClient();
      const model = google(MODEL_NAME);

      // Convert messages to ModelMessage format
      let modelMessages: ModelMessage[];
      try {
        // Convert messages from AI SDK format (with parts) to UIMessage format
        // AI SDK sends messages with 'parts' array, we need to convert to 'content'
        const convertedMessages: UIMessage[] = messages
          .filter(
            (
              msg
            ): msg is { role: string; parts?: unknown[]; content?: unknown } =>
              msg != null &&
              typeof msg === "object" &&
              "role" in msg &&
              typeof msg.role === "string" &&
              (msg.role === "user" ||
                msg.role === "assistant" ||
                msg.role === "system" ||
                msg.role === "tool")
          )
          .map((msg) => {
            // If message has 'parts' array (from AI SDK useChat), convert to 'content'
            if ("parts" in msg && Array.isArray(msg.parts)) {
              const content = msg.parts.map((part) => {
                if (
                  typeof part === "object" &&
                  part !== null &&
                  "type" in part &&
                  part.type === "text" &&
                  "text" in part
                ) {
                  return { type: "text" as const, text: String(part.text) };
                }
                return part;
              });
              return {
                role: msg.role as UIMessage["role"],
                content,
              } as UIMessage;
            }
            // If message already has 'content', use it as-is
            if ("content" in msg) {
              return {
                role: msg.role as UIMessage["role"],
                content: msg.content,
              } as UIMessage;
            }
            // Fallback: create empty content
            return {
              role: msg.role as UIMessage["role"],
              content: "",
            } as UIMessage;
          });

        // Validate and filter messages to ensure they match UIMessage format
        const validMessages: UIMessage[] = convertedMessages.filter(
          (msg): msg is UIMessage =>
            msg != null &&
            typeof msg === "object" &&
            "role" in msg &&
            typeof msg.role === "string" &&
            (msg.role === "user" ||
              msg.role === "assistant" ||
              msg.role === "system" ||
              msg.role === "tool") &&
            "content" in msg
        );

        console.log(`[AI Chat] [${requestId}] Validated messages:`, {
          originalCount: messages.length,
          validCount: validMessages.length,
          validMessages: JSON.stringify(validMessages, null, 2),
        });

        // Filter out system messages (system prompt is passed separately)
        const nonSystemMessages = validMessages.filter(
          (msg) => msg.role !== "system"
        );

        console.log(`[AI Chat] [${requestId}] Non-system messages:`, {
          count: nonSystemMessages.length,
          messages: JSON.stringify(nonSystemMessages, null, 2),
        });

        modelMessages = convertUIMessagesToModelMessages(nonSystemMessages);

        console.log(`[AI Chat] [${requestId}] Converted model messages:`, {
          count: modelMessages.length,
          messages: JSON.stringify(modelMessages, null, 2),
        });

        // Validate that we have at least one message
        if (modelMessages.length === 0) {
          console.error(
            `[AI Chat] [${requestId}] No valid messages after conversion`,
            {
              originalMessages: messages.length,
              validMessages: validMessages.length,
              nonSystemMessages: nonSystemMessages.length,
            }
          );
          throw new Error(
            "No valid messages found. At least one user or assistant message is required."
          );
        }
      } catch (error) {
        console.error("[AI Chat] Error converting messages:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        throw error;
      }

      // Generate AI response using streaming
      let stream: ReadableStream<unknown>;
      try {
        console.log(
          `[AI Chat] [${requestId}] Creating UI message stream with ${modelMessages.length} messages`
        );

        // Create UI message stream with execute function that uses streamText
        stream = createUIMessageStream({
          execute: async ({ writer }) => {
            const result = await streamText({
              model: model as unknown as Parameters<
                typeof streamText
              >[0]["model"],
              system: systemPrompt,
              messages: modelMessages,
              tools,
            });

            // Get message ID for the stream (generate a simple ID)
            const messageId = `msg-${Date.now()}`;

            // Write text-start chunk
            writer.write({
              type: "text-start",
              id: messageId,
            });

            // Write text deltas to the stream
            for await (const textPart of result.textStream) {
              writer.write({
                type: "text-delta",
                delta: textPart,
                id: messageId,
              });
            }

            // Write text-end chunk
            writer.write({
              type: "text-end",
              id: messageId,
            });

            // Write tool calls if present
            const toolCalls = await result.toolCalls;
            if (toolCalls && toolCalls.length > 0) {
              for (const toolCall of toolCalls) {
                const toolCallArgs =
                  "args" in toolCall ? toolCall.args : toolCall.input;
                writer.write({
                  type: "tool-input-available",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  input: toolCallArgs,
                });
              }
            }

            // Finish the stream
            writer.write({
              type: "finish",
            });
          },
        });
      } catch (error) {
        console.error("[AI Chat] Error creating stream:", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          messageCount: modelMessages.length,
        });
        throw error;
      }

      // Consume the entire stream (since Lambda doesn't support true streaming)
      // Convert UIMessageChunk objects to data stream format
      const dataStreamChunks: string[] = [];
      const reader = stream.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          if (value && typeof value === "object" && "type" in value) {
            // Convert UIMessageChunk to data stream format
            if (value.type === "text-delta" && "delta" in value) {
              // Format: 0:${JSON.stringify(delta)}\n
              dataStreamChunks.push(`0:${JSON.stringify(value.delta)}\n`);
            } else if (
              value.type === "tool-input-available" &&
              "toolCallId" in value &&
              "toolName" in value
            ) {
              // Format: 2:${JSON.stringify(toolCall)}\n
              const toolCallData = {
                toolCallId: value.toolCallId,
                toolName: value.toolName,
                args: "input" in value ? value.input : {},
              };
              dataStreamChunks.push(`2:${JSON.stringify(toolCallData)}\n`);
            } else if (value.type === "finish") {
              // Format: d\n
              dataStreamChunks.push("d\n");
            }
            // Ignore other chunk types (text-start, text-end, etc.) as they're not needed in data stream format
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Join all chunks into a single string
      const body = dataStreamChunks.join("");

      const duration = Date.now() - startTime;
      console.log(
        `[AI Chat] [${requestId}] Request completed successfully in ${duration}ms`,
        {
          responseBodyLength: body.length,
        }
      );

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept-Language",
        },
        body,
      };
    } catch (error) {
      console.error("[AI Chat] Unhandled error:", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      const err = boomify(
        error instanceof Error ? error : new Error(String(error))
      );
      return {
        statusCode: err.output.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: err.message,
        }),
      };
    }
  }
);
