import { MailSlurp } from "mailslurp-client";
import { mailslurp as mailslurpConfig } from "../config/env";

export class MailslurpClient {
  private client: MailSlurp;
  private inboxId: string | null = null;

  constructor(apiKey: string) {
    this.client = new MailSlurp({ apiKey });
    console.log(
      `Mailslurp initialized with API key: ${apiKey.substring(0, 8)}...`
    );
  }

  /**
   * Create a new email address for testing
   */
  async createEmailAddress(): Promise<string> {
    try {
      const inbox = await this.client.createInbox();
      this.inboxId = inbox.id;
      const emailAddress = inbox.emailAddress;

      console.log(`Email address created: ${emailAddress}`);
      return emailAddress;
    } catch (error) {
      console.error("Error creating Mailslurp inbox:", error);
      throw error;
    }
  }

  /**
   * Poll for the next message in the current inbox with retry logic
   */
  async pollNextMessage(
    emailAddress: string,
    maxRetries: number = 3
  ): Promise<unknown> {
    if (!this.inboxId) {
      throw new Error(
        "No inbox ID available. Call createEmailAddress() first."
      );
    }

    console.log(`Polling for messages in inbox: ${emailAddress}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to poll for messages...`);

        const messages = await this.client.getEmails(this.inboxId);

        if (messages && messages.length > 0) {
          const message = messages[0]; // Get the most recent message
          console.log(`✅ Message received on attempt ${attempt}:`, {
            to: message.to,
            from: message.from,
            subject: message.subject,
          });
          return message;
        } else {
          console.log(`ℹ️ No message found on attempt ${attempt}`);
        }
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error.message);

        if (attempt === maxRetries) {
          console.error(
            `All ${maxRetries} attempts failed. Last error:`,
            error
          );
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`Waiting ${waitTime}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw new Error("No message found after all retry attempts");
  }

  /**
   * Wait for a message to arrive with a timeout
   */
  async waitForMessage(emailAddress: string, timeoutMs: number = 60000) {
    if (!this.inboxId) {
      throw new Error(
        "No inbox ID available. Call createEmailAddress() first."
      );
    }

    console.log(
      `Waiting for message in ${emailAddress} with ${timeoutMs}ms timeout...`
    );

    const startTime = Date.now();
    const pollInterval = 5000; // Poll every 5 seconds

    while (Date.now() - startTime < timeoutMs) {
      try {
        const messages = await this.client.getEmails(this.inboxId);

        if (messages && messages.length > 0) {
          const message = messages[0]; // Get the most recent message
          console.log(
            `✅ Message received after ${Date.now() - startTime}ms:`,
            {
              to: message.to,
              from: message.from,
              subject: message.subject,
            }
          );
          return this.client.getEmail(message.id);
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.warn(`Error while polling:`, error.message);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error(`Timeout waiting for message after ${timeoutMs}ms`);
  }

  /**
   * Clean up the inbox after testing
   */
  async cleanup(): Promise<void> {
    if (this.inboxId) {
      try {
        await this.client.deleteInbox(this.inboxId);
        console.log(`Cleaned up inbox: ${this.inboxId}`);
        this.inboxId = null;
      } catch (error) {
        console.warn("Error cleaning up inbox:", error.message);
      }
    }
  }
}

const apiKey = mailslurpConfig.apiKey;

export const mailslurp = new MailslurpClient(apiKey);
