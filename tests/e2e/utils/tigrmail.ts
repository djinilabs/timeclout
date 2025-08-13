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
   * Poll for the next message in the current inbox with retry logic
   */
  async pollNextMessage(
    emailAddress: string,
    maxRetries: number = 3
  ): Promise<unknown> {
    console.log(`Polling for messages in inbox: ${emailAddress}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to poll for messages...`);

        const message = await this.client.pollNextMessage({
          inbox: emailAddress,
        });

        if (message) {
          console.log(`✅ Message received on attempt ${attempt}:`, {
            to: (message as any).to,
            from: (message as any).from,
            subject: (message as any).subject,
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
  async waitForMessage(
    emailAddress: string,
    timeoutMs: number = 60000
  ): Promise<unknown> {
    console.log(
      `Waiting for message in ${emailAddress} with ${timeoutMs}ms timeout...`
    );

    const startTime = Date.now();
    const pollInterval = 5000; // Poll every 5 seconds

    while (Date.now() - startTime < timeoutMs) {
      try {
        const message = await this.client.pollNextMessage({
          inbox: emailAddress,
        });

        if (message) {
          console.log(
            `✅ Message received after ${Date.now() - startTime}ms:`,
            {
              to: (message as any).to,
              from: (message as any).from,
              subject: (message as any).subject,
            }
          );
          return message;
        }

        console.log(`No message yet, waiting ${pollInterval}ms...`);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.warn(`Error while polling:`, error.message);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error(`Timeout waiting for message after ${timeoutMs}ms`);
  }
}

const token =
  process.env.TIGRMAIL_TOKEN ||
  "x0lrzzaiiovjs04vtbpbhzpwjboysq4ks7c14oisnfv4h15coq8upd6itrqgblf6";

export const tigrMail = new TigrMailClient(token);
