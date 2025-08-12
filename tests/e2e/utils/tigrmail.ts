import { Tigrmail } from "tigrmail";

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
  async pollNextMessage(emailAddress: string) {
    try {
      const message = await this.client.pollNextMessage({
        inbox: emailAddress,
      });

      if (!message) {
        throw new Error("No message found");
      }

      return message;
    } catch (error) {
      console.warn(`Error polling for message: ${error}`);
      throw error;
    }
  }
}

const token = process.env.TIGRMAIL_TOKEN;
if (!token) {
  throw new Error("TIGRMAIL_TOKEN is not set");
}

export const tigrMail = new TigrMailClient(token);
