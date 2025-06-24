import { test } from "@playwright/test";
import { createAccessibilityHelpers } from "./utils/accessibility-helpers";

test("debug selectors", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Try different ways to find the button
  console.log("=== Testing different selectors ===");

  // 1. Basic role selector
  try {
    const button1 = page.getByRole("button", { name: "Entrar" });
    const isVisible1 = await button1.isVisible();
    console.log('1. getByRole("button", { name: "Entrar" }):', isVisible1);
  } catch (e) {
    console.log('1. getByRole("button", { name: "Entrar" }): ERROR', e.message);
  }

  // 2. Accessibility helper
  try {
    const a11y = createAccessibilityHelpers(page);
    const button2 = a11y.getByAccessibleName("button", "Entrar");
    const isVisible2 = await button2.isVisible();
    console.log('2. a11y.getByAccessibleName("button", "Entrar"):', isVisible2);
  } catch (e) {
    console.log(
      '2. a11y.getByAccessibleName("button", "Entrar"): ERROR',
      e.message
    );
  }

  // 3. Text content selector
  try {
    const button3 = page.getByText("Entrar");
    const isVisible3 = await button3.isVisible();
    console.log('3. getByText("Entrar"):', isVisible3);
  } catch (e) {
    console.log('3. getByText("Entrar"): ERROR', e.message);
  }

  // 4. Aria-label selector
  try {
    const button4 = page.locator('[aria-label="Sign in to your account"]');
    const isVisible4 = await button4.isVisible();
    console.log('4. [aria-label="Sign in to your account"]:', isVisible4);
  } catch (e) {
    console.log('4. [aria-label="Sign in to your account"]: ERROR', e.message);
  }

  // 5. Generic button selector
  try {
    const buttons = page.locator("button");
    const count = await buttons.count();
    console.log("5. All buttons count:", count);
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute("aria-label");
      console.log(
        `   Button ${i}: text="${text?.trim()}", aria-label="${ariaLabel}"`
      );
    }
  } catch (e) {
    console.log("5. All buttons: ERROR", e.message);
  }

  // 6. Test with exact text match
  try {
    const button6 = page.getByRole("button", { name: /^Entrar$/ });
    const isVisible6 = await button6.isVisible();
    console.log('6. getByRole("button", { name: /^Entrar$/ }):', isVisible6);
  } catch (e) {
    console.log(
      '6. getByRole("button", { name: /^Entrar$/ }): ERROR',
      e.message
    );
  }

  // Take a screenshot for debugging
  await page.screenshot({ path: "debug-selectors.png", fullPage: true });
});
