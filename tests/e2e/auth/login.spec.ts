import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { mailslurp } from "../utils/mailslurp";
import { getDefined } from "@/utils";

test.describe("Magic Link Login Workflow", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Create login page instance
    loginPage = new LoginPage(page);
  });

  test("should complete full magic link login workflow", async ({ page }) => {
    // Step 1: Create the inbox using mailslurp (this will give us a real email address)
    const emailAddress = await mailslurp.createEmailAddress();
    console.log(`Created Mailslurp inbox: ${emailAddress}`);
    expect(emailAddress).toContain("@");

    // Step 2: Fill in the email in the login form and submit
    await loginPage.goto("/");
    await loginPage.verifyMagicLinkForm();
    await loginPage.clickEmailLinkButton();
    await loginPage.fillEmail(emailAddress); // Use the actual Mailslurp email
    await loginPage.submitEmail();

    // Step 3: Wait for the form submission to complete and check the response
    console.log("Form submitted, checking response...");

    // Wait a moment for the form submission to process
    await page.waitForTimeout(2000);

    // Check what happened after form submission
    const currentUrl = page.url();
    console.log(`Current URL after form submission: ${currentUrl}`);

    // Check if there are any success/error messages displayed
    const hasSuccessMessage = await loginPage.isElementVisible(
      loginPage.successMessage
    );
    const hasErrorMessage = await loginPage.isElementVisible(
      loginPage.errorMessage
    );
    const hasEmailSentMessage = await loginPage.isElementVisible(
      loginPage.emailSentMessage
    );

    if (hasSuccessMessage || hasEmailSentMessage) {
      console.log("✅ Success message displayed after form submission");
    } else if (hasErrorMessage) {
      console.log("⚠️ Error message displayed after form submission");
      // If there's an error, we can't proceed with the magic link flow
      expect(hasErrorMessage).toBe(false);
    } else {
      console.log(
        "ℹ️ No specific message displayed - checking if form was reset"
      );
      // Check if the form is still visible (might have been reset)
      const formStillVisible = await loginPage.isElementVisible(
        loginPage.emailInput
      );
      if (formStillVisible) {
        console.log(
          "ℹ️ Form is still visible - may need to wait longer for backend response"
        );
        // Wait a bit more for the backend to process
        await page.waitForTimeout(3000);
      }
    }

    // Step 4: Fetch the email from Mailslurp
    console.log("Fetching magic link email from Mailslurp...");

    // Use the improved waitForMessage method with a longer timeout
    const magicLinkEmail = await mailslurp.waitForMessage(emailAddress, 120000); // 2 minutes timeout
    expect(magicLinkEmail).not.toBeNull();
    expect(magicLinkEmail?.to?.[0]).toBe(emailAddress);
    console.log("✅ Magic link email received");

    // Step 5: Extract the magic link from the email
    const magicLink = extractMagicLinkFromEmail(
      getDefined(magicLinkEmail.body)
    );
    expect(magicLink).toBeTruthy();
    expect(magicLink).toContain("http");
    console.log(`✅ Extracted magic link: ${magicLink}`);

    // Step 6: Go to the magic link
    console.log("Navigating to magic link...");
    await page.goto(magicLink);
    await page.waitForLoadState("networkidle");

    // Step 6.5: Handle terms and conditions confirmation page if it appears
    console.log("Checking if terms and conditions page is displayed...");

    // Look for the specific "I Agree" button from AgreementDialog
    const termsButton = page.locator('button:has-text("I Agree")');
    if (await termsButton.isVisible()) {
      console.log("✅ Found terms acceptance button");
      await termsButton.click();
      console.log("✅ Clicked terms acceptance button");

      // Wait for the page to process the acceptance
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(2000);
    } else {
      console.log(
        "ℹ️ No terms and conditions page found, proceeding with authentication check"
      );
    }

    // Step 6.6: Handle professional name form if it appears
    console.log("Checking if professional name form is displayed...");

    // Look for the specific professional name input from MeEdit component
    const nameInput = page.locator(".name-input");
    if (await nameInput.isVisible()) {
      console.log("✅ Found professional name input");

      // Fill in a professional name
      const professionalName = "Test User";
      await nameInput.fill(professionalName);
      console.log(`✅ Filled in professional name: ${professionalName}`);

      // Look for the specific Save button from MeEdit component
      const saveButton = page.locator('button:has-text("Save")');
      if (await saveButton.isVisible()) {
        console.log("✅ Found save button");
        await saveButton.click();
        console.log("✅ Clicked save button");

        // Wait for the form submission to process
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(2000);
      }
    } else {
      console.log(
        "ℹ️ No professional name form found, proceeding with authentication check"
      );
    }

    // Step 7: Verify that the user is logged in
    // Check that the new user name is present in the top navigation bar
    console.log("Checking for user name in top navigation...");

    // Look for the specific user menu button from UserTopBarMenu component
    const userMenuButton = page.locator('button[aria-label="Open user menu"]');
    if (await userMenuButton.isVisible()) {
      console.log(
        "✅ User successfully authenticated - user menu button found"
      );

      // Click the user menu to open it and check the user name
      await userMenuButton.click();

      // Look for the user name span that contains the session user name
      const userNameSpan = page.locator(
        'span[aria-hidden="true"]:has-text("Test User")'
      );
      if (await userNameSpan.isVisible()) {
        const nameText = await userNameSpan.textContent();
        console.log(`✅ Found user name in navigation: ${nameText}`);
      } else {
        console.log("ℹ️ User menu opened but name not specifically displayed");
        // Since we filled in "Test User", we should find it somewhere
        expect(await userNameSpan.isVisible()).toBe(true);
      }
    } else {
      console.log(
        "❌ No user menu button found - user may not be authenticated"
      );
      // This should not happen if the magic link worked correctly
      expect(await userMenuButton.isVisible()).toBe(true);
    }

    console.log("🎉 Magic link login workflow completed successfully!");
  });

  test.afterEach(async () => {
    // Clean up the Mailslurp inbox after each test
    await mailslurp.cleanup();
  });
});

/**
 * Helper function to extract magic link from email content
 */
function extractMagicLinkFromEmail(emailBody: string): string {
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
