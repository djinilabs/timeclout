import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { toast } from "react-hot-toast";
import { type AIMessage, isAiMessageValid } from "./types";

const DB_NAME = "tt3-ai-chat";
const STORE_NAME = "messages";
const DB_VERSION = 1;
const DEBOUNCE_TIME = 500;

export const useAIChatHistory = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  const dbPromise: Promise<IDBDatabase> = useMemo(() => {
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

  const upsertMessageInDb = useMemo(
    () =>
      async (message: AIMessage): Promise<void> => {
        console.log("saving new message:", message);

        const db = await dbPromise;
        const transaction = db.transaction([STORE_NAME], "readwrite");
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
    [dbPromise]
  );

  const changedMessages = useRef<Array<AIMessage>>([]);

  const saveChangedMessages = useCallback(async (): Promise<void> => {
    for (const message of changedMessages.current) {
      try {
        await upsertMessageInDb(message);
      } catch (error) {
        console.error("Error saving message", error);
        toast.error("Error saving message");
      } finally {
        changedMessages.current = changedMessages.current.filter(
          (m) => m.id !== message.id
        );
      }
    }
  }, [upsertMessageInDb]);

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
      if (existingMessageIndex !== -1) {
        changedMessages.current[existingMessageIndex] = message;
      } else {
        changedMessages.current.push(message);
      }
      saveChangedMessagesDebounced();
    },
    [saveChangedMessagesDebounced]
  );

  const saveNewMessage = (message: AIMessage): void => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === message.id);
      if (exists) {
        return prev.map((m) => (m.id === message.id ? message : m));
      } else {
        return [...prev, message];
      }
    });

    upsertMessage(message);
  };

  const loadMessages = useCallback(async (): Promise<void> => {
    const db = await dbPromise;
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const messages = request.result
          .filter(isAiMessageValid)
          .map((msg: AIMessage) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            isLoading: false,
            isWarning: msg.isWarning || msg.isLoading,
            content: msg.isLoading ? "Interrupted" : msg.content,
          }))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        console.log("loaded messages:", messages);
        setMessages(messages);
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }, [dbPromise]);

  const clearMessages = useCallback(async (): Promise<void> => {
    const db = await dbPromise;
    setMessages([]);
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [dbPromise]);

  useEffect(() => {
    loadMessages().catch((error) => {
      console.error("Error loading messages", error);
      toast.error("Error loading messages");
    });
  }, [loadMessages]);

  return {
    messages,
    saveNewMessage,
    clearMessages,
  };
};
