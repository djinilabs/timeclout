import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base-page";

export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly emailSentMessage: Locator;
  readonly emailLinkButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators for magic link login
    this.emailInput = page.locator(
      '[data-testid="email-input"], input[type="email"], #email, input[name="email"]'
    );
    this.submitButton = page.locator(
      '[data-testid="submit-button"], button[type="submit"], .submit-button, button:has-text("Send Link"), button:has-text("Login")'
    );
    this.successMessage = page.locator(
      '[data-testid="success-message"], .success-message, .alert-success'
    );
    this.errorMessage = page.locator(
      '[data-testid="error-message"], .error-message, .alert-error'
    );
    this.loadingSpinner = page.locator(
      '[data-testid="loading-spinner"], .loading, .spinner'
    );
    this.emailSentMessage = page.locator(
      '[data-testid="email-sent"], .email-sent, .check-email-message'
    );
    this.emailLinkButton = page.locator(
      'button:has-text("Sign in with email link"), button:has-text("Email"), [aria-label="Sign in with email link"]'
    );
  }

  /**
   * Navigate to any URL (since any URL shows login when not logged in)
   */
  async goto(url: string = "/"): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Click the email link button to show the email form
   */
  async clickEmailLinkButton(): Promise<void> {
    await this.clickElement(this.emailLinkButton);
    // Wait for the email form to appear
    await this.waitForElement(this.emailInput);
  }

  /**
   * Fill in email address for magic link
   */
  async fillEmail(email: string): Promise<void> {
    await this.fillInput(this.emailInput, email);
  }

  /**
   * Submit the email form to request magic link
   */
  async submitEmail(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  /**
   * Complete the magic link request process
   */
  async requestMagicLink(email: string): Promise<void> {
    // First click the email link button to show the form
    await this.clickEmailLinkButton();
    // Then fill in the email and submit
    await this.fillEmail(email);
    await this.submitEmail();
  }

  /**
   * Wait for the magic link request to complete
   */
  async waitForMagicLinkRequest(): Promise<void> {
    // Wait for either success message or error message
    await Promise.race([
      this.successMessage.waitFor({ state: "visible", timeout: 10000 }),
      this.errorMessage.waitFor({ state: "visible", timeout: 10000 }),
      this.emailSentMessage.waitFor({ state: "visible", timeout: 10000 }),
    ]);
  }

  /**
   * Check if the magic link request was successful
   */
  async isMagicLinkRequestSuccessful(): Promise<boolean> {
    const successMsg = await this.getSuccessMessage();
    const emailSentMsg = await this.getEmailSentMessage();
    return successMsg.length > 0 || emailSentMsg.length > 0;
  }

  /**
   * Get the success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.isElementVisible(this.successMessage)) {
      return await this.getElementText(this.successMessage);
    }
    return "";
  }

  /**
   * Get the email sent message text
   */
  async getEmailSentMessage(): Promise<string> {
    if (await this.isElementVisible(this.emailSentMessage)) {
      return await this.getElementText(this.emailSentMessage);
    }
    return "";
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getElementText(this.errorMessage);
    }
    return "";
  }

  /**
   * Check if there's an error message
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Check if the form is in loading state
   */
  async isLoading(): Promise<boolean> {
    return await this.isElementVisible(this.loadingSpinner);
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete(): Promise<void> {
    if (await this.isLoading()) {
      await this.loadingSpinner.waitFor({ state: "hidden" });
    }
  }

  /**
   * Verify that the page has loaded
   */
  async verifyPageLoaded(): Promise<void> {
    // Wait for the page to be fully loaded
    await this.waitForPageLoad();
    // Check if we can see either the login options or the email form
    await Promise.race([
      this.emailLinkButton.waitFor({ state: "visible", timeout: 5000 }),
      this.emailInput.waitFor({ state: "visible", timeout: 5000 }),
    ]);
  }

  /**
   * Verify that the magic link request form is visible
   */
  async verifyMagicLinkForm(): Promise<void> {
    await this.verifyPageLoaded();
    // The page title is "TT3 - Team Time Table", so we just verify the page loaded
    // and the login elements are available
  }
}
