import { test } from "@playwright/test";

test("debug page content", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Take a screenshot to see what's there
  await page.screenshot({ path: "debug-screenshot.png", fullPage: true });

  // Log the page title
  console.log("Page title:", await page.title());

  // Log all headings
  const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
  console.log("Headings found:", headings.length);
  for (const heading of headings) {
    const text = await heading.textContent();
    const tagName = await heading.evaluate((el) => el.tagName.toLowerCase());
    console.log(`- ${tagName}: "${text?.trim()}"`);
  }

  // Log all buttons
  const buttons = await page.locator("button").all();
  console.log("Buttons found:", buttons.length);
  for (const button of buttons) {
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute("aria-label");
    console.log(`- Button: "${text?.trim()}" (aria-label: "${ariaLabel}")`);
  }

  // Log the current URL
  console.log("Current URL:", page.url());

  // Check if there's any loading state
  const loadingElements = await page
    .locator('[role="progressbar"], .loading, [aria-busy="true"]')
    .all();
  console.log("Loading elements found:", loadingElements.length);

  // Wait a bit more to see if anything changes
  await page.waitForTimeout(3000);

  // Take another screenshot
  await page.screenshot({
    path: "debug-screenshot-after-wait.png",
    fullPage: true,
  });
});
