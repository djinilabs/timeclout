import { Page, expect } from "@playwright/test";
import { TestmailClient } from "./testmail";
import { getDefined } from "@/utils";

export interface TestUser {
  email: string;
  professionalName: string;
  magicLink?: string;
  testmail: TestmailClient;
}

export interface LoginOptions {
  waitForEmailTimeout?: number;
  professionalName?: string;
}

export class UserManagement {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Creates a new test user with a unique email address
   */
  async createTestUser(
    professionalName: string = "Test User"
  ): Promise<TestUser> {
    const testmail = new TestmailClient(
      getDefined(process.env.TESTMAIL_NAMESPACE, "TESTMAIL_NAMESPACE")
    );
    console.log(`Created Testmail inbox: ${testmail.emailAddress}`);

    return {
      email: testmail.emailAddress,
      professionalName,
      testmail,
    };
  }

  /**
   * Initiates the magic link login process by submitting the email
   */
  async initiateMagicLinkLogin(email: string): Promise<void> {
    // Navigate to login page
    await this.page.goto("/");

    // Click the email link button
    const emailLinkButton = this.page.locator('button:has-text("Email Link")');
    await emailLinkButton.click();

    // Fill in the email
    const emailInput = this.page.locator('input[type="email"]');
    await emailInput.fill(email);

    // Submit the form
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for form submission to process
    await this.page.waitForTimeout(2000);

    console.log(`Magic link login initiated for: ${email}`);
  }

  /**
   * Waits for and extracts the magic link from the email
   */
  async waitForMagicLink(
    user: TestUser,
    timeout: number = 120000
  ): Promise<string> {
    console.log(`Fetching magic link email from Testmail for: ${user.email}`);

    const magicLinkEmail = await user.testmail.waitForMessage(timeout);
    if (!magicLinkEmail) {
      throw new Error(`No magic link email received for ${user.email}`);
    }

    const magicLink = this.extractMagicLinkFromEmail(
      getDefined(magicLinkEmail.text)
    );
    user.magicLink = magicLink;

    console.log(`✅ Magic link extracted: ${magicLink}`);
    return magicLink;
  }

  /**
   * Completes the magic link authentication process
   */
  async completeMagicLinkAuth(user: TestUser): Promise<void> {
    if (!user.magicLink) {
      throw new Error("No magic link available. Call waitForMagicLink first.");
    }

    console.log("Navigating to magic link...");
    await this.page.goto(user.magicLink);
    await this.page.waitForLoadState("networkidle");

    // Handle terms and conditions if they appear
    await this.handleTermsAndConditions();

    // Handle professional name form if it appears
    await this.handleProfessionalNameForm(user.professionalName);

    console.log(`✅ Magic link authentication completed for: ${user.email}`);
  }

  /**
   * Handles the terms and conditions acceptance page if it appears
   */
  private async handleTermsAndConditions(): Promise<void> {
    console.log("Checking if terms and conditions page is displayed...");

    const termsButton = this.page.locator('button:has-text("I Agree")');
    if (await termsButton.isVisible()) {
      console.log("✅ Found terms acceptance button");
      await termsButton.click();
      console.log("✅ Clicked terms acceptance button");

      // Wait for the page to process the acceptance
      await this.page.waitForLoadState("networkidle");
      await this.page.waitForTimeout(2000);
    } else {
      console.log("ℹ️ No terms and conditions page found");
    }
  }

  /**
   * Handles the professional name form if it appears
   */
  private async handleProfessionalNameForm(
    professionalName: string
  ): Promise<void> {
    console.log("Checking if professional name form is displayed...");

    const nameInput = this.page.locator(".name-input");
    if (await nameInput.isVisible()) {
      console.log("✅ Found professional name input");

      // Fill in the professional name
      await nameInput.fill(professionalName);
      console.log(`✅ Filled in professional name: ${professionalName}`);

      // Look for and click the save button
      const saveButton = this.page.locator('button:has-text("Save")');
      if (await saveButton.isVisible()) {
        console.log("✅ Found save button");
        await saveButton.click();
        console.log("✅ Clicked save button");

        // Wait for the form submission to process
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(2000);
      }
    } else {
      console.log("ℹ️ No professional name form found");
    }
  }

  /**
   * Verifies that the user is successfully authenticated
   */
  async verifyUserAuthenticated(user: TestUser): Promise<void> {
    console.log("Verifying user authentication...");

    // Look for the user menu button
    const userMenuButton = this.page.locator(
      'button[aria-label="Open user menu"]'
    );
    await expect(userMenuButton).toBeVisible();

    console.log("✅ User successfully authenticated - user menu button found");

    // Click the user menu to verify the user name
    await userMenuButton.click();

    // Look for the user name span
    const userNameSpan = this.page.locator(
      `span[aria-hidden="true"]:has-text("${user.professionalName}")`
    );

    await expect(userNameSpan).toBeVisible();
  }

  /**
   * Complete magic link login workflow for a new user
   */
  async completeMagicLinkLoginWorkflow(
    user: TestUser,
    options: LoginOptions = {}
  ): Promise<void> {
    const { waitForEmailTimeout = 120000 } = options;

    try {
      // Step 1: Initiate magic link login
      await this.initiateMagicLinkLogin(user.email);

      // Step 2: Wait for and extract magic link
      await this.waitForMagicLink(user, waitForEmailTimeout);

      // Step 3: Complete authentication
      await this.completeMagicLinkAuth(user);

      // Step 4: Verify authentication
      await this.verifyUserAuthenticated(user);

      console.log(
        `🎉 Magic link login workflow completed successfully for: ${user.email}`
      );
    } catch (error) {
      console.error(
        `❌ Magic link login workflow failed for ${user.email}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Creates and logs in a new user in one operation
   */
  async createAndLoginUser(
    professionalName: string = "Test User",
    options: LoginOptions = {}
  ): Promise<TestUser> {
    // Create the test user
    const user = await this.createTestUser(professionalName);

    // Complete the full login workflow
    await this.completeMagicLinkLoginWorkflow(user, options);

    return user;
  }

  /**
   * Cleans up the test user's Testmail inbox
   */
  async cleanupUser(user: TestUser): Promise<void> {
    console.log(`Cleaning up Testmail inbox for: ${user.email}`);
    await user.testmail.cleanup();
  }

  /**
   * Helper function to extract magic link from email content
   */
  private extractMagicLinkFromEmail(emailBody: string): string {
    // Try to find a link in the email content
    const linkRegex = /https?:\/\/[^\s<>"']+/g;

    // First try HTML content, then fall back to text
    const links = getDefined(emailBody).match(linkRegex);

    if (links && links.length > 0) {
      // Return the first link that looks like a magic link
      // Filter out any obvious non-magic links
      const magicLink = links.find(
        (link: string) =>
          !link.includes("unsubscribe") &&
          !link.includes("preferences") &&
          !link.includes("footer")
      );

      if (magicLink) {
        return magicLink;
      }

      // If no obvious magic link found, return the first link
      return links[0];
    }

    throw new Error("No magic link found in email");
  }
}

/**
 * Factory function to create a UserManagement instance
 */
export function createUserManagement(page: Page): UserManagement {
  return new UserManagement(page);
}
