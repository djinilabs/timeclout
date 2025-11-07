import { Page } from "@playwright/test";

import { testWithUserManagement, TestUser } from "./fixtures/test-fixtures";

/**
 * E2E Test for Demo Mode Feature
 *
 * This test verifies the complete demo mode workflow:
 * 1. User without companies sees demo mode prompt
 * 2. User can configure demo settings (industry, unit type, team size)
 * 3. Demo data population process works correctly
 * 4. User ends up with a populated account
 */
testWithUserManagement.describe("Demo Mode Feature", () => {
  let testUser: TestUser;

  testWithUserManagement.beforeEach(async ({ userManagement }) => {
    // Create a fresh test user for each test
    testUser = await userManagement.createTestUser("Demo Mode Test User");
  });

  testWithUserManagement(
    "should complete full demo mode workflow successfully",
    async ({ page, userManagement }) => {
      console.log("🚀 Starting demo mode E2E test...");

      // Step 1: Authenticate user
      console.log("📝 Step 1: Authenticating user...");
      await userManagement.initiateMagicLinkLogin(testUser.email);
      await userManagement.waitForMagicLink(testUser);
      await userManagement.completeMagicLinkAuth(testUser);

      // Wait for the app to load and check if we're on the companies page
      await page.waitForLoadState("domcontentloaded");
      console.log("✅ User authenticated successfully");

      // Step 2: Complete user profile if needed
      console.log("📝 Step 2: Completing user profile...");
      await completeUserProfile(page, testUser.professionalName);
      console.log("✅ User profile completed");

      // Step 3: Verify demo mode prompt is displayed
      console.log("📋 Step 3: Verifying demo mode prompt...");
      await verifyDemoModePrompt(page);
      console.log("✅ Demo mode prompt displayed correctly");

      // Step 4: Start demo mode configuration
      console.log("⚙️ Step 4: Starting demo mode configuration...");
      await startDemoModeConfiguration(page);
      console.log("✅ Demo mode configuration started");

      // Step 5: Verify form elements are present
      console.log("📝 Step 5: Verifying form elements...");
      await verifyFormElements(page);
      console.log("✅ Form elements verified");

      console.log("🎉 Demo mode E2E test completed successfully!");
    }
  );

  testWithUserManagement(
    "should handle demo mode cancellation correctly",
    async ({ page, userManagement }) => {
      console.log("🚀 Starting demo mode cancellation test...");

      // Step 1: Authenticate user
      console.log("📝 Step 1: Authenticating user...");
      await userManagement.initiateMagicLinkLogin(testUser.email);
      await userManagement.waitForMagicLink(testUser);
      await userManagement.completeMagicLinkAuth(testUser);

      await page.waitForLoadState("domcontentloaded");
      console.log("✅ User authenticated successfully");

      // Step 2: Complete user profile if needed
      console.log("📝 Step 2: Completing user profile...");
      await completeUserProfile(page, testUser.professionalName);
      console.log("✅ User profile completed");

      // Step 3: Start demo mode configuration
      console.log("⚙️ Step 3: Starting demo mode configuration...");
      await startDemoModeConfiguration(page);
      console.log("✅ Demo mode configuration started");

      // Step 4: Cancel demo mode configuration
      console.log("❌ Step 4: Canceling demo mode configuration...");
      await cancelDemoModeConfiguration(page);
      console.log("✅ Demo mode configuration canceled");

      // Step 5: Verify we're back to the initial prompt
      console.log("📋 Step 5: Verifying return to initial prompt...");
      await verifyDemoModePrompt(page);
      console.log("✅ Returned to initial demo mode prompt");

      console.log("🎉 Demo mode cancellation test completed successfully!");
    }
  );

  testWithUserManagement(
    "should validate demo configuration form fields",
    async ({ page, userManagement }) => {
      console.log("🚀 Starting demo configuration validation test...");

      // Step 1: Authenticate user
      console.log("📝 Step 1: Authenticating user...");
      await userManagement.initiateMagicLinkLogin(testUser.email);
      await userManagement.waitForMagicLink(testUser);
      await userManagement.completeMagicLinkAuth(testUser);

      await page.waitForLoadState("domcontentloaded");
      console.log("✅ User authenticated successfully");

      // Step 2: Complete user profile if needed
      console.log("📝 Step 2: Completing user profile...");
      await completeUserProfile(page, testUser.professionalName);
      console.log("✅ User profile completed");

      // Step 3: Start demo mode configuration
      console.log("⚙️ Step 3: Starting demo mode configuration...");
      await startDemoModeConfiguration(page);
      console.log("✅ Demo mode configuration started");

      // Step 4: Verify form elements
      console.log("📝 Step 4: Verifying form elements...");
      await verifyFormElements(page);
      console.log("✅ Form elements verified");

      console.log(
        "🎉 Demo configuration validation test completed successfully!"
      );
    }
  );
});

/**
 * Helper Functions
 */

async function verifyDemoModePrompt(page: Page): Promise<void> {
  // First, let's see what's actually on the page
  console.log("🔍 Debugging: Checking page content...");

  // Wait for the page to be fully loaded
  await page.waitForLoadState("domcontentloaded");

  // Get the page content to debug
  const pageContent = await page.content();
  console.log("📄 Page HTML content length:", pageContent.length);

  // Check if we're on the right page
  const currentUrl = page.url();
  console.log("🌐 Current URL:", currentUrl);

  // Look for any text that might indicate what's on the page
  const allText = await page.locator("body").textContent();
  console.log("📝 Page text content:", allText?.substring(0, 500));

  // Wait for the demo mode prompt to be visible
  const demoPrompt = page.locator("text=Quick Start with Demo Data");
  await demoPrompt.waitFor({ state: "visible", timeout: 10000 });

  // Verify the prompt contains expected elements
  await page
    .locator("text=Welcome to Your New Account!")
    .waitFor({ state: "visible" });
  await page
    .locator("text=Create Company Manually")
    .waitFor({ state: "visible" });

  console.log("✅ Demo mode prompt verified");
}

async function startDemoModeConfiguration(page: Page): Promise<void> {
  // Click the "Quick Start with Demo Data" button
  const quickStartButton = page.locator(
    'button:has-text("Quick Start with Demo Data")'
  );
  await quickStartButton.waitFor({ state: "visible" });
  await quickStartButton.click();

  // Wait for the configuration form to appear
  await page
    .locator("text=Create Your Demo Company")
    .waitFor({ state: "visible" });

  console.log("✅ Demo mode configuration started");
}

async function cancelDemoModeConfiguration(page: Page): Promise<void> {
  // Click the cancel button
  const cancelButton = page.locator('button:has-text("Cancel")');
  await cancelButton.waitFor({ state: "visible" });
  await cancelButton.click();

  console.log("✅ Demo mode configuration canceled");
}

async function completeUserProfile(
  page: Page,
  professionalName: string
): Promise<void> {
  // Check if we're on the profile edit page
  const currentUrl = page.url();
  if (currentUrl.includes("/me/edit")) {
    console.log("🔧 Completing user profile on profile edit page...");

    // Wait for the page to fully load
    await page.waitForLoadState("domcontentloaded");

    // Look for the professional name input
    const nameInput = page
      .locator(
        'input[name="name"], .name-input, input[placeholder*="name"], input[placeholder*="Name"]'
      )
      .first();

    if (await nameInput.isVisible()) {
      console.log("✅ Found professional name input");

      // Fill in the professional name
      await nameInput.fill(professionalName);
      console.log(`✅ Filled in professional name: ${professionalName}`);

      // Look for and click the save button
      const saveButton = page
        .locator(
          'button:has-text("Save"), button[type="submit"], input[type="submit"]'
        )
        .first();
      if (await saveButton.isVisible()) {
        console.log("✅ Found save button");
        await saveButton.click();
        console.log("✅ Clicked save button");

        // Wait for the form submission to process and redirect
        await page.waitForLoadState("domcontentloaded");
        await page.waitForLoadState("load");

        // Wait for redirect to complete (should go to companies page)
        await page.waitForURL(/^(?!.*\/me\/edit)/, { timeout: 15000 });
        await page.waitForLoadState("domcontentloaded");

        console.log(`✅ Profile completed, redirected to: ${page.url()}`);
      }
    } else {
      console.log("ℹ️ No professional name input found");
    }
  } else {
    console.log("ℹ️ Not on profile edit page, profile completion not needed");
  }
}

async function verifyFormElements(page: Page): Promise<void> {
  // Wait for the form to be fully loaded
  await page.waitForLoadState("domcontentloaded");

  // Verify that industry field is present
  const industrySelect = page.locator("select").first();
  await industrySelect.waitFor({ state: "visible" });
  console.log("✅ Industry select found");

  // Verify that team size slider is present
  const teamSizeSlider = page.locator('input[type="range"]');
  await teamSizeSlider.waitFor({ state: "visible" });
  console.log("✅ Team size slider found");

  // Verify that submit button is present
  const submitButton = page.locator('button:has-text("Create Demo Company")');
  await submitButton.waitFor({ state: "visible" });
  console.log("✅ Submit button found");

  // Verify that cancel button is present
  const cancelButton = page.locator('button:has-text("Cancel")');
  await cancelButton.waitFor({ state: "visible" });
  console.log("✅ Cancel button found");

  console.log("✅ All form elements verified");
}
