import {
  FC,
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  PaperAirplaneIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useAIAgentChat } from "./useAIAgentChat";
import debounce from "lodash.debounce";
import { AIChatMessagePanel } from "./AIChatMessagePanel";
import { Hint } from "../particles/Hint";

export interface AIChatPanelProps {
  onClose: () => unknown;
}

export const AIChatPanel: FC<AIChatPanelProps> = ({ onClose }) => {
  const { messages, handleUserMessageSubmit, clearMessages } = useAIAgentChat();

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = useMemo(
    () => messages.some((message) => message.isLoading),
    [messages]
  );

  const adjustTextareaHeight = useMemo(() => {
    return debounce(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 100);
  }, []);

  const focusOnTextarea = useMemo(() => {
    return debounce(() => {
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }, 100);
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  useEffect(() => {
    if (!isLoading) {
      focusOnTextarea();
    }
  }, [focusOnTextarea, isLoading]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const message = inputValue.trim();
      if (!message) return;
      setInputValue("");
      handleUserMessageSubmit(message);
      focusOnTextarea();
    },
    [inputValue, handleUserMessageSubmit, focusOnTextarea]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    },
    [handleSubmit, onClose]
  );

  return (
    <div className="flex h-full flex-col bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <div className="flex items-center gap-2">
          <Hint hint="Delete chat history">
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => clearMessages()}
            >
              <span className="sr-only">Clear chat history</span>
              <TrashIcon className="size-6" aria-hidden="true" />
            </button>
          </Hint>
          <Hint hint="Close panel">
            <button
              type="button"
              onClick={() => onClose()}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span className="sr-only">Close panel</span>
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </Hint>
        </div>
      </div>
      <div className="flex h-full flex-col bg-white">
        {/* Messages container */}
        <AIChatMessagePanel messages={messages} />

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
              className="prose prose-sm flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
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
    </div>
  );
};
