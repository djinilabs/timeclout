import { FC, useState, KeyboardEvent, useRef, useEffect, useMemo } from "react";
import {
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { useAIAgentChat } from "../../hooks/useAIAgentChat";
import { classNames } from "../../utils/classNames";
import { FaSpinner } from "react-icons/fa";

export const AIChatPanel: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const { messages, handleUserMessageSubmit } = useAIAgentChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message) return;
    setInputValue("");
    handleUserMessageSubmit(message);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      } else {
        alert("textareaRef.current is null");
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isLoading = useMemo(
    () => messages.some((message) => message.isLoading),
    [messages]
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Messages container */}
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
              <span className="flex items-start gap-2">
                {message.isLoading ? (
                  <span className="flex items-start">
                    <FaSpinner className="animate-spin" />
                  </span>
                ) : null}
                {message.isError || message.isWarning ? (
                  <span className="mt-1">
                    <ExclamationTriangleIcon className="size-5" />
                  </span>
                ) : null}
                <span className="flex items-start whitespace-pre-wrap">
                  {message.content}
                </span>
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 focus:ring-teal-600"
            }`}
          >
            <PaperAirplaneIcon className="size-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
