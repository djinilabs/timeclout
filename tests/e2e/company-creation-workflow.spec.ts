import { testWithUserManagement } from "./fixtures/test-fixtures";
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
    async ({ page, userManagement }) => {
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
      await page.waitForSelector(".company-form", { timeout: 10000 });

      // Fill in company name
      const companyNameInput = page.locator(".company-name-input");
      await companyNameInput.fill(companyName);
      console.log(`✅ Filled in company name: ${companyName}`);

      // Submit the form
      const companySubmitButton = page.locator(".company-submit-button");
      await companySubmitButton.click();
      console.log("✅ Submitted company creation form");

      // Wait for navigation to complete and verify we're on the companies page
      await page.waitForURL("/", { timeout: 10000 });
      console.log(
        "✅ Company created successfully, redirected to companies page"
      );

      // Step 3: Enter the company
      console.log("🏢 Entering company...");

      // Look for the company in the companies list and click on it
      const companyLink = page
        .locator(`a[aria-label*="View ${companyName} company details"]`)
        .first();
      await companyLink.waitFor({ timeout: 10000 });
      await companyLink.click();
      console.log("✅ Clicked on company to enter it");

      // Wait for the company page to load
      await page.waitForSelector(".new-unit-button", { timeout: 10000 });
      console.log("✅ Successfully entered company");

      // Step 4: Create a unit
      console.log("🏗️ Creating unit...");

      // Look for the "Create new Unit" button and click it
      const newUnitButton = page.locator(".new-unit-button");
      await newUnitButton.waitFor({ timeout: 10000 });
      await newUnitButton.click();
      console.log("✅ Clicked 'Create new Unit' button");

      // Wait for the unit creation form to load
      await page.waitForSelector(".unit-form", { timeout: 10000 });

      // Fill in unit name
      const unitNameInput = page.locator(".unit-name-input");
      await unitNameInput.fill(unitName);
      console.log(`✅ Filled in unit name: ${unitName}`);

      // Submit the form
      const unitSubmitButton = page.locator(".unit-submit-button");
      await unitSubmitButton.click();
      console.log("✅ Submitted unit creation form");

      // Wait for navigation back to company page
      await page.waitForURL(`/companies/*`, { timeout: 10000 });
      console.log(
        "✅ Unit created successfully, redirected back to company page"
      );

      // Refresh the page to ensure the latest data is loaded
      await page.reload();
      console.log("✅ Page refreshed to load latest data");

      // Wait for the unit to appear in the units list
      await page.waitForSelector(`a[aria-label*="View ${unitName} unit"]`, {
        timeout: 10000,
      });
      console.log("✅ Unit appears in the units list");

      // Step 5: Enter the unit
      console.log("🏗️ Entering unit...");

      // Look for the unit in the units list and click on it
      const unitLink = page
        .locator(`a[aria-label*="View ${unitName} unit"]`)
        .first();
      await unitLink.waitFor({ timeout: 10000 });
      await unitLink.click();
      console.log("✅ Clicked on unit to enter it");

      // Wait for the unit page to load
      await page.waitForSelector(".new-team-button", { timeout: 10000 });
      console.log("✅ Successfully entered unit");

      // Step 6: Create a team
      console.log("👥 Creating team...");

      // Look for the "Create new team" button and click it
      const newTeamButton = page.locator(".new-team-button");
      await newTeamButton.waitFor({ timeout: 10000 });
      await newTeamButton.click();
      console.log("✅ Clicked 'Create new team' button");

      // Wait for the team creation form to load
      await page.waitForSelector(".team-form", { timeout: 10000 });

      // Fill in team name
      const teamNameInput = page.locator(".team-name-input");
      await teamNameInput.fill(teamName);
      console.log(`✅ Filled in team name: ${teamName}`);

      // Submit the form
      const teamSubmitButton = page.locator(".team-submit-button");
      await teamSubmitButton.click();
      console.log("✅ Submitted team creation form");

      // Wait for navigation back to unit page
      await page.waitForURL(`/companies/*/units/*`, { timeout: 10000 });
      console.log("✅ Team created successfully, redirected back to unit page");

      // Step 7: Enter the team
      console.log("👥 Entering team...");

      // Look for the team in the teams list and click on it
      const teamLink = page
        .locator(`a[aria-label*="View ${teamName} team details"]`)
        .first();
      await teamLink.waitFor({ timeout: 10000 });
      await teamLink.click();
      console.log("✅ Clicked on team to enter it");

      // Wait for the team page to load
      await page.waitForSelector(".new-team-member-button", { timeout: 10000 });
      console.log("✅ Successfully entered team");

      // Final verification - we should be on the team page
      await page.waitForTimeout(2000); // Give the page time to fully load

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

  testWithUserManagement.afterEach(async ({ userManagement }) => {
    // Clean up the test user's Testmail inbox after each test
    if (testUser) {
      await userManagement.cleanupUser(testUser);
    }
  });
});
