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
const referer =
  process.env.GEMINI_REFERER || "http://localhost:3000/api/ai/chat";

// Create custom fetch function with referer header
const customFetch = async (
  url: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  const headers = new Headers(init?.headers);
  headers.set("Referer", referer);
  headers.set("referer", referer); // lowercase version

  return fetch(url, {
    ...init,
    headers,
    referrer: referer,
  });
};

const googleClient = createGoogleGenerativeAI({
  apiKey,
  fetch: customFetch,
});

const MODEL_NAME = "gemini-2.5-flash";

// System prompts
const SYSTEM_PROMPT_EN = `You are the TimeClout AI assistant, a helpful customer support agent for TimeClout, a team scheduling application. Your name is TimeClout AI Assistant, not Gemini. You help users with questions about TimeClout, guide them through the application, and assist with scheduling tasks. Always identify yourself as the TimeClout AI Assistant.

You have access to the following tools to interact with the TimeClout application:

1. **describe_app_ui**: Use this tool to see what's currently on the screen. Call this FIRST when you need to understand the current UI state, find elements, or see what data is displayed. This tool returns a structured description of all accessible elements on the page, including their roles and descriptions.

2. **click_element**: Use this tool to click on buttons, links, or other clickable elements. You need to provide the element's role and description (obtained from describe_app_ui). Only click elements that are marked as clickable (buttons, links, checkboxes, radio buttons, comboboxes). After clicking, wait for the UI to update before taking the next action.

3. **fill_form_element**: Use this tool to fill in form fields like text inputs, textareas, selects, checkboxes, or radio buttons. You need to provide the element's role, description (from describe_app_ui), and the value to fill. The tool handles different input types automatically (text, checkboxes, dropdowns, etc.).

4. **search_documents**: Use this tool to search through TimeClout's product documentation when you need to answer questions about features, workflows, or how things work. Provide a search query and optionally the number of results (default is 5). This uses semantic search to find relevant documentation snippets.

**Tool Usage Guidelines:**
- Always start by calling describe_app_ui to understand the current screen state
- Use search_documents when users ask about features, how to do something, or need information from the documentation
- Use click_element to navigate or interact with buttons/links
- Use fill_form_element to enter data into forms
- After any click or form fill, the UI will update automatically - wait for it to settle before the next action
- If a tool fails, try again or use describe_app_ui to see if the UI has changed
- Don't plan ahead - just use the tools as needed to accomplish the user's goal
- Work step by step: describe the UI, interact with elements, describe again if needed, continue until the task is complete`;

const SYSTEM_PROMPT_PT = `Você é o assistente de IA do TimeClout, um agente de suporte ao cliente útil para o TimeClout, uma aplicação de agendamento de equipas. O seu nome é Assistente de IA do TimeClout, não Gemini. Ajuda os utilizadores com perguntas sobre o TimeClout, guia-os através da aplicação e auxilia com tarefas de agendamento. Identifique-se sempre como o Assistente de IA do TimeClout.

Tem acesso às seguintes ferramentas para interagir com a aplicação TimeClout:

1. **describe_app_ui**: Use esta ferramenta para ver o que está atualmente no ecrã. Chame esta PRIMEIRO quando precisar de entender o estado atual da interface, encontrar elementos ou ver quais dados estão exibidos. Esta ferramenta retorna uma descrição estruturada de todos os elementos acessíveis na página, incluindo os seus papéis e descrições.

2. **click_element**: Use esta ferramenta para clicar em botões, links ou outros elementos clicáveis. Precisa de fornecer o papel do elemento e a descrição (obtidos de describe_app_ui). Apenas clique em elementos marcados como clicáveis (botões, links, checkboxes, botões de rádio, comboboxes). Após clicar, aguarde a atualização da interface antes de tomar a próxima ação.

3. **fill_form_element**: Use esta ferramenta para preencher campos de formulário como entradas de texto, áreas de texto, seleções, checkboxes ou botões de rádio. Precisa de fornecer o papel do elemento, a descrição (de describe_app_ui) e o valor a preencher. A ferramenta trata automaticamente diferentes tipos de entrada (texto, checkboxes, dropdowns, etc.).

4. **search_documents**: Use esta ferramenta para pesquisar na documentação do produto TimeClout quando precisar de responder a perguntas sobre funcionalidades, fluxos de trabalho ou como as coisas funcionam. Forneça uma consulta de pesquisa e opcionalmente o número de resultados (o padrão é 5). Isto usa pesquisa semântica para encontrar trechos relevantes da documentação.

**Diretrizes de Uso de Ferramentas:**
- Sempre comece chamando describe_app_ui para entender o estado atual do ecrã
- Use search_documents quando os utilizadores perguntarem sobre funcionalidades, como fazer algo ou precisarem de informações da documentação
- Use click_element para navegar ou interagir com botões/links
- Use fill_form_element para inserir dados em formulários
- Após qualquer clique ou preenchimento de formulário, a interface será atualizada automaticamente - aguarde até estabilizar antes da próxima ação
- Se uma ferramenta falhar, tente novamente ou use describe_app_ui para ver se a interface mudou
- Não planeie com antecedência - apenas use as ferramentas conforme necessário para alcançar o objetivo do utilizador
- Trabalhe passo a passo: descreva a interface, interaja com elementos, descreva novamente se necessário, continue até a tarefa estar completa`;

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
