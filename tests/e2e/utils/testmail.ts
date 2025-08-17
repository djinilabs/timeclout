import { getDefined } from "@/utils";
import { customAlphabet } from "nanoid";

export interface MailMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
}

const generateUniqueTag = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  10
);

export class TestmailClient {
  private namespace: string;
  private tag: string;
  public emailAddress: string;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.tag = generateUniqueTag();
    this.emailAddress = `${this.namespace}.${this.tag}@inbox.testmail.app`;
    console.log(
      `Testmail initialized with namespace: ${namespace}, tag: ${this.tag}`
    );
  }

  /**
   * Wait for a message to arrive with a timeout
   */
  async waitForMessage(timeoutMs: number = 60000): Promise<MailMessage> {
    console.log(
      `Waiting for message in ${this.emailAddress} with ${timeoutMs}ms timeout...`
    );
    const apiKey = getDefined(process.env.TESTMAIL_API_KEY, "TESTMAIL_API_KEY");
    console.log(`Polling for messages in inbox: ${this.emailAddress}`);

    const startTime = Date.now();

    try {
      const url = new URL("https://api.testmail.app/api/json");
      url.searchParams.set("apikey", apiKey);
      url.searchParams.set("namespace", this.namespace);
      url.searchParams.set("tag", this.tag);
      url.searchParams.set("livequery", "true");

      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, ${
            response.statusText
          }, ${await response.text()}`
        );
      }

      const data = await response.json();

      if (data.emails && data.emails.length > 0) {
        const message = data.emails[0]; // Get the most recent message
        console.log(`✅ Message received after ${Date.now() - startTime}ms:`, {
          to: message.to,
          from: message.from,
          subject: message.subject,
          text: message.text,
        });
        return message;
      }
    } catch (error) {
      console.warn(`Error while polling:`, error);
    }

    throw new Error(`Timeout waiting for message after ${timeoutMs}ms`);
  }

  /**
   * Clean up the inbox after testing
   * Note: Testmail automatically cleans up emails after 24 hours
   */
  async cleanup(): Promise<void> {
    console.log(
      "Testmail cleanup: emails will be automatically cleaned up after 24 hours"
    );
  }
}
