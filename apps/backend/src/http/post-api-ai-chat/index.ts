import { Writable } from "node:stream";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { boomify, forbidden } from "@hapi/boom";
import { convertToModelMessages, streamText } from "ai";
import type { ToolSet, UIMessage } from "ai";
import { Context } from "aws-lambda";
import { streamifyResponse, ResponseStream } from "lambda-stream";
import { z } from "zod";

import { createUserCache } from "../../../../../libs/graphql/src/resolverContext";
import { getSession } from "../../../../../libs/graphql/src/session/getSession";
import {
  getLocaleFromHeaders,
  initI18n,
} from "../../../../../libs/locales/src";

import { enhanceResponseStream } from "./enhanceResponseStream";
import { HttpResponseStream } from "./HttpResponseStream";

import { getDefined } from "@/utils";

// The GEMINI_API_KEY should be set in environment variables
const google = createGoogleGenerativeAI({
  apiKey: getDefined(process.env.GEMINI_API_KEY, "GEMINI_API_KEY is not set"),
  headers: {
    Referer: "http://localhost:3000/api/ai/chat",
    "Content-Type": "text/event-stream",
  },
});

const MODEL_NAME = "gemini-2.5-flash-preview-05-20";

// System prompts for different languages
const SYSTEM_PROMPTS: Record<string, string> = {
  en: `You are a helpful assistant that lives inside the TimeClout product (an application to help with team scheduling shifts).
You can interact with the TimeClout product like if you were a user of the application. You can look at the UI using the describe_app_ui tool.
You can click and on elements or open them using the click_element tool and then looking again to the UI to see the changes.
You can fill text fields using the fill_form_element tool.
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
// When tools are called, they will be streamed to the frontend for execution
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
};

export interface ChatRequest {
  messages: UIMessage[];
}

const replyWithError = (responseStream: Writable, _error: Error) => {
  const err = boomify(_error);
  const httpResponseMetadata = err.output.payload;
  responseStream = HttpResponseStream.from(
    responseStream,
    httpResponseMetadata
  );
  responseStream.write(`3:${JSON.stringify(err.output.payload.message)}\n`);
  responseStream.end();
};

export const handler = streamifyResponse(
  async (event, responseStream: Writable) => {
    return new Promise<void>((resolve) => {
      const httpResponseMetadata = {
        statusCode: 200,
        statusMessage: "OK",
        headers: {},
      };

      responseStream = HttpResponseStream.from(
        responseStream,
        httpResponseMetadata
      );

      // Use async IIFE to handle async operations inside the Promise constructor
      (async () => {
        try {
          // Only handle POST requests
          if (event.requestContext.http.method !== "POST") {
            responseStream.write("event: error\ndata: Method not allowed\n\n");
            responseStream.end();
            return;
          }

          // Check authentication - user must be authenticated to use this endpoint
          // Create minimal context for getSession (it only uses event, but needs proper typing)
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

          // Extract language from Accept-Language header
          const acceptLanguage =
            event.headers?.["accept-language"] ||
            event.headers?.["Accept-Language"] ||
            "en";
          const locale = getLocaleFromHeaders(acceptLanguage);

          // Initialize i18n for this request (though system prompt is hardcoded for now)
          await initI18n(locale);

          // Get system prompt based on locale
          const systemPrompt = SYSTEM_PROMPTS[locale] || SYSTEM_PROMPTS.en;

          // get messages
          let messages: Array<UIMessage> = [];
          if (event.body) {
            const body = JSON.parse(
              event.isBase64Encoded
                ? Buffer.from(event.body, "base64").toString()
                : event.body
            );
            if (body.messages) {
              messages = body.messages;
            }
          }

          // Filter out any system messages from client (shouldn't be any, but just in case)
          const nonSystemMessages = messages.filter(
            (msg) => msg.role !== "system"
          );

          // Configure model
          const model = google(MODEL_NAME);

          // Stream the AI response with tools and system prompt
          const result = streamText({
            model,
            system: systemPrompt,
            messages: convertToModelMessages(nonSystemMessages),
            tools,
            toolChoice: "auto",
          });

          const enhancedResponseStream = enhanceResponseStream(
            responseStream as ResponseStream,
            httpResponseMetadata
          );

          enhancedResponseStream.on("finish", () => {
            resolve();
          });

          // pipe result to response stream
          result.pipeUIMessageStreamToResponse(enhancedResponseStream);
        } catch (error) {
          console.error("Error in handler:", error);
          replyWithError(responseStream, error as Error);
          resolve();
        }
      })();
    });
  }
);
