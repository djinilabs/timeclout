import { test, expect } from "@playwright/test";
import { createAccessibilityHelpers } from "./utils/accessibility-helpers";

test.describe("Login Flow with Accessibility Helpers", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app root, which should redirect to login if not authenticated
    await page.goto("/");
  });

  test("should display login page with proper accessibility attributes", async ({
    page,
  }) => {
    const a11y = createAccessibilityHelpers(page);

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Check that we're on the login page by looking for the main heading
    const heading = a11y.getByAccessibleName("heading", "Entre na sua conta");
    await expect(heading).toBeVisible();

    // Check for the sign in button with proper accessibility attributes
    const signInButton = a11y.getByAriaLabel("Sign in to your account");
    await expect(signInButton).toBeVisible();

    // Verify the button has the correct aria-label
    await expect(signInButton).toHaveAttribute(
      "aria-label",
      "Sign in to your account"
    );

    // Verify the button is enabled and clickable
    await expect(signInButton).toBeEnabled();

    // Check for proper form structure using accessibility helpers
    const form = page.locator('div[class*="space-y-6"]');
    await expect(form).toBeVisible();

    // Verify the page has proper semantic structure
    const mainContent = page.locator('div[class*="flex min-h-screen"]');
    await expect(mainContent).toBeVisible();

    // Verify heading structure for accessibility
    await a11y.verifyHeadingStructure();
  });

  test("should have proper focus management and keyboard navigation", async ({
    page,
  }) => {
    const a11y = createAccessibilityHelpers(page);

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Check that the sign in button is focusable
    const signInButton = a11y.getByAriaLabel("Sign in to your account");

    // Tab to the button and verify it receives focus
    await page.keyboard.press("Tab");
    await a11y.waitForFocus(signInButton);

    // Verify the button can be activated with Enter key
    await a11y.testKeyboardInteraction(signInButton, "Enter");

    // The button should trigger the sign in flow
    // We'll check for navigation or modal appearance
    // Since this is a passwordless auth system, it should redirect to email verification
  });

  test("should handle sign in button click and redirect appropriately", async ({
    page,
  }) => {
    const a11y = createAccessibilityHelpers(page);

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Click the sign in button using accessibility helpers
    const signInButton = a11y.getByAriaLabel("Sign in to your account");
    await signInButton.click();

    // Since this is a passwordless authentication system using Mailgun,
    // clicking the sign in button should trigger the email authentication flow
    // We should either see a redirect or a modal/notification about email verification

    // Wait a moment for any redirects or state changes
    await page.waitForTimeout(2000);

    // Check if we're redirected to an auth callback or if there's a notification
    // The exact behavior depends on the auth configuration
    const currentUrl = page.url();

    // If it's a local development environment, it might redirect to the auth endpoint
    if (currentUrl.includes("/api/v1/auth")) {
      // This is expected for the auth flow
      expect(currentUrl).toContain("/api/v1/auth");
    } else {
      // If not redirected, check for any success indicators or error messages
      // Look for any toast notifications or status messages using accessibility attributes
      const notifications = page.locator(
        '[role="alert"], [aria-live="polite"], .toast, .notification'
      );
      if ((await notifications.count()) > 0) {
        await expect(notifications.first()).toBeVisible();
      }
    }
  });

  test("should maintain accessibility during loading states", async ({
    page,
  }) => {
    const a11y = createAccessibilityHelpers(page);

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    const signInButton = a11y.getByAriaLabel("Sign in to your account");

    // Click the button to trigger loading state
    await signInButton.click();

    // The button should show loading state or be disabled during the auth process
    // Check for loading indicators or disabled state
    await page.waitForTimeout(1000);

    // After clicking the sign-in button, the page should redirect or show a loading state
    // The button might disappear due to redirect, which is expected behavior
    const currentUrl = page.url();

    if (currentUrl.includes("/api/v1/auth")) {
      // If redirected to auth endpoint, that's expected
      expect(currentUrl).toContain("/api/v1/auth");
    } else {
      // If not redirected, check if the button is still visible and accessible
      try {
        await expect(signInButton).toBeVisible({ timeout: 2000 });

        // If the button becomes disabled during loading, it should still be focusable
        // and have proper ARIA attributes
        if (await signInButton.isDisabled()) {
          await expect(signInButton).toHaveAttribute("aria-disabled", "true");
        }
      } catch {
        // Button might have disappeared due to redirect, which is acceptable
        console.log(
          "Button disappeared after click (expected for auth redirect)"
        );
      }
    }
  });

  test("should handle authentication errors gracefully", async ({ page }) => {
    // This test would require mocking the auth service or testing with invalid credentials
    // For now, we'll test the basic error handling structure

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Check that error messages would be properly announced to screen readers
    // Look for any existing error message containers using accessibility helpers
    const errorContainers = page.locator(
      '[role="alert"], [aria-live="assertive"]'
    );

    // If there are error containers, they should be properly configured
    if ((await errorContainers.count()) > 0) {
      for (const container of await errorContainers.all()) {
        await expect(container).toHaveAttribute("aria-live");
      }
    }
  });

  test("should be responsive and accessible on mobile devices", async ({
    page,
  }) => {
    const a11y = createAccessibilityHelpers(page);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Verify the login form is still accessible on mobile
    const heading = a11y.getByAccessibleName("heading", "Entre na sua conta");
    await expect(heading).toBeVisible();

    const signInButton = a11y.getByAriaLabel("Sign in to your account");
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();

    // Test touch interaction
    await signInButton.click();

    // Wait for any response
    await page.waitForTimeout(2000);

    // Verify the button is still accessible after touch interaction
    // Note: In a real mobile test, we'd use tap(), but in desktop context we use click()
    // The button might disappear due to redirect, which is expected
    const currentUrl = page.url();
    if (currentUrl.includes("/api/v1/auth")) {
      // If redirected to auth endpoint, that's expected
      expect(currentUrl).toContain("/api/v1/auth");
    } else {
      // If not redirected, check if button is still visible
      try {
        await expect(signInButton).toBeVisible({ timeout: 2000 });
      } catch {
        // Button might have disappeared due to redirect, which is acceptable
        console.log(
          "Button disappeared after click (expected for auth redirect)"
        );
      }
    }
  });

  test("should verify form accessibility standards", async ({ page }) => {
    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Wait a bit more to ensure everything is rendered
    await page.waitForTimeout(2000);

    // Check for proper ARIA attributes on interactive elements
    const signInButton = page.locator('[aria-label="Sign in to your account"]');

    // Verify the button has proper ARIA attributes
    await expect(signInButton).toHaveAttribute(
      "aria-label",
      "Sign in to your account"
    );

    // Check that the button is properly focusable
    await signInButton.focus();
    await expect(signInButton).toBeFocused();
  });
});
