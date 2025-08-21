import { UserManagement, TestUser } from "./user-management";
import { Page } from "@playwright/test";

/**
 * Common test scenarios and patterns for user management
 */
export class TestHelpers {
  private userManagement: UserManagement;

  constructor(userManagement: UserManagement) {
    this.userManagement = userManagement;
  }

  /**
   * Waits for a condition to be met with retry logic
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    maxWaitTime: number = 30000,
    checkInterval: number = 1000
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Condition not met within ${maxWaitTime}ms`);
  }

  /**
   * Waits for an element to be visible and stable (not changing)
   */
  async waitForElementStable(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    const locator = page.locator(selector);
    await locator.waitFor({ state: "visible", timeout });

    // Wait for the element to be stable (attached and visible)
    await locator.waitFor({ state: "attached" });
  }

  /**
   * Retries an action with exponential backoff
   */
  async retryWithBackoff<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Creates a set of users for testing different roles and permissions
   */
  async createRoleBasedUsers(): Promise<{
    admin: TestUser;
    manager: TestUser;
    employee: TestUser;
    contractor: TestUser;
  }> {
    console.log("Creating role-based users for testing...");

    const [admin, manager, employee, contractor] = await Promise.all([
      this.userManagement.createAndLoginUser("Admin User"),
      this.userManagement.createAndLoginUser("Manager User"),
      this.userManagement.createAndLoginUser("Employee User"),
      this.userManagement.createAndLoginUser("Contractor User"),
    ]);

    console.log("✅ All role-based users created and logged in");
    return { admin, manager, employee, contractor };
  }

  /**
   * Creates a set of users for testing team scenarios
   */
  async createTeamUsers(teamSize: number = 3): Promise<TestUser[]> {
    console.log(`Creating ${teamSize} team members for testing...`);

    const teamMembers: TestUser[] = [];

    for (let i = 1; i <= teamSize; i++) {
      const member = await this.userManagement.createAndLoginUser(
        `Team Member ${i}`
      );
      teamMembers.push(member);
    }

    console.log(`✅ Created ${teamMembers.length} team members`);
    return teamMembers;
  }

  /**
   * Creates users for testing company scenarios
   */
  async createCompanyUsers(): Promise<{
    companyOwner: TestUser;
    companyManager: TestUser;
    companyEmployee: TestUser;
  }> {
    console.log("Creating company users for testing...");

    const [companyOwner, companyManager, companyEmployee] = await Promise.all([
      this.userManagement.createAndLoginUser("Company Owner"),
      this.userManagement.createAndLoginUser("Company Manager"),
      this.userManagement.createAndLoginUser("Company Employee"),
    ]);

    console.log("✅ All company users created and logged in");
    return { companyOwner, companyManager, companyEmployee };
  }

  /**
   * Creates users for testing shift scheduling scenarios
   */
  async createShiftUsers(): Promise<{
    scheduler: TestUser;
    worker1: TestUser;
    worker2: TestUser;
    worker3: TestUser;
  }> {
    console.log("Creating shift scheduling users for testing...");

    const [scheduler, worker1, worker2, worker3] = await Promise.all([
      this.userManagement.createAndLoginUser("Shift Scheduler"),
      this.userManagement.createAndLoginUser("Shift Worker 1"),
      this.userManagement.createAndLoginUser("Shift Worker 2"),
      this.userManagement.createAndLoginUser("Shift Worker 3"),
    ]);

    console.log("✅ All shift users created and logged in");
    return { scheduler, worker1, worker2, worker3 };
  }

  /**
   * Creates users for testing leave management scenarios
   */
  async createLeaveManagementUsers(): Promise<{
    hrManager: TestUser;
    departmentManager: TestUser;
    employee: TestUser;
    approver: TestUser;
  }> {
    console.log("Creating leave management users for testing...");

    const [hrManager, departmentManager, employee, approver] =
      await Promise.all([
        this.userManagement.createAndLoginUser("HR Manager"),
        this.userManagement.createAndLoginUser("Department Manager"),
        this.userManagement.createAndLoginUser("Employee"),
        this.userManagement.createAndLoginUser("Leave Approver"),
      ]);

    console.log("✅ All leave management users created and logged in");
    return { hrManager, departmentManager, employee, approver };
  }

  /**
   * Creates a user with custom timeout for slower email environments
   */
  async createUserWithCustomTimeout(
    professionalName: string,
    emailTimeout: number = 180000
  ): Promise<TestUser> {
    console.log(
      `Creating user ${professionalName} with ${emailTimeout}ms email timeout...`
    );

    const user = await this.userManagement.createAndLoginUser(
      professionalName,
      {
        waitForEmailTimeout: emailTimeout,
      }
    );

    console.log(`✅ User ${professionalName} created with custom timeout`);
    return user;
  }

  /**
   * Creates multiple users in parallel for performance testing
   */
  async createUsersInParallel(
    names: string[],
    options: { waitForEmailTimeout?: number } = {}
  ): Promise<TestUser[]> {
    console.log(`Creating ${names.length} users in parallel...`);

    const userPromises = names.map((name) =>
      this.userManagement.createAndLoginUser(name, options)
    );

    const users = await Promise.all(userPromises);
    console.log(`✅ Created ${users.length} users in parallel`);

    return users;
  }

  /**
   * Creates a user and waits for a specific condition before proceeding
   */
  async createUserAndWaitForCondition(
    professionalName: string,
    condition: () => Promise<boolean>,
    maxWaitTime: number = 30000
  ): Promise<TestUser> {
    console.log(
      `Creating user ${professionalName} and waiting for condition...`
    );

    const user = await this.userManagement.createAndLoginUser(professionalName);

    // Wait for the condition to be met
    await this.waitForCondition(condition, maxWaitTime);
    console.log(`✅ Condition met for user ${professionalName}`);

    return user;
  }

  /**
   * Cleans up multiple users at once
   */
  async cleanupUsers(users: TestUser[]): Promise<void> {
    console.log(`Cleaning up ${users.length} users...`);

    const cleanupPromises = users.map((user) =>
      this.userManagement.cleanupUser(user)
    );

    await Promise.all(cleanupPromises);
    console.log(`✅ Cleaned up ${users.length} users`);
  }

  /**
   * Waits for navigation to complete and verifies the URL
   */
  async waitForNavigationAndVerify(
    page: Page,
    expectedUrlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<void> {
    await page.waitForURL(expectedUrlPattern, { timeout });

    // Additional wait to ensure the page is fully loaded
    await page.waitForLoadState("domcontentloaded");
  }

  /**
   * Fills a form field with retry logic
   */
  async fillFormField(
    page: Page,
    selector: string,
    value: string,
    timeout: number = 10000
  ): Promise<void> {
    await this.retryWithBackoff(async () => {
      const field = page.locator(selector);
      await field.waitFor({ state: "visible", timeout });
      await field.fill(value);

      // Verify the value was set correctly
      const actualValue = await field.inputValue();
      if (actualValue !== value) {
        throw new Error(
          `Field value mismatch: expected "${value}", got "${actualValue}"`
        );
      }
    });
  }

  /**
   * Clicks a button with retry logic
   */
  async clickButton(
    page: Page,
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    await this.retryWithBackoff(async () => {
      const button = page.locator(selector);
      await button.waitFor({ state: "visible", timeout });
      await button.click();
    });
  }
}

/**
 * Factory function to create TestHelpers instance
 */
export function createTestHelpers(userManagement: UserManagement): TestHelpers {
  return new TestHelpers(userManagement);
}
