import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the page to be loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Wait for a specific element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  /**
   * Wait for a specific element to not be visible
   */
  async waitForElementHidden(
    locator: Locator,
    timeout?: number
  ): Promise<void> {
    await locator.waitFor({ state: "hidden", timeout });
  }

  /**
   * Click an element and wait for it to be clickable
   */
  async clickElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  /**
   * Fill an input field
   */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.fill(value);
  }

  /**
   * Type text into an input field
   */
  async typeText(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.type(text);
  }

  /**
   * Select an option from a dropdown
   */
  async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.selectOption(value);
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Check if an element exists in the DOM
   */
  async isElementAttached(locator: Locator): Promise<boolean> {
    return (await locator.count()) > 0;
  }

  /**
   * Get text content of an element
   */
  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible" });
    return (await locator.textContent()) || "";
  }

  /**
   * Get attribute value of an element
   */
  async getElementAttribute(
    locator: Locator,
    attribute: string
  ): Promise<string | null> {
    await locator.waitFor({ state: "visible" });
    return await locator.getAttribute(attribute);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Assert that an element is visible
   */
  async expectElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert that an element is not visible
   */
  async expectElementHidden(locator: Locator): Promise<void> {
    await expect(locator).not.toBeVisible();
  }

  /**
   * Assert that an element contains specific text
   */
  async expectElementContainsText(
    locator: Locator,
    text: string
  ): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert that the current URL matches a pattern
   */
  async expectUrlToMatch(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  /**
   * Assert that the page title matches
   */
  async expectTitleToMatch(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }
}
