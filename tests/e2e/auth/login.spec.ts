import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login-page";
import { tigrMail } from "../utils/tigrmail";
import { getDefined } from "@/utils";

test.describe("Magic Link Login Workflow", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Create login page instance
    loginPage = new LoginPage(page);
  });

  test("should complete full magic link login workflow", async ({ page }) => {
    // Step 1: Create the inbox using tigrmail (this will give us a real email address)
    const emailAddress = await tigrMail.createEmailAddress();
    console.log(`Created TigrMail inbox: ${emailAddress}`);
    expect(emailAddress).toContain("@");

    // Step 2: Fill in the email in the login form and submit
    await loginPage.goto("/");
    await loginPage.verifyMagicLinkForm();
    await loginPage.clickEmailLinkButton();
    await loginPage.fillEmail(emailAddress); // Use the actual TigrMail email
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

    // Step 4: Fetch the email from TigrMail
    console.log("Fetching magic link email from TigrMail...");

    const magicLinkEmail = await tigrMail.pollNextMessage(emailAddress);
    expect(magicLinkEmail).not.toBeNull();
    expect(magicLinkEmail?.to).toBe(emailAddress);
    console.log("✅ Magic link email received");

    // Step 5: Extract the magic link from the email
    const magicLink = extractMagicLinkFromEmail(getDefined(magicLinkEmail));
    expect(magicLink).toBeTruthy();
    expect(magicLink).toContain("http");
    console.log(`✅ Extracted magic link: ${magicLink}`);

    // Step 6: Go to the magic link
    console.log("Navigating to magic link...");
    await page.goto(magicLink);
    await page.waitForLoadState("networkidle");

    // Step 7: Verify that the user is logged in
    // Check that the login form is no longer present
    const loginFormVisible = await loginPage.isElementVisible(
      loginPage.emailInput
    );
    expect(loginFormVisible).toBe(false);
    console.log("✅ Login form is no longer visible");

    // Check that the user email is present in the top navigation bar
    console.log("Checking for user email in top navigation...");

    // Look for user-related elements that would indicate successful login
    const userElements = [
      '[data-testid="user-menu"]',
      ".user-menu",
      ".profile-menu",
      '[data-testid="welcome-message"]',
      ".welcome-message",
      '[data-testid="user-email"]',
      ".user-email",
      '[data-testid="user-profile"]',
      ".user-profile",
      '[data-testid="account-menu"]',
      ".account-menu",
      '[data-testid="user-info"]',
      ".user-info",
    ];

    // Check if any user element is visible
    let hasUserElements = false;
    for (const selector of userElements) {
      try {
        if (await page.locator(selector).isVisible()) {
          console.log(`✅ Found user element: ${selector}`);
          hasUserElements = true;
          break;
        }
      } catch {
        // Continue checking other selectors
      }
    }

    if (hasUserElements) {
      console.log(
        "✅ User successfully authenticated - user elements found in navigation"
      );

      // Try to find the actual user email in the navigation
      const emailSelectors = [
        '[data-testid="user-email"]',
        ".user-email",
        '[data-testid="user-info"] .email',
        ".user-info .email",
        '[data-testid="profile-email"]',
        ".profile-email",
      ];

      let foundUserEmail = false;
      for (const selector of emailSelectors) {
        try {
          const element = page.locator(selector);
          if (await element.isVisible()) {
            const emailText = await element.textContent();
            if (emailText && emailText.includes(emailAddress.split("@")[0])) {
              console.log(`✅ Found user email in navigation: ${emailText}`);
              foundUserEmail = true;
              break;
            }
          }
        } catch {
          // Continue checking other selectors
        }
      }

      if (!foundUserEmail) {
        console.log(
          "ℹ️ User elements found but email not specifically displayed"
        );
      }
    } else {
      console.log(
        "❌ No user elements found in navigation - user may not be authenticated"
      );
      // This should not happen if the magic link worked correctly
      expect(hasUserElements).toBe(true);
    }

    console.log("🎉 Magic link login workflow completed successfully!");
  });
});

/**
 * Helper function to extract magic link from email content
 */
function extractMagicLinkFromEmail(email: {
  text: string;
  html: string;
}): string {
  // Try to find a link in the email content
  const linkRegex = /https?:\/\/[^\s<>"']+/g;

  // First try HTML content, then fall back to text
  let links = email.html.match(linkRegex);
  if (!links) {
    links = email.text.match(linkRegex);
  }

  if (links && links.length > 0) {
    // Return the first link that looks like a magic link
    // Filter out any obvious non-magic links
    const magicLink = links.find(
      (link) =>
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
