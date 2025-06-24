import { test, expect } from "@playwright/test";

test("simple login test", async ({ page }) => {
  await page.goto("/");

  // Wait for the page to load
  await page.waitForLoadState("networkidle");

  // Wait a bit more to ensure everything is rendered
  await page.waitForTimeout(2000);

  // Check if the heading exists
  const heading = page.getByRole("heading", { level: 2 });
  await expect(heading).toBeVisible();

  // Check if the button exists
  const button = page.getByRole("button");
  await expect(button).toBeVisible();

  // Log what we found
  console.log("Heading text:", await heading.textContent());
  console.log("Button text:", await button.textContent());
  console.log("Button aria-label:", await button.getAttribute("aria-label"));
});
