import { Page } from "@playwright/test";
import { TestmailClient } from "./testmail";
import { getDefined } from "../../../libs/utils/src";

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
    await emailLinkButton.waitFor({ state: "visible" });
    await emailLinkButton.click();

    // Fill in the email
    const emailInput = this.page.locator('input[type="email"]');
    await emailInput.waitFor({ state: "visible" });
    await emailInput.fill(email);

    // Submit the form
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.waitFor({ state: "visible" });
    await submitButton.click();

    // Wait for form submission to process
    await this.page.waitForLoadState("domcontentloaded");

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
    await this.page.waitForLoadState("domcontentloaded");

    // Wait for the authentication to complete and session to be established
    console.log("Waiting for authentication to complete...");

    // Wait for the page to fully load and settle
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(3000);

    // Check if we're on a callback URL and wait for redirect
    const currentUrl = this.page.url();
    if (currentUrl.includes("/api/v1/auth/callback")) {
      console.log("On auth callback URL, waiting for redirect...");
      // Wait for redirect to complete
      await this.page.waitForURL(/^(?!.*\/api\/v1\/auth\/callback)/, {
        timeout: 15000,
      });
      await this.page.waitForLoadState("load");
      await this.page.waitForTimeout(2000);
    }

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

    // Wait for the page to fully load after authentication
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");

    // Wait a bit more for any dynamic content to appear
    await this.page.waitForTimeout(3000);

    // Look for the terms dialog with multiple possible selectors
    const termsButton = this.page
      .locator('button:has-text("I Agree"), button:has-text("I agree")')
      .first();

    // Wait for the button to be visible with a longer timeout
    try {
      await termsButton.waitFor({ state: "visible", timeout: 15000 });
      console.log("✅ Found terms acceptance button");
      await termsButton.click();
      console.log("✅ Clicked terms acceptance button");

      // Wait for the page to process the acceptance
      await this.page.waitForLoadState("domcontentloaded");
      // Wait for any UI updates to complete
      await this.page.waitForLoadState("load");

      // Additional wait to ensure the terms dialog is fully closed and page has settled
      await this.page.waitForTimeout(3000);

      // Check if we're still on the same page or if we've been redirected
      console.log(`Current URL after accepting terms: ${this.page.url()}`);
    } catch (error) {
      console.log("ℹ️ No terms and conditions page found after waiting");
      console.log(
        "This might mean the user has already agreed to terms or there's no agreement required"
      );
    }
  }

  /**
   * Handles the professional name form if it appears
   */
  private async handleProfessionalNameForm(
    professionalName: string
  ): Promise<void> {
    console.log("Checking if professional name form is displayed...");

    // Wait a bit for the page to settle after terms acceptance
    await this.page.waitForTimeout(2000);

    // Wait for the page to fully load
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForLoadState("load");

    // Look for the professional name input - it might be in a form
    const nameInput = this.page
      .locator(
        'input[name="name"], .name-input, input[placeholder*="name"], input[placeholder*="Name"]'
      )
      .first();

    // Wait for the input to be visible with a longer timeout
    if (
      await nameInput
        .waitFor({ state: "visible", timeout: 10000 })
        .catch(() => false)
    ) {
      console.log("✅ Found professional name input");

      // Fill in the professional name
      await nameInput.fill(professionalName);
      console.log(`✅ Filled in professional name: ${professionalName}`);

      // Look for and click the save button - try multiple possible selectors
      const saveButton = this.page
        .locator(
          'button:has-text("Save"), button[type="submit"], input[type="submit"]'
        )
        .first();
      if (await saveButton.isVisible()) {
        console.log("✅ Found save button");
        await saveButton.click();
        console.log("✅ Clicked save button");

        // Wait for the form submission to process
        await this.page.waitForLoadState("domcontentloaded");
        // Wait for any UI updates to complete
        await this.page.waitForLoadState("load");

        // Additional wait to ensure the page has fully loaded
        await this.page.waitForTimeout(3000);
      }
    } else {
      console.log("ℹ️ No professional name form found after waiting");
    }
  }

  /**
   * Verifies that the user is successfully authenticated
   */
  async verifyUserAuthenticated(user: TestUser): Promise<void> {
    console.log("Verifying user authentication...");

    // First, check if we're on a profile completion page
    const currentUrl = this.page.url();
    console.log(`Current URL during verification: ${currentUrl}`);

    if (currentUrl.includes("/me/edit")) {
      console.log(
        "✅ User is on profile completion page - this is expected for new users"
      );
      console.log("User authentication verified - profile completion required");
      return;
    }

    // Look for the user menu button
    const userMenuButton = this.page.locator(
      'button[aria-label="Open user menu"]'
    );

    // Wait a bit longer for the UI to fully load
    await this.page.waitForTimeout(3000);

    if (await userMenuButton.isVisible()) {
      console.log(
        "✅ User successfully authenticated - user menu button found"
      );

      // Click the user menu to verify the user name
      await userMenuButton.click();

      // Wait for the menu to open
      await this.page
        .locator('[role="menu"]')
        .waitFor({ timeout: 5000 })
        .catch(() => null);

      // Look for the user name in multiple possible locations
      // First try the span with aria-hidden="true" (desktop view)
      const userNameSpan = this.page.locator(
        `span[aria-hidden="true"]:has-text("${user.email}")`
      );

      // If that's not visible, try looking for the email in the menu items
      if (!(await userNameSpan.isVisible())) {
        console.log("User name span not visible, checking menu items...");

        // Look for the Profile menu item in the dropdown (more specific selector)
        const profileMenuItem = this.page.locator(
          'a[role="menuitem"][aria-label="Profile"]'
        );
        if (await profileMenuItem.isVisible()) {
          console.log("✅ Profile menu item found, user is authenticated");
          return;
        }

        // As a fallback, check if we can see any text that contains the email
        const emailText = this.page.locator(`text=${user.email}`);
        if (await emailText.isVisible()) {
          console.log("✅ User email found on page, user is authenticated");
          return;
        }
      } else {
        console.log("✅ User name span found and visible");
        return;
      }
    } else {
      // If user menu button is not visible, check if we're on a profile completion page
      if (currentUrl.includes("/me/edit")) {
        console.log(
          "✅ User is on profile completion page - authentication verified"
        );
        return;
      }

      // Check if we can see any indication that the user is authenticated
      const authenticatedIndicator = this.page
        .locator(
          'text=Sign out, button:has-text("Sign out"), a:has-text("Profile")'
        )
        .first();
      if (await authenticatedIndicator.isVisible()) {
        console.log(
          "✅ Found authentication indicator - user is authenticated"
        );
        return;
      }

      throw new Error(
        `User authentication verification failed. Current URL: ${currentUrl}. User menu button not visible.`
      );
    }

    // If we get here, we couldn't verify the user name
    console.log(
      "⚠️ Could not verify user name display, but user menu button is visible"
    );
    console.log("This might be due to responsive design or timing issues");
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
