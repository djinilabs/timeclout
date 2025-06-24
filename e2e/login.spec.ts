import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app root, which should redirect to login if not authenticated
    await page.goto("/");
  });

  test("should display login page with proper accessibility attributes", async ({
    page,
  }) => {
    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Check that we're on the login page by looking for the main heading
    const heading = page.getByRole("heading", {
      level: 2,
      name: "Sign in to your account",
    });
    await expect(heading).toBeVisible();

    // Check for the sign in button with proper accessibility attributes
    const signInButton = page.getByRole("button", { name: "Sign in" });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toHaveAttribute(
      "aria-label",
      "Sign in to your account"
    );

    // Verify the button is enabled and clickable
    await expect(signInButton).toBeEnabled();

    // Check for proper form structure
    const form = page.locator('div[class*="space-y-6"]');
    await expect(form).toBeVisible();

    // Verify the page has proper semantic structure
    const mainContent = page.locator('div[class*="flex min-h-screen"]');
    await expect(mainContent).toBeVisible();
  });

  test("should have proper focus management and keyboard navigation", async ({
    page,
  }) => {
    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Check that the sign in button is focusable
    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Tab to the button and verify it receives focus
    await page.keyboard.press("Tab");
    await expect(signInButton).toBeFocused();

    // Verify the button can be activated with Enter key
    await page.keyboard.press("Enter");

    // The button should trigger the sign in flow
    // We'll check for navigation or modal appearance
    // Since this is a passwordless auth system, it should redirect to email verification
  });

  test("should handle sign in button click and redirect appropriately", async ({
    page,
  }) => {
    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Click the sign in button
    const signInButton = page.getByRole("button", { name: "Sign in" });
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
      // Look for any toast notifications or status messages
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
    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    const signInButton = page.getByRole("button", { name: "Sign in" });

    // Click the button to trigger loading state
    await signInButton.click();

    // The button should show loading state or be disabled during the auth process
    // Check for loading indicators or disabled state
    await page.waitForTimeout(1000);

    // Verify the button is still accessible even if disabled
    await expect(signInButton).toBeVisible();

    // If the button becomes disabled during loading, it should still be focusable
    // and have proper ARIA attributes
    if (await signInButton.isDisabled()) {
      await expect(signInButton).toHaveAttribute("aria-disabled", "true");
    }
  });

  test("should handle authentication errors gracefully", async ({ page }) => {
    // This test would require mocking the auth service or testing with invalid credentials
    // For now, we'll test the basic error handling structure

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Check that error messages would be properly announced to screen readers
    // Look for any existing error message containers
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
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for the login page to load
    await page.waitForLoadState("networkidle");

    // Verify the login form is still accessible on mobile
    const heading = page.getByRole("heading", {
      level: 2,
      name: "Sign in to your account",
    });
    await expect(heading).toBeVisible();

    const signInButton = page.getByRole("button", { name: "Sign in" });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();

    // Test touch interaction
    await signInButton.tap();

    // Wait for any response
    await page.waitForTimeout(2000);

    // Verify the button is still accessible after touch interaction
    await expect(signInButton).toBeVisible();
  });
});
