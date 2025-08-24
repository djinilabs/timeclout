import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FC, memo, useCallback, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import Markdown from "react-markdown";
import TimeAgo from "react-time-ago";

import { classNames } from "../../utils/classNames";
import { Hint } from "../particles/Hint";

import { type AIMessage } from "./types";

export const AIChatMessagePanel: FC<{ messages: AIMessage[] }> = memo(
  ({ messages }) => {
    const messagesEndReference = useRef<HTMLDivElement>(null);
    const scrollToBottom = useCallback(() => {
      messagesEndReference.current?.scrollIntoView({ behavior: "smooth" });
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
              message.message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col">
              <div
                className={classNames(
                  "text-xs mb-1 w-fit text-gray-500",
                  message.message.role === "user"
                    ? "text-right ml-auto"
                    : "text-left mr-auto"
                )}
              >
                <Hint hint={message.timestamp.toLocaleString()}>
                  <TimeAgo date={message.timestamp} />
                </Hint>
              </div>
              <div
                className={classNames(
                  "max-w-[90%] rounded-lg px-4 py-2",
                  !message.isError &&
                    !message.isWarning &&
                    "bg-gray-100 text-gray-900",
                  message.message.role === "user" &&
                    "bg-teal-600 text-white ml-auto",
                  message.message.role !== "user" && "mr-auto",
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
                  {message.message.role === "tool" ? (
                    <span className="inline-block bg-black text-white rounded px-2 py-1 text-xs font-semibold">
                      tool&nbsp;call
                    </span>
                  ) : (typeof message.content === "string" ? (
                    <div
                      className={classNames(
                        "prose prose-sm",
                        (message.message.role === "user" ||
                          message.isError ||
                          message.isWarning) &&
                          "text-white"
                      )}
                    >
                      <Markdown>{message.content}</Markdown>
                    </div>
                  ) : (
                    <span className="flex items-start whitespace-pre-wrap text-sm">
                      {message.content}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndReference} />
      </div>
    );
  }
);

AIChatMessagePanel.displayName = "AIChatMessagePanel";
