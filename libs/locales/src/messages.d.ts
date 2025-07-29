declare module "./messages/en/messages.mjs" {
  interface Messages {
    [key: string]: string | (string | unknown[])[];
  }

  export const messages: Messages;
}

declare module "./messages/pt/messages.mjs" {
  interface Messages {
    [key: string]: string | (string | unknown[])[];
  }

  export const messages: Messages;
}
