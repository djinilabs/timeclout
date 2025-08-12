import { Tigrmail } from "tigrmail";

interface TigrMailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  created_at: string;
}
export class TigrMailClient {
  private client: Tigrmail;

  constructor(token: string) {
    this.client = new Tigrmail({ token });
    console.log(`TigrMail initialized with token: ${token.substring(0, 8)}...`);
  }

  /**
   * Create a new email address for testing
   */
  async createEmailAddress(): Promise<string> {
    try {
      const emailAddress = await this.client.createEmailAddress();

      console.log(`Email address created: ${emailAddress}`);
      return emailAddress;
    } catch (error) {
      console.error("Error creating TigrMail inbox:", error);
      throw error;
    }
  }

  /**
   * Poll for the next message in the current inbox
   */
  async pollNextMessage(emailAddress: string): Promise<TigrMailMessage | null> {
    try {
      const message = await this.client.pollNextMessage({
        inbox: emailAddress,
      });

      if (!message) {
        return null;
      }

      // Type assertion for the message response
      const messageData = message as {
        id?: string;
        from?: { email?: string; domain?: string };
        subject?: string;
        text?: string;
        html?: string;
        created_at?: string;
      };

      return {
        id: messageData?.id || String(Date.now()),
        from:
          messageData?.from?.email || messageData?.from?.domain || "unknown",
        to: emailAddress,
        subject: messageData?.subject || "",
        text: messageData?.text || "",
        html: messageData?.html || "",
        created_at: messageData?.created_at || new Date().toISOString(),
      };
    } catch (error) {
      console.warn(`Error polling for message: ${error}`);
      return null;
    }
  }
}

// Create a singleton instance using token from environment variable
// You can set TIGRMAIL_TOKEN in your environment or .env file
const token =
  process.env.TIGRMAIL_TOKEN ||
  "x0lrzzaiiovjs04vtbpbhzpwjboysq4ks7c14oisnfv4h15coq8upd6itrqgblf6";
export const tigrMail = new TigrMailClient(token);
