import { useLingui } from "@lingui/react";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { UAParser } from "ua-parser-js";

import { DownloadAILanguageModel } from "../atoms/DownloadAILanguageModel";

import { AIMessage } from "./types";
import { useAIChatHistory } from "./useAIChatHistory";
import { useAITools } from "./useAITools";
import { useTestToolExecutionFromConsole } from "./useTestToolExecutionFromConsole";

export interface AIAgentChatResult {
  messages: AIMessage[];
  handleUserMessageSubmit: (message: string) => Promise<void>;
  clearMessages: () => Promise<void>;
}

const GENERATE_TIMEOUT_MS = 1000 * 60 * 5; // 5 minutes
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "";

export const useAIAgentChat = (): AIAgentChatResult => {
  const {
    messages: loadedMessages,
    saveNewMessage,
    clearMessages,
    loading,
  } = useAIChatHistory();

  const usedLanguageRef = useRef<string | undefined>(undefined);

  const { i18n } = useLingui();
  const initialSystemPrompt = useMemo(
    () =>
      i18n.t(`You are a helpful assistant that lives inside the TimeHaupt product (an application to help with team scheduling shifts).
  You can interact with the TimeHaupt product like if you were a user of the application. You can look at the UI using the describe_app_ui tool.
  You can click and on elements or open them using the click_element tool and then looking again to the UI to see the changes.
  You can fill text fields using the fill_form_element tool.
  You should use the tools provided to you to answer questions and help with tasks.
  Don't plan, just act.
  If the user asks you to do something, you should try to use the provided tools.
  After you have received a tool-result, reply to the user in __plain english__ with your findings.
  If a tool result is an error, you should try to use the tools again.
  If the tool does not get you the data you need, try navigating to another page.
  If that does not work, just say you don't have enough data.
  `),
    [i18n]
  );

  const GREETING_MESSAGE = useMemo(
    () =>
      i18n.t(
        "Hello, I'm your TimeHaupt AI assistant. How can I help you today?"
      ),
    [i18n]
  );

  const messages: AIMessage[] = useMemo(() => {
    usedLanguageRef.current = i18n.locale;
    return loading
      ? [...loadedMessages]
      : loadedMessages.length === 0
      ? [
          {
            id: nanoid(),
            timestamp: new Date(),
            message: {
              role: "assistant",
              content: GREETING_MESSAGE,
            },
            content: GREETING_MESSAGE,
          },
          ...loadedMessages,
        ]
      : loadedMessages;
  }, [GREETING_MESSAGE, i18n.locale, loadedMessages, loading]);

  useEffect(() => {
    if (usedLanguageRef.current !== i18n.locale) {
      if (loadedMessages.length > 0) {
        const greetingMessage = loadedMessages[0];
        if (greetingMessage.message.content !== GREETING_MESSAGE) {
          greetingMessage.message.content = GREETING_MESSAGE;
          greetingMessage.content = GREETING_MESSAGE;
        }
      }
      usedLanguageRef.current = i18n.locale;
    }
  }, [loadedMessages, i18n.locale, GREETING_MESSAGE]);

  const tools = useAITools();

  const handleError = useCallback(
    async (error: Error, messageId = nanoid()) => {
      const errorMessage = error.message;
      console.log("handleError", error);
      const errorMessageLowerCased = errorMessage.toLowerCase();
      if (
        errorMessageLowerCased.includes("browser no support") ||
        errorMessageLowerCased.includes("languagemodel is not available")
      ) {
        const { browser } = UAParser(navigator.userAgent);
        // The browser does not support AI
        // Let's first check if the browser is Chrome version 127 or greater
        if (browser.name === "Chrome") {
          if ((browser.major ?? "0") >= "127") {
            // The browser is Chrome version 127 or greater

            // Is the LanguageModel object available?
            if (!("LanguageModel" in window)) {
              // Let's show a message to the user
              await saveNewMessage({
                id: messageId,
                message: {
                  role: "assistant",
                  content: "Thinking...",
                },
                content: (
                  <div>
                    <p>
                      Your browser currently does not support AI, but you can
                      start using it if you follow these instructions:
                    </p>
                    <ol className="list-decimal space-y-2 mt-2 text-sm">
                      <li>
                        Go to this URL{" "}
                        <code>chrome://flags/#prompt-api-for-gemini-nano</code>{" "}
                        <br />
                        and enable the &quot;Prompt API for Gemini Nano&quot;
                        flag.
                      </li>
                      <li>
                        Go to this URL{" "}
                        <code>
                          chrome://flags/#optimization-guide-on-device-model
                        </code>{" "}
                        <br />
                        and enable the &quot;Optimization Guide On-Device
                        Model&quot; flag
                        <br />
                        and set it to &quot;Enabled BypassPrefRequirement&quot;.
                      </li>
                      <li>Restart your browser</li>
                    </ol>
                  </div>
                ),
                isWarning: true,
                timestamp: new Date(),
              });
              return;
            } else {
              await saveNewMessage({
                id: messageId,
                message: {
                  role: "assistant",
                  content: "Thinking...",
                },
                content: (
                  <p>
                    Even though your browser is Chrome, it currently does not
                    support AI, but you can start using it if you upgrade to
                    Chrome 127 or greater.
                  </p>
                ),
                isWarning: true,
                timestamp: new Date(),
              });
              console.log("LanguageModel object is available");
              // The LanguageModel object is available
              const languageModel = window.LanguageModel as
                | LanguageModel
                | undefined;
              if (languageModel) {
                // Let's query its availability
                const availability = await languageModel.availability();
                console.log("availability", availability);
                if (
                  availability === "downloadable" ||
                  availability === "downloading"
                ) {
                  await saveNewMessage({
                    id: messageId,
                    message: {
                      role: "assistant",
                      content: "Thinking...",
                    },
                    content: (
                      <div>
                        <p>
                          {availability === "downloadable"
                            ? "Your browser currently does not support AI, but you can start using it if you download it:"
                            : availability === "downloading"
                            ? "Downloading the model..."
                            : null}
                        </p>
                        <DownloadAILanguageModel />
                      </div>
                    ),
                    isWarning: true,
                    timestamp: new Date(),
                  });
                  return;
                }
              }
            }
          }
        } else {
          await saveNewMessage({
            id: messageId,
            message: {
              role: "assistant",
              content: "Thinking...",
            },
            content: (
              <div>
                <p>
                  Your browser is not Chrome, so it currently does not support
                  AI.
                </p>
                <ol className="space-y-2 mt-2 text-sm">
                  <li>
                    To install Chrome you can download it from{" "}
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://www.google.com/chrome/"
                    >
                      https://www.google.com/chrome/
                    </a>
                  </li>
                </ol>
              </div>
            ),
            isWarning: true,
            timestamp: new Date(),
          });
          return;
        }
      }

      await saveNewMessage({
        id: messageId,
        message: {
          role: "assistant",
          content: "Error: " + error.message,
        },
        content: "Error: " + error.message,
        isError: true,
        timestamp: new Date(),
      });
    },
    [saveNewMessage]
  );

  useTestToolExecutionFromConsole(tools);

  const callBackendAI = useCallback(
    async (allMessages: AIMessage[], messageId: string) => {
      try {
        const response = await fetch(`${BACKEND_API_URL}/api/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: allMessages.map((msg) => ({
              role: msg.message.role,
              content:
                typeof msg.content === "string"
                  ? msg.content
                  : msg.message.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message || data;
      } catch (error) {
        handleError(error as Error, messageId);
        return null;
      }
    },
    [handleError]
  );

  const handleUserMessageSubmit = useCallback(
    async (message: string) => {
      const userMessage: AIMessage = {
        id: nanoid(),
        content: message,
        timestamp: new Date(),
        message: {
          role: "user",
          content: message,
        },
      };

      await saveNewMessage(userMessage);

      const allMessages: AIMessage[] = [
        {
          id: nanoid(),
          timestamp: new Date(),
          content: <></>,
          message: {
            role: "system",
            content: initialSystemPrompt,
          },
        },
        ...messages,
        userMessage,
      ];

      const messageId = nanoid();

      await saveNewMessage({
        id: messageId,
        timestamp: new Date(),
        content: "Thinking...",
        isLoading: true,
        message: {
          role: "assistant",
          content: "Thinking...",
        },
      });

      const abortController = new AbortController();

      const timeout = setTimeout(() => {
        abortController.abort("Timeout");
      }, GENERATE_TIMEOUT_MS);

      let allTheText = "";

      try {
        const response = await callBackendAI(allMessages, messageId);
        if (!response) {
          clearTimeout(timeout);
          return;
        }

        allTheText = response;

        // Show typing effect by updating in chunks
        const words = allTheText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const partialText = words.slice(0, i + 1).join(" ");
          await saveNewMessage({
            id: messageId,
            timestamp: new Date(),
            content: partialText,
            isLoading: true,
            message: {
              role: "assistant",
              content: partialText,
            },
          });
          // Add small delay for typing effect
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        clearTimeout(timeout);

        // Save final message
        await saveNewMessage({
          id: messageId,
          timestamp: new Date(),
          content: allTheText,
          isLoading: false,
          message: {
            role: "assistant",
            content: allTheText,
          },
        });
      } catch (error) {
        await handleError(error as Error, messageId);
        clearTimeout(timeout);
        return;
      }
    },
    [saveNewMessage, initialSystemPrompt, messages, callBackendAI, handleError]
  );

  return { messages, handleUserMessageSubmit, clearMessages };
};
