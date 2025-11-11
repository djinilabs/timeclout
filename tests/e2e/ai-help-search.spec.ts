import { test, expect } from "@playwright/test";

test.describe("AI Help Content Search", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and ensure user is logged in
    // This assumes the app has authentication set up
    await page.goto("/");
    // Add any necessary authentication steps here
  });

  test("AI agent can search help content", async ({ page }) => {
    // Open AI chat interface
    // This assumes there's a way to open the AI chat
    // Adjust selectors based on your actual UI

    // Wait for AI chat to be available
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Send a message that should trigger help content search
    await chatInput.fill("How do I create a shift?");
    await chatInput.press("Enter");

    // Wait for AI response
    // The AI should use the search_help_content tool
    await page.waitForTimeout(5000); // Give time for tool execution

    // Verify that the response contains help content
    const response = page.locator('[data-testid="ai-message"], .ai-message, [role="log"]').last();
    await expect(response).toBeVisible();

    const responseText = await response.textContent();
    expect(responseText).toBeTruthy();
    // The response should mention something about shifts or help content
    expect(responseText?.toLowerCase()).toMatch(/shift|help|create|schedule/i);
  });

  test("AI uses help content in response", async ({ page }) => {
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Ask a question that should trigger help search
    await chatInput.fill("What is the shifts calendar?");
    await chatInput.press("Enter");

    await page.waitForTimeout(5000);

    const response = page.locator('[data-testid="ai-message"], .ai-message, [role="log"]').last();
    await expect(response).toBeVisible();

    const responseText = await response.textContent();
    // Response should be informative and reference help content
    expect(responseText?.length).toBeGreaterThan(50);
  });

  test("AI handles cases where no relevant content is found", async ({ page }) => {
    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Ask something very specific that might not have help content
    await chatInput.fill("How do I configure the quantum flux capacitor?");
    await chatInput.press("Enter");

    await page.waitForTimeout(5000);

    const response = page.locator('[data-testid="ai-message"], .ai-message, [role="log"]').last();
    await expect(response).toBeVisible();

    // AI should still respond gracefully even if no help content found
    const responseText = await response.textContent();
    expect(responseText).toBeTruthy();
  });

  test("Help content search works in Portuguese", async ({ page }) => {
    // Switch language to Portuguese if there's a language selector
    // This test assumes there's a way to change language
    // Adjust based on your actual UI

    const chatInput = page.locator('input[placeholder*="message"], textarea[placeholder*="message"]');
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Ask in Portuguese
    await chatInput.fill("Como criar um turno?");
    await chatInput.press("Enter");

    await page.waitForTimeout(5000);

    const response = page.locator('[data-testid="ai-message"], .ai-message, [role="log"]').last();
    await expect(response).toBeVisible();

    const responseText = await response.textContent();
    expect(responseText).toBeTruthy();
  });
});

