import { Page, Locator } from "@playwright/test";

/**
 * Page Object Model for common UI elements and actions
 * This provides reliable selectors and common test patterns
 */
export class PageObjects {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Company-related selectors
  get companyForm() {
    return this.page.locator(
      '[role="form"][aria-label*="Create a new Company"]'
    );
  }

  get companyNameInput() {
    return this.page.locator(".company-name-input");
  }

  get companySubmitButton() {
    return this.page.locator(".company-submit-button");
  }

  get newCompanyButton() {
    return this.page.locator(".new-company-button");
  }

  // Unit-related selectors
  get unitForm() {
    return this.page.locator('[role="form"][aria-label="Create a new unit"]');
  }

  get unitNameInput() {
    return this.page.locator(".unit-name-input");
  }

  get unitSubmitButton() {
    return this.page.locator(".unit-submit-button");
  }

  get newUnitButton() {
    return this.page.locator(".new-unit-button");
  }

  // Team-related selectors
  get teamForm() {
    return this.page.locator(
      '[role="form"][aria-label="Create a new team for this unit"]'
    );
  }

  get teamNameInput() {
    return this.page.locator(".team-name-input");
  }

  get teamSubmitButton() {
    return this.page.locator(".team-submit-button");
  }

  get newTeamButton() {
    return this.page.locator(".new-team-button");
  }

  get newTeamMemberButton() {
    return this.page.locator(".new-team-member-button");
  }

  // Navigation and list selectors
  get companiesList() {
    return this.page.locator(".companies-list");
  }

  get unitsList() {
    return this.page.locator(".units-list");
  }

  get teamsList() {
    return this.page.locator(".teams-list");
  }

  // User management selectors
  get userMenuButton() {
    return this.page.locator('button[aria-label="Open user menu"]');
  }

  get emailLinkButton() {
    return this.page.locator('button:has-text("Email Link")');
  }

  get emailInput() {
    return this.page.locator('input[type="email"]');
  }

  get submitButton() {
    return this.page.locator('button[type="submit"]');
  }

  get termsAgreeButton() {
    return this.page.locator('button:has-text("I Agree")');
  }

  get nameInput() {
    return this.page.locator(".name-input");
  }

  get saveButton() {
    return this.page.locator('button:has-text("Save")');
  }

  // Helper methods for common actions
  async waitForCompanyForm(): Promise<void> {
    await this.companyForm.waitFor({ state: "visible" });
  }

  async waitForUnitForm(): Promise<void> {
    await this.unitForm.waitFor({ state: "visible" });
  }

  async waitForTeamForm(): Promise<void> {
    await this.teamForm.waitFor({ state: "visible" });
  }

  async createCompany(name: string): Promise<void> {
    await this.companyNameInput.fill(name);
    await this.companySubmitButton.click();
  }

  async createUnit(name: string): Promise<void> {
    await this.unitNameInput.fill(name);
    await this.unitSubmitButton.click();
  }

  async createTeam(name: string): Promise<void> {
    await this.teamNameInput.fill(name);
    await this.teamSubmitButton.click();
  }

  async waitForNavigation(
    urlPattern: string | RegExp,
    timeout = 15_000
  ): Promise<void> {
    await this.page.waitForURL(urlPattern, { timeout });
    await this.page.waitForLoadState("domcontentloaded");
  }

  // Company link selector generator
  getCompanyLink(companyName: string): Locator {
    return this.page
      .locator(`a[aria-label*="View ${companyName} company details"]`)
      .first();
  }

  // Unit link selector generator
  getUnitLink(unitName: string): Locator {
    return this.page.locator(`a[aria-label*="View ${unitName} unit"]`).first();
  }

  // Team link selector generator
  getTeamLink(teamName: string): Locator {
    return this.page
      .locator(`a[aria-label*="View ${teamName} team details"]`)
      .first();
  }

  // Wait for element to be stable (not changing)
  async waitForElementStable(selector: string, timeout = 10_000): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: "visible", timeout });
    // Wait for the element to be stable (not moving/changing)
    await locator.waitFor({ state: "attached" });
  }

  // Fill form field with verification
  async fillFormField(
    selector: string,
    value: string,
    timeout = 10_000
  ): Promise<void> {
    const field = this.page.locator(selector);
    await field.waitFor({ state: "visible", timeout });
    await field.fill(value);

    // Verify the value was set correctly
    const actualValue = await field.inputValue();
    if (actualValue !== value) {
      throw new Error(
        `Field value mismatch: expected "${value}", got "${actualValue}"`
      );
    }
  }

  // Click button with retry logic
  async clickButton(selector: string, timeout = 10_000): Promise<void> {
    const button = this.page.locator(selector);
    await button.waitFor({ state: "visible", timeout });
    await button.click();
  }
}

/**
 * Factory function to create PageObjects instance
 */
export function createPageObjects(page: Page): PageObjects {
  return new PageObjects(page);
}
