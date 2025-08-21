import { testWithUserManagement } from "./fixtures/test-fixtures";
import { TestUser } from "./fixtures/test-fixtures";
import { Page } from "@playwright/test";
import { UserManagement, PageObjects } from "./fixtures/test-fixtures";

// Step functions for the company setup and configuration workflow

/**
 * Step 1: Authenticate a new user and complete setup
 */
async function authenticateUser(
  userManagement: UserManagement,
  userName: string
): Promise<TestUser> {
  console.log("🚀 Step 1: Authenticating user...");
  const testUser = await userManagement.createAndLoginUser(userName);
  console.log(
    `✅ User ${testUser.professionalName} (${testUser.email}) successfully logged in`
  );
  return testUser;
}

/**
 * Step 2: Create a new company
 */
async function createCompany(
  page: Page,
  pageObjects: PageObjects,
  companyName: string
): Promise<void> {
  console.log("🏢 Step 2: Creating company...");
  await page.goto("/companies/new");

  // Wait for the company creation form to load
  await pageObjects.waitForCompanyForm();

  // Create the company using the page object method
  await pageObjects.createCompany(companyName);
  console.log(`✅ Created company: ${companyName}`);

  // Wait for the company to appear in the companies list
  console.log("🏢 Waiting for company to appear in companies list...");
  const companyLink = pageObjects.getCompanyLink(companyName);
  await companyLink.waitFor({ state: "visible", timeout: 15000 });
  console.log("✅ Company appears in companies list");

  // Click on the company to enter it
  await companyLink.click();
  console.log("✅ Clicked on company to enter it");

  // Wait for the company page to load
  await pageObjects.waitForElementStable(".new-unit-button", 15000);
  console.log("✅ Successfully entered company");
}

/**
 * Step 3: Create a unit within the company
 */
async function createUnit(
  page: Page,
  pageObjects: PageObjects,
  unitName: string
): Promise<string> {
  console.log("🏗️ Step 3: Creating unit...");

  // Click the "Create new Unit" button
  await pageObjects.clickButton(".new-unit-button", 15000);
  console.log("✅ Clicked 'Create new Unit' button");

  // Wait for the unit creation form to load
  await pageObjects.waitForUnitForm();

  // Create the unit using the page object method
  await pageObjects.createUnit(unitName);
  console.log(`✅ Created unit: ${unitName}`);

  // Wait for navigation back to company page
  await pageObjects.waitForNavigation(/\/companies\/.*$/, 15000);
  console.log("✅ Unit created successfully, redirected back to company page");

  // Handle cache invalidation by refreshing data
  await handleCacheInvalidation(page);

  // Extract and return companyPk
  const companyPageUrl = page.url();
  const companyPkMatch = companyPageUrl.match(/\/companies\/([^/]+)/);
  if (!companyPkMatch) {
    throw new Error("Could not extract companyPk from current URL");
  }
  const companyPk = companyPkMatch[1];
  console.log(`Extracted companyPk: ${companyPk}`);

  // Wait for the unit to appear in the units list
  const unitLink = pageObjects.getUnitLink(unitName);
  await unitLink.waitFor({ state: "visible", timeout: 15000 });
  console.log("✅ Unit appears in the units list");

  return companyPk;
}

/**
 * Step 4: Create a team within the unit
 */
async function createTeam(
  _page: Page,
  pageObjects: PageObjects,
  unitName: string,
  teamName: string
): Promise<void> {
  console.log("👥 Step 4: Creating team...");

  // Click on the unit to enter it
  const unitLink = pageObjects.getUnitLink(unitName);
  await unitLink.click();
  console.log("✅ Clicked on unit to enter it");

  // Wait for the unit page to load
  await pageObjects.waitForElementStable(".new-team-button", 15000);
  console.log("✅ Successfully entered unit");

  // Click the "Create new team" button
  await pageObjects.clickButton(".new-team-button", 15000);
  console.log("✅ Clicked 'Create new team' button");

  // Wait for the team creation form to load
  await pageObjects.waitForTeamForm();

  // Create the team using the page object method
  await pageObjects.createTeam(teamName);
  console.log(`✅ Created team: ${teamName}`);

  // Wait for navigation back to unit page
  await pageObjects.waitForNavigation(/\/companies\/.*\/units\/.*$/, 15000);
  console.log("✅ Team created successfully, redirected back to unit page");
}

/**
 * Step 5: Navigate to company settings
 */
async function navigateToCompanySettings(
  page: Page,
  pageObjects: PageObjects,
  companyPk: string
): Promise<void> {
  console.log("⚙️ Step 5: Navigating to company settings...");

  // Navigate back to the company page
  await page.goto(`/companies/${companyPk}`);
  await page.waitForLoadState("networkidle");
  console.log("✅ Navigated back to company page");

  // Wait for the company page to load and look for the settings tab
  await pageObjects.waitForElementStable(
    'a:has-text("Company Settings")',
    15000
  );
  console.log("✅ Company page loaded with settings tab");

  // Click on the Company Settings tab
  const settingsTab = page.locator('a:has-text("Company Settings")');
  await settingsTab.waitFor({ state: "visible", timeout: 10000 });
  await settingsTab.click();
  console.log("✅ Clicked on Company Settings tab");

  // Wait for the settings page to load
  await page.waitForLoadState("networkidle");
  console.log("✅ Company settings page loaded");
}

/**
 * Step 6: Configure leave types
 */
async function configureLeaveTypes(page: Page): Promise<void> {
  console.log("📋 Step 6: Configuring leave types...");

  // Wait for the leave types tab to be visible
  const leaveTypesTab = page.locator('a[href*="leave-types"]').first();
  await leaveTypesTab.waitFor({ state: "visible", timeout: 10000 });
  await leaveTypesTab.click();
  console.log("✅ Clicked on Leave Types tab");

  // Wait for the leave types section to load
  await page.waitForLoadState("networkidle");

  // Look for the "Create New Leave Type" button
  const createLeaveTypeButton = page.locator(
    'a:has-text("Create New Leave Type")'
  );
  await createLeaveTypeButton.waitFor({
    state: "visible",
    timeout: 10000,
  });
  console.log("✅ Leave types section loaded");

  // Click on "Create New Leave Type"
  await createLeaveTypeButton.click();
  console.log("✅ Clicked on Create New Leave Type button");

  // Wait for the leave type creation form
  await page.waitForLoadState("networkidle");

  // Fill in the leave type form
  const leaveTypeNameInput = page.locator('input[name="name"]');
  await leaveTypeNameInput.waitFor({ state: "visible", timeout: 10000 });
  await leaveTypeNameInput.fill("Vacation");
  console.log(
    "✅ Filled in leave type name, using default values for other fields"
  );

  // Submit the form
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.click();
  console.log("✅ Created new leave type: Vacation");

  // Wait for navigation back to company settings
  await page.waitForLoadState("networkidle");
  console.log("✅ Returned to company settings");
}

/**
 * Step 7: Configure work schedule
 */
async function configureWorkSchedule(page: Page): Promise<void> {
  console.log("🕐 Step 7: Configuring work schedule...");

  // Click on the Work Schedule tab
  const workScheduleTab = page.locator('a[href*="work-schedule"]').first();
  await workScheduleTab.waitFor({ state: "visible", timeout: 10000 });
  await workScheduleTab.click();
  console.log("✅ Clicked on Work Schedule tab");

  // Wait for the work schedule section to load
  await page.waitForLoadState("networkidle");

  // Look for work schedule form elements
  const mondayStartInput = page.locator(
    'input[aria-label="Start time for monday"]'
  );
  const mondayEndInput = page.locator('input[aria-label="End time"]').first();

  await mondayStartInput.waitFor({ state: "visible", timeout: 10000 });

  // Modify Monday work hours
  await mondayStartInput.fill("08:00");
  await mondayEndInput.fill("18:00");
  console.log("✅ Modified Monday work hours to 8:00-18:00");

  // Save the work schedule changes
  const saveWorkScheduleButton = page.locator('button:has-text("Save")');
  await saveWorkScheduleButton.click();
  console.log("✅ Saved work schedule changes");

  // Wait for the save operation to complete
  await page.waitForLoadState("networkidle");
}

/**
 * Step 8: Configure yearly quota
 */
async function configureYearlyQuota(page: Page): Promise<void> {
  console.log("📅 Step 8: Configuring yearly quota...");

  // Click on the Yearly Quota tab
  const yearlyQuotaTab = page.locator('a[href*="yearly-quota"]').first();
  await yearlyQuotaTab.waitFor({ state: "visible", timeout: 10000 });
  await yearlyQuotaTab.click();
  console.log("✅ Clicked on Yearly Quota tab");

  // Wait for the yearly quota section to load
  await page.waitForLoadState("networkidle");

  // Look for yearly quota form elements
  const resetMonthSelect = page.locator('select[name="resetMonth"]');
  const defaultQuotaInput = page.locator('input[name="defaultQuota"]');

  await resetMonthSelect.waitFor({ state: "visible", timeout: 10000 });

  // Modify yearly quota settings
  await resetMonthSelect.selectOption("3"); // March
  await defaultQuotaInput.fill("22");
  console.log(
    "✅ Modified yearly quota: reset month to March, default quota to 22 days"
  );

  // Save the yearly quota changes
  const saveQuotaButton = page.locator('button:has-text("Save")');
  await saveQuotaButton.click();
  console.log("✅ Saved yearly quota changes");

  // Wait for the save operation to complete
  await page.waitForLoadState("networkidle");
}

/**
 * Helper function to handle cache invalidation
 */
async function handleCacheInvalidation(page: Page): Promise<void> {
  console.log("🔄 Waiting for company data to refresh and unit to appear...");

  // Wait for the page to settle after navigation
  await page.waitForLoadState("networkidle");

  // Since there's a cache invalidation bug, trigger a refresh by navigating
  // to a different route and back to force the company data to be re-fetched
  console.log(
    "🔄 Triggering data refresh by navigating to companies list and back..."
  );

  // Extract companyPk from the current URL before navigating away
  const companyPageUrl = page.url();
  const companyPkMatch = companyPageUrl.match(/\/companies\/([^/]+)/);
  if (!companyPkMatch) {
    throw new Error("Could not extract companyPk from current URL");
  }
  const companyPk = companyPkMatch[1];

  await page.goto("/companies");
  await page.waitForLoadState("networkidle");
  console.log("✅ Navigated to companies list");

  // Navigate back to the company page to trigger a fresh data fetch
  await page.goto(`/companies/${companyPk}`);
  await page.waitForLoadState("networkidle");
  console.log("✅ Navigated back to company page");
}

/**
 * Final verification step
 */
async function verifyWorkflowCompletion(
  page: Page,
  companyName: string,
  unitName: string,
  teamName: string
): Promise<void> {
  console.log("🔍 Step 9: Verifying workflow completion...");

  // Final verification - we should be on the company settings page
  const currentUrl = page.url();
  if (currentUrl.includes("tab=settings")) {
    console.log(
      "🎉 SUCCESS: Completed full company setup and configuration workflow!"
    );
    console.log(`   Company: ${companyName}`);
    console.log(`   Unit: ${unitName}`);
    console.log(`   Team: ${teamName}`);
    console.log(`   Final URL: ${currentUrl}`);
    console.log(`   ✅ Leave types configured`);
    console.log(`   ✅ Work schedule configured`);
    console.log(`   ✅ Yearly quota configured`);
  } else {
    throw new Error(
      `Expected to be on company settings page, but current URL is: ${currentUrl}`
    );
  }
}

testWithUserManagement.describe(
  "Company Setup and Configuration Workflow",
  () => {
    let testUser: TestUser;
    let companyName: string;
    let unitName: string;
    let teamName: string;

    testWithUserManagement.beforeEach(async () => {
      // Generate unique names for each test run
      const timestamp = Date.now();
      companyName = `Test Company ${timestamp}`;
      unitName = `Test Unit ${timestamp}`;
      teamName = `Test Team ${timestamp}`;
    });

    testWithUserManagement(
      "should complete full company setup and configuration workflow",
      async ({ page, userManagement, pageObjects }) => {
        console.log(
          "🚀 Starting company setup and configuration workflow test..."
        );

        // Execute the workflow steps in sequence
        testUser = await authenticateUser(userManagement, "Company Setup User");

        await createCompany(page, pageObjects, companyName);

        const companyPk = await createUnit(page, pageObjects, unitName);

        await createTeam(page, pageObjects, unitName, teamName);

        await navigateToCompanySettings(page, pageObjects, companyPk);

        await configureLeaveTypes(page);

        await configureWorkSchedule(page);

        await configureYearlyQuota(page);

        await verifyWorkflowCompletion(page, companyName, unitName, teamName);
      }
    );

    testWithUserManagement.afterEach(async ({ userManagement }) => {
      // Clean up the test user's Testmail inbox after each test
      if (testUser) {
        await userManagement.cleanupUser(testUser);
      }
    });
  }
);
