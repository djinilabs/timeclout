import { FaSpinner } from "react-icons/fa";
import { classNames } from "../../utils/classNames";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Markdown from "react-markdown";
import { FC, memo, useCallback, useEffect, useRef } from "react";
import { AIChatMessage } from "../../hooks/useAIAgentChat";

export const AIChatMessagePanel: FC<{ messages: AIChatMessage[] }> = memo(
  ({ messages }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [messages, scrollToBottom]);

    return (
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={classNames(
                "max-w-[80%] rounded-lg px-4 py-2",
                !message.isError &&
                  !message.isWarning &&
                  "bg-gray-100 text-gray-900",
                message.isUser && "bg-teal-600 text-white",
                message.isError && "bg-red-600 text-white",
                message.isWarning && "bg-yellow-600 text-white"
              )}
            >
              {message.isLoading ? (
                <span>
                  <FaSpinner className="animate-spin" />
                </span>
              ) : null}
              <span className="flex items-start gap-2">
                {message.isError || message.isWarning ? (
                  <span className="mt-1">
                    <ExclamationTriangleIcon className="size-5" />
                  </span>
                ) : null}
                {typeof message.content === "string" ? (
                  <div
                    className={classNames(
                      "prose prose-sm",
                      message.isUser && "text-white"
                    )}
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>
                ) : (
                  <span className="flex items-start whitespace-pre-wrap text-sm">
                    {message.content}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);
