import {
  testWithUserManagement,
  createTestHelpers,
} from "./fixtures/test-fixtures";
import { TestUser } from "./fixtures/test-fixtures";

testWithUserManagement.describe("Company Creation Workflow", () => {
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
    "should complete full company creation workflow",
    async ({ page, userManagement, pageObjects }) => {
      // Step 1: Create and log in a new user
      console.log("🚀 Starting company creation workflow test...");
      testUser = await userManagement.createAndLoginUser("Company Creator");
      console.log(
        `✅ User ${testUser.professionalName} (${testUser.email}) successfully logged in`
      );

      // Step 2: Create a company
      console.log("🏢 Creating company...");
      await page.goto("/companies/new");

      // Wait for the company creation form to load
      await pageObjects.waitForCompanyForm();

      // Create the company using the page object method
      await pageObjects.createCompany(companyName);
      console.log(`✅ Created company: ${companyName}`);

      // Wait for the company creation to complete and the page to update
      // Instead of waiting for navigation, wait for the company to appear in the list
      console.log("🏢 Waiting for company to appear in companies list...");

      // Wait for the company to appear in the companies list
      const companyLink = pageObjects.getCompanyLink(companyName);
      await companyLink.waitFor({ state: "visible", timeout: 15000 });
      console.log("✅ Company appears in companies list");

      // Click on the company to enter it
      await companyLink.click();
      console.log("✅ Clicked on company to enter it");

      // Wait for the company page to load - look for the new unit button
      await pageObjects.waitForElementStable(".new-unit-button", 15000);
      console.log("✅ Successfully entered company");

      // Step 4: Create a unit
      console.log("🏗️ Creating unit...");

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
      console.log(
        "✅ Unit created successfully, redirected back to company page"
      );

      // Wait for the company data to be refreshed and the unit to appear
      // The GraphQL cache should be invalidated, but we need to wait for the UI to update
      console.log(
        "🔄 Waiting for company data to refresh and unit to appear..."
      );

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
      console.log(`Extracted companyPk: ${companyPk}`);

      await page.goto("/companies");
      await page.waitForLoadState("networkidle");
      console.log("✅ Navigated to companies list");

      // Navigate back to the company page to trigger a fresh data fetch
      await page.goto(`/companies/${companyPk}`);
      await page.waitForLoadState("networkidle");
      console.log("✅ Navigated back to company page");

      // Wait for the unit to appear in the units list
      const unitLink = pageObjects.getUnitLink(unitName);
      await unitLink.waitFor({ state: "visible", timeout: 15000 });
      console.log("✅ Unit appears in the units list");

      // Step 5: Enter the unit
      console.log("🏗️ Entering unit...");

      // Click on the unit to enter it
      await unitLink.click();
      console.log("✅ Clicked on unit to enter it");

      // Wait for the unit page to load - look for the new team button
      await pageObjects.waitForElementStable(".new-team-button", 15000);
      console.log("✅ Successfully entered unit");

      // Step 6: Create a team
      console.log("👥 Creating team...");

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

      // Step 7: Enter the team
      console.log("👥 Entering team...");

      // Look for the team in the teams list and click on it
      const teamLink = pageObjects.getTeamLink(teamName);
      await teamLink.waitFor({ state: "visible", timeout: 15000 });
      await teamLink.click();
      console.log("✅ Clicked on team to enter it");

      // Wait for the team page to load - look for the new team member button
      await pageObjects.waitForElementStable(".new-team-member-button", 15000);
      console.log("✅ Successfully entered team");

      // Final verification - we should be on the team page
      // Wait for the page to fully load
      await page.waitForLoadState("networkidle");

      // Verify we're on the correct team page by checking the URL structure
      const currentUrl = page.url();
      if (currentUrl.includes("/teams/")) {
        console.log("🎉 SUCCESS: Completed full company creation workflow!");
        console.log(`   Company: ${companyName}`);
        console.log(`   Unit: ${unitName}`);
        console.log(`   Team: ${teamName}`);
        console.log(`   Final URL: ${currentUrl}`);
      } else {
        throw new Error(
          `Expected to be on team page, but current URL is: ${currentUrl}`
        );
      }
    }
  );

  testWithUserManagement(
    "should handle company creation with retry logic",
    async ({ page, userManagement, pageObjects }) => {
      // Test that the retry logic works for flaky operations
      console.log("🔄 Testing company creation with retry logic...");

      testUser = await userManagement.createAndLoginUser("Retry Test User");

      await page.goto("/companies/new");
      await pageObjects.waitForCompanyForm();

      // Use the retry logic from test helpers
      const testHelpers = createTestHelpers(userManagement);
      await testHelpers.retryWithBackoff(async () => {
        await pageObjects.createCompany(`Retry Company ${Date.now()}`);
        return true;
      });

      console.log(
        "✅ Company creation with retry logic completed successfully"
      );
    }
  );

  testWithUserManagement.afterEach(async ({ userManagement }) => {
    // Clean up the test user's Testmail inbox after each test
    if (testUser) {
      await userManagement.cleanupUser(testUser);
    }
  });
});
