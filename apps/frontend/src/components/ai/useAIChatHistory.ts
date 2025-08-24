import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { type AIMessage, isAiMessageValid } from "./types";

const DB_NAME = "tt3-ai-chat";
const STORE_NAME = "messages";
const DB_VERSION = 1;
const DEBOUNCE_TIME = 500;

export const useAIChatHistory = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const databasePromise: Promise<IDBDatabase> = useMemo(() => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event);
        reject(new Error("Error opening IndexedDB"));
      };

      request.onsuccess = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        resolve(database);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    });
  }, []);

  const upsertMessageInDatabase = useMemo(
    () =>
      async (message: AIMessage): Promise<void> => {
        const database = await databasePromise;
        const transaction = database.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(message.id);

        return new Promise<void>((resolve, reject) => {
          // get message from db

          request.onsuccess = () => {
            const existingMessage = request.result;
            if (existingMessage) {
              // update the message
              const result = store.put(message);
              result.onsuccess = () => resolve();
              result.onerror = () => reject(result.error);
            } else {
              // add the message
              const result = store.add(message);
              result.onsuccess = () => resolve();
              result.onerror = () => reject(result.error);
            }
          };

          request.onerror = () => reject(request.error);
        });
      },
    [databasePromise]
  );

  const changedMessages = useRef<Array<AIMessage>>([]);

  const saveChangedMessages = useCallback(async (): Promise<void> => {
    for (const message of changedMessages.current) {
      try {
        await upsertMessageInDatabase(message);
      } catch (error) {
        console.error("Error saving message", error);
        toast.error("Error saving message");
      } finally {
        changedMessages.current = changedMessages.current.filter(
          (m) => m.id !== message.id
        );
      }
    }
  }, [upsertMessageInDatabase]);

  const saveChangedMessagesDebounced = useMemo(
    () => debounce(saveChangedMessages, DEBOUNCE_TIME),
    [saveChangedMessages]
  );

  const upsertMessage = useCallback(
    (message: AIMessage): void => {
      // add or update the message in the changedMessages list
      const existingMessageIndex = changedMessages.current.findIndex(
        (m) => m.id === message.id
      );
      if (existingMessageIndex === -1) {
        changedMessages.current.push(message);
      } else {
        changedMessages.current[existingMessageIndex] = message;
      }
      saveChangedMessagesDebounced();
    },
    [saveChangedMessagesDebounced]
  );

  const saveNewMessage = (message: AIMessage): void => {
    setMessages((previous) => {
      const exists = previous.some((m) => m.id === message.id);
      return exists ? previous.map((m) => (m.id === message.id ? message : m)) : [...previous, message];
    });

    upsertMessage(message);
  };

  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async (): Promise<void> => {
    const database = await databasePromise;
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const messages = request.result
          .filter(isAiMessageValid)
          .map((message: AIMessage) => ({
            ...message,
            timestamp: new Date(message.timestamp),
            isLoading: false,
            isWarning: message.isWarning || message.isLoading,
            content: message.isLoading ? "Interrupted" : message.content,
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        setMessages(messages);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }, [databasePromise]);

  const clearMessages = useCallback(async (): Promise<void> => {
    const database = await databasePromise;
    setMessages([]);
    return new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [databasePromise]);

  useEffect(() => {
    setLoading(true);
    // Store the promise to handle it properly
    (async () => {
      await loadMessages()
        .catch((error) => {
          console.error("Error loading messages", error);
          toast.error("Error loading messages");
        })
        .finally(() => {
          setLoading(false);
        });
    })();

    // Return cleanup function that can be used if needed
    return () => {
      // Cleanup if component unmounts
    };
  }, [loadMessages]);

  return {
    messages: [...messages],
    saveNewMessage,
    clearMessages,
    loading,
  };
};
